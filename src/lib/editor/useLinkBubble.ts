import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/core';

export interface LinkBubbleState {
  href: string;
  text: string;
  from: number;
  to: number;
  coords: { left: number; top: number };
}

export function useLinkBubble(editor: Editor | null, bubbleElRef: React.RefObject<HTMLElement | null>) {
  const [bubble, setBubble] = useState<LinkBubbleState | null>(null);
  const pinnedRef = useRef(false);

  useEffect(() => {
    if (!editor) return;
    const currentEditor = editor;

    function updateBubble() {
      if (pinnedRef.current) return;

      const { state } = currentEditor;
      const { from } = state.selection;
      const marks = state.doc.resolve(from).marks();
      const linkMark = marks.find((m) => m.type.name === 'link');

      if (!linkMark || !state.selection.empty) {
        setBubble(null);
        return;
      }

      let start = from;
      let end = from;
      const $pos = state.doc.resolve(from);
      const parent = $pos.parent;
      const parentStart = $pos.start();

      parent.forEach((node, offset) => {
        const nodeStart = parentStart + offset;
        const nodeEnd = nodeStart + node.nodeSize;
        if (nodeStart <= from && from <= nodeEnd && node.marks.some((m) => m.type.name === 'link')) {
          start = Math.min(start === from ? nodeStart : start, nodeStart);
          end = Math.max(end === from ? nodeEnd : end, nodeEnd);
        }
      });

      const domCoords = currentEditor.view.coordsAtPos(start);

      setBubble({
        href: linkMark.attrs.href,
        text: state.doc.textBetween(start, end),
        from: start,
        to: end,
        coords: { left: domCoords.left, top: domCoords.bottom },
      });
    }

    function handlePointerDown(e: PointerEvent) {
      const bubbleEl = bubbleElRef.current;
      const target = e.target as Node;
      pinnedRef.current = !!(bubbleEl && bubbleEl.contains(target));
    }

    currentEditor.on('selectionUpdate', updateBubble);
    currentEditor.on('update', updateBubble);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      currentEditor.off('selectionUpdate', updateBubble);
      currentEditor.off('update', updateBubble);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [editor, bubbleElRef]);

  return bubble;
}
