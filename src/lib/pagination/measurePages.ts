import type { EditorView } from '@tiptap/pm/view';
import type { Node as PMNode } from '@tiptap/pm/model';

export type PageBreak =
  | {
      kind: 'node';
      pos: number;
      leftoverSpace: number;
      prevRange: [number, number] | null;
      nextRange: [number, number];
    }
  | {
      kind: 'line';
      pos: number;
      leftoverSpace: number;
    };

const BREAKABLE_CONTAINERS = new Set(['bulletList', 'orderedList', 'listItem', 'blockquote']);

interface LineRect {
  top: number;
  bottom: number;
  left: number;
  height: number;
}

interface MeasureContext {
  pageStartTop: number | null;
  forcePageBreakBefore: boolean;
}

function breakPos(brk: PageBreak): number {
  return brk.kind === 'node' ? brk.nextRange[0] : brk.pos;
}

export interface ResumeInfo {
  editPos: number;
  cachedBreaks: PageBreak[];
}

/**
 * Finds the last cached break at or before the edit position. Content
 * strictly before that break is provably unaffected by an edit at/after
 * it (normal block flow never lets later content change earlier content's
 * height/position), so those cached breaks can be trusted as-is. Returns
 * resumePos = 0 if the edit occurred before the first cached break, in
 * which case nothing is safe to reuse and a full walk is needed.
 */
export function findResumePoint(resume: ResumeInfo): { resumePos: number; keptBreaks: PageBreak[] } {
  let keptCount = 0;
  for (let i = 0; i < resume.cachedBreaks.length; i++) {
    if (breakPos(resume.cachedBreaks[i]) <= resume.editPos) {
      keptCount = i + 1;
    } else {
      break;
    }
  }
  const keptBreaks = resume.cachedBreaks.slice(0, keptCount);
  const resumePos = keptCount > 0 ? breakPos(keptBreaks[keptCount - 1]) : 0;
  return { resumePos, keptBreaks };
}

export function measurePageBreaks(
  view: EditorView,
  usablePageHeight: number,
  resume?: ResumeInfo
): PageBreak[] {
  const doc = view.state.doc;

  // Cheap, DOM-read-free enumeration of top-level children — used only to
  // locate the resume index, so the expensive part (getBoundingClientRect)
  // only ever runs for children at/after that index, not the whole doc.
  const topLevel: Array<{ node: PMNode; offset: number }> = [];
  doc.forEach((node, offset) => topLevel.push({ node, offset }));

  let startIndex = 0;
  const breaks: PageBreak[] = [];

  if (resume) {
    const { resumePos, keptBreaks } = findResumePoint(resume);
    breaks.push(...keptBreaks);
    for (let i = 0; i < topLevel.length; i++) {
      if (topLevel[i].offset <= resumePos) startIndex = i;
      else break;
    }
  }

  const ctx: MeasureContext = { pageStartTop: null, forcePageBreakBefore: false };
  const lastSiblingRange = new Map<PMNode, [number, number]>();

  function walk(node: PMNode, pos: number, parent: PMNode) {
    const dom = view.nodeDOM(pos);
    if (!(dom instanceof HTMLElement)) return;

    const rect = dom.getBoundingClientRect();
    if (ctx.pageStartTop === null) ctx.pageStartTop = rect.top;

    if (ctx.forcePageBreakBefore) {
      ctx.forcePageBreakBefore = false;
      const priorPageStartTop = ctx.pageStartTop;
      const leftoverSpace = Math.max(0, usablePageHeight - (rect.top - priorPageStartTop));
      breaks.push({
        kind: 'node',
        pos,
        leftoverSpace,
        prevRange: lastSiblingRange.get(parent) ?? null,
        nextRange: [pos, pos + node.nodeSize],
      });
      ctx.pageStartTop = rect.top;
    }

    const pageStartTop = ctx.pageStartTop;

    if (node.type.name === 'pageBreak') {
      lastSiblingRange.set(parent, [pos, pos + node.nodeSize]);
      ctx.forcePageBreakBefore = true;
      return;
    }

    const fits = rect.top + rect.height - pageStartTop <= usablePageHeight;
    if (fits) {
      lastSiblingRange.set(parent, [pos, pos + node.nodeSize]);
      return;
    }

    if (node.isTextblock) {
      if (trySplitLines(view, dom, ctx, usablePageHeight, breaks)) {
        lastSiblingRange.set(parent, [pos, pos + node.nodeSize]);
        return;
      }
    } else if (BREAKABLE_CONTAINERS.has(node.type.name) && node.childCount > 0) {
      node.forEach((child, offsetInParent) => {
        walk(child, pos + 1 + offsetInParent, node);
      });
      lastSiblingRange.set(parent, [pos, pos + node.nodeSize]);
      return;
    }

    if (rect.top > pageStartTop) {
      const leftoverSpace = Math.max(0, usablePageHeight - (rect.top - pageStartTop));
      breaks.push({
        kind: 'node',
        pos,
        leftoverSpace,
        prevRange: lastSiblingRange.get(parent) ?? null,
        nextRange: [pos, pos + node.nodeSize],
      });
    }
    ctx.pageStartTop = rect.top;
    lastSiblingRange.set(parent, [pos, pos + node.nodeSize]);
  }

  for (let i = startIndex; i < topLevel.length; i++) {
    walk(topLevel[i].node, topLevel[i].offset, doc);
  }

  return breaks;
}

function trySplitLines(
  view: EditorView,
  dom: HTMLElement,
  ctx: MeasureContext,
  usablePageHeight: number,
  breaks: PageBreak[]
): boolean {
  const pageStartTop = ctx.pageStartTop as number;

  const range = document.createRange();
  range.selectNodeContents(dom);
  const rects = Array.from(range.getClientRects()).filter((r) => r.height > 0);
  const lines = mergeRectsByLine(rects);
  if (lines.length === 0) return false;

  let cursorTop = pageStartTop;
  let emittedAny = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.bottom - cursorTop > usablePageHeight) {
      if (i === 0 && !emittedAny) return false;

      const coords = view.posAtCoords({ left: line.left + 1, top: line.top + line.height / 2 });
      if (!coords) break;

      const leftoverSpace = Math.max(0, usablePageHeight - (line.top - cursorTop));
      breaks.push({ kind: 'line', pos: coords.pos, leftoverSpace });
      cursorTop = line.top;
      emittedAny = true;
    }
  }

  ctx.pageStartTop = cursorTop;
  return true;
}

function mergeRectsByLine(rects: DOMRect[]): LineRect[] {
  const EPSILON = 2;
  const sorted = [...rects].sort((a, b) => a.top - b.top);
  const lines: LineRect[] = [];

  for (const r of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(r.top - last.top) <= EPSILON) {
      last.left = Math.min(last.left, r.left);
      last.bottom = Math.max(last.bottom, r.bottom);
      last.height = last.bottom - last.top;
    } else {
      lines.push({ top: r.top, bottom: r.bottom, left: r.left, height: r.height });
    }
  }

  return lines;
}
