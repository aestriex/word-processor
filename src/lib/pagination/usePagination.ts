import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/core';
import type { RefObject } from 'react';
import { measurePageBreaks, findResumePoint, type PageBreak } from './measurePages';
import { setPageBreaks } from './PaginationExtension';
import { PAGE_SIZES, FALLBACK_PAGE_SIZE, PAGINATION_DEBOUNCE_MS } from './constants';
import { getScrollParent } from '../editor/domUtils';

interface Margins {
  top: number;
  bottom: number;
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
        await document.fonts.ready;

        const headBefore = currentEditor.view.state.selection.head;
        const scrollParent = getScrollParent(currentEditor.view.dom);
        const topBefore = currentEditor.view.coordsAtPos(headBefore).top;

        const { height } = PAGE_SIZES[pageSizeKey] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];
        const usableHeight = height - margins.top - margins.bottom;

        const resume = { editPos: headBefore, cachedBreaks: lastBreaksRef.current };
        const { keptBreaks } = findResumePoint(resume);

        setPageBreaks(currentEditor.view, keptBreaks);
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);

        const breaks = measurePageBreaks(currentEditor.view, usableHeight, resume);
        console.log('measurePageBreaks result:', { breaksCount: breaks.length, keptCount: keptBreaks.length, resumePos: resume.editPos });
        setPageBreaks(currentEditor.view, breaks);
        lastBreaksRef.current = breaks;
        console.log('cache updated, lastBreaksRef now has:', lastBreaksRef.current.length, 'breaks, positions:', lastBreaksRef.current.map(b => b.kind === 'node' ? b.nextRange[0] : b.pos));

        await new Promise(requestAnimationFrame);

        const container = containerRef.current;
        const containerTop = container?.getBoundingClientRect().top ?? 0;

        const stableOffsetCount = keptBreaks.length + 1;
        const offsets = lastOffsetsRef.current.slice(0, stableOffsetCount);

        for (let i = keptBreaks.length; i < breaks.length; i++) {
          const brk = breaks[i];
          const anchorPos = brk.kind === 'node' ? brk.nextRange[0] : brk.pos;

          // coordsAtPos(anchorPos) is ambiguous here: the pagination spacer widget
          // is placed at this exact position with side -1 (PaginationExtension.ts),
          // and coordsAtPos defaults to the same side, so it can resolve to either
          // side of the spacer depending on transient DOM state while the page
          // currently being typed on is still reflowing - the same class of
          // coordsAtPos unreliability at line-start/soft-wrap boundaries already
          // documented in useFloatingToolbar.ts. For 'node' breaks, measure the
          // actual node's rect directly, matching how measurePages.ts itself
          // locates breaks. 'line' breaks land mid-text with no element to grab,
          // so measure the break's own spacer widget instead (it's tagged with
          // data-break-pos) - its bottom edge is exactly where the new page's
          // content starts, no position resolution involved at all.
          const dom = brk.kind === 'node' ? currentEditor.view.nodeDOM(anchorPos) : null;
          let top: number;
          if (dom instanceof HTMLElement) {
            top = dom.getBoundingClientRect().top;
          } else {
            const spacer = currentEditor.view.dom.querySelector<HTMLElement>(
              `[data-break-pos="${brk.pos}"]`
            );
            top = spacer ? spacer.getBoundingClientRect().bottom : currentEditor.view.coordsAtPos(anchorPos, 1).top;
          }
          const realContentTop = top - containerTop;
          offsets.push(realContentTop - margins.top);
        }

        setPageOffsets(offsets);
        lastOffsetsRef.current = offsets;

        const headNow = currentEditor.view.state.selection.head;
        if (headNow === headBefore && scrollParent) {
          const topAfter = currentEditor.view.coordsAtPos(headNow).top;
          const delta = topAfter - topBefore;
          if (delta !== 0) {
            console.log('scroll correction applied:', { delta, topBefore, topAfter });
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
