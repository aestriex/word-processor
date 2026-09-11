import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/core';
import type { RefObject } from 'react';
import { measurePageBreaks, findResumePoint, type PageBreak } from './measurePages';
import { setPageBreaks } from './PaginationExtension';
import { PAGE_SIZES, FALLBACK_PAGE_SIZE, PAGINATION_DEBOUNCE_MS } from './constants';

interface Margins {
  top: number;
  bottom: number;
}

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node;
    node = node.parentElement;
  }
  return document.scrollingElement as HTMLElement | null;
}

export function usePagination(
  editor: Editor | null,
  pageSizeKey: string,
  margins: Margins,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [pageOffsets, setPageOffsets] = useState<number[]>([0]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRunAt = useRef(0);
  const isRunning = useRef(false);
  const runAgainAfter = useRef(false);
  const lastBreaksRef = useRef<PageBreak[]>([]);
  const lastOffsetsRef = useRef<number[]>([0]);

  useEffect(() => {
    if (!editor) return;
    const currentEditor = editor;
    lastBreaksRef.current = [];
    lastOffsetsRef.current = [0];

    async function remeasure() {
      if (isRunning.current) {
        runAgainAfter.current = true;
        return;
      }
      isRunning.current = true;

      try {
        const headBefore = currentEditor.view.state.selection.head;
        const scrollParent = getScrollParent(currentEditor.view.dom);
        const topBefore = currentEditor.view.coordsAtPos(headBefore).top;

        await document.fonts.ready;
        const { height } = PAGE_SIZES[pageSizeKey] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];
        const usableHeight = height - margins.top - margins.bottom;

        const resume = { editPos: headBefore, cachedBreaks: lastBreaksRef.current };
        const { keptBreaks } = findResumePoint(resume);

        setPageBreaks(currentEditor.view, keptBreaks);
        await new Promise(requestAnimationFrame);

        const breaks = measurePageBreaks(currentEditor.view, usableHeight, resume);
        setPageBreaks(currentEditor.view, breaks);
        lastBreaksRef.current = breaks;

        await new Promise(requestAnimationFrame);

        const container = containerRef.current;
        const containerTop = container?.getBoundingClientRect().top ?? 0;

        // keptBreaks.length breaks kept => the first (keptBreaks.length + 1)
        // page offsets are provably unaffected (page 0 through the page that
        // starts at the last kept break) — reuse them instead of recomputing.
        // Only offsets for pages at/after the resume point actually need a
        // fresh coordsAtPos call, same principle as the break-measurement fix.
        const stableOffsetCount = keptBreaks.length + 1;
        const offsets = lastOffsetsRef.current.slice(0, stableOffsetCount);

        for (let i = keptBreaks.length; i < breaks.length; i++) {
          const brk = breaks[i];
          const anchorPos = brk.kind === 'node' ? brk.nextRange[0] : brk.pos;
          const realContentTop = currentEditor.view.coordsAtPos(anchorPos).top - containerTop;
          offsets.push(realContentTop - margins.top);
        }

        setPageOffsets(offsets);
        lastOffsetsRef.current = offsets;

        const headNow = currentEditor.view.state.selection.head;
        if (headNow === headBefore && scrollParent) {
          const topAfter = currentEditor.view.coordsAtPos(headNow).top;
          const delta = topAfter - topBefore;
          if (delta !== 0) {
            scrollParent.scrollTo({ top: scrollParent.scrollTop + delta, behavior: 'auto' });
          }
        }
      } finally {
        isRunning.current = false;
        lastRunAt.current = Date.now();
        if (runAgainAfter.current) {
          runAgainAfter.current = false;
          remeasure();
        }
      }
    }

    function scheduleRemeasure() {
      const elapsed = Date.now() - lastRunAt.current;
      if (timer.current) clearTimeout(timer.current);
      if (elapsed >= PAGINATION_DEBOUNCE_MS) {
        remeasure();
      } else {
        timer.current = setTimeout(remeasure, PAGINATION_DEBOUNCE_MS - elapsed);
      }
    }

    scheduleRemeasure();
    currentEditor.on('update', scheduleRemeasure);

    return () => {
      currentEditor.off('update', scheduleRemeasure);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [editor, pageSizeKey, margins.top, margins.bottom, containerRef]);

  return pageOffsets;
}
