import { useEffect, useState, type RefObject } from 'react';
import type { Editor } from '@tiptap/core';

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ContentBand {
  top: number;
  bottom: number;
}

function getContentBands(
  pageOffsets: number[],
  pageHeight: number,
  marginTop: number,
  marginBottom: number
): ContentBand[] {
  return pageOffsets.map((top) => ({
    top: top + marginTop,
    bottom: top + (pageHeight - marginBottom),
  }));
}

// Range.getClientRects() can return an extra rect spanning an entire block
// element when that block is fully contained within the selection, on top
// of the normal per-line text rects — producing an oversized highlight box.
// Walking only real Text nodes and measuring each one's own intersection
// with the selection avoids this: a range confined inside one text node can
// never produce a "whole block" rect, since there's no block boundary inside it.
function getTextNodeRects(range: Range): DOMRect[] {
  const root = range.commonAncestorContainer;
  const walker = document.createTreeWalker(
    root.nodeType === Node.TEXT_NODE ? root.parentNode! : root,
    NodeFilter.SHOW_TEXT
  );

  const rects: DOMRect[] = [];
  let node = walker.nextNode();

  while (node) {
    if (range.intersectsNode(node)) {
      const subRange = document.createRange();
      subRange.selectNodeContents(node);

      if (node === range.startContainer) subRange.setStart(node, range.startOffset);
      if (node === range.endContainer) subRange.setEnd(node, range.endOffset);

      for (const r of Array.from(subRange.getClientRects())) {
        if (r.width > 0 && r.height > 0) rects.push(r);
      }
    }
    node = walker.nextNode();
  }

  return rects;
}

interface SelectionOverlayProps {
  editor: Editor | null;
  containerRef: RefObject<HTMLDivElement | null>;
  pageOffsets: number[];
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
}

export function SelectionOverlay({
  editor,
  containerRef,
  pageOffsets,
  pageHeight,
  marginTop,
  marginBottom,
}: SelectionOverlayProps) {
  const [rects, setRects] = useState<HighlightRect[]>([]);

  useEffect(() => {
    if (!editor) return;
    const currentEditor = editor;

    function updateOverlay() {
      const container = containerRef.current;
      if (!container) return;

      const { from, to } = currentEditor.state.selection;
      if (from === to) {
        setRects([]);
        return;
      }

      const domFrom = currentEditor.view.domAtPos(from);
      const domTo = currentEditor.view.domAtPos(to);
      const range = document.createRange();
      try {
        range.setStart(domFrom.node, domFrom.offset);
        range.setEnd(domTo.node, domTo.offset);
      } catch {
        setRects([]);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const bands = getContentBands(pageOffsets, pageHeight, marginTop, marginBottom);
      const clipped: HighlightRect[] = [];

      for (const r of getTextNodeRects(range)) {
        const localTop = r.top - containerRect.top;
        const localBottom = r.bottom - containerRect.top;
        const localLeft = r.left - containerRect.left;

        for (const band of bands) {
          const top = Math.max(localTop, band.top);
          const bottom = Math.min(localBottom, band.bottom);
          if (bottom > top) {
            clipped.push({ top, left: localLeft, width: r.width, height: bottom - top });
          }
        }
      }

      setRects(clipped);
    }

    editor.on('selectionUpdate', updateOverlay);
    return () => {
      editor.off('selectionUpdate', updateOverlay);
    };
  }, [editor, containerRef, pageOffsets, pageHeight, marginTop, marginBottom]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {rects.map((r, i) => (
        <div
          key={i}
          className="absolute bg-blue-400/35"
          style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
        />
      ))}
    </div>
  );
}
