import { useRef } from 'react';
import { EditorContent, type Editor } from '@tiptap/react';
import { usePagination } from '../../lib/pagination/usePagination';
import { PAGE_SIZES, FALLBACK_PAGE_SIZE } from '../../lib/pagination/constants';
import { SelectionOverlay } from './SelectionOverlay';

interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface PaginatedEditorProps {
  editor: Editor | null;
  pageSizeKey: string;
  fontFamily: string;
  fontSize: number;
  pageGap: number;
  margins: Margins;
}

function handleContainerClick(
  e: React.MouseEvent,
  editor: Editor | null,
  containerEl: HTMLElement | null,
  pageOffsets: number[],
  pageHeight: number,
  width: number,
  margins: Margins
) {
  if (!editor || !containerEl) return;
  if (!editor.state.selection.empty) return; // don't disturb a real drag-selection

  const rect = containerEl.getBoundingClientRect();
  const localX = e.clientX - rect.left;
  const localY = e.clientY - rect.top;

  // Which page was actually clicked, based on the same offsets driving the
  // visible page rectangles — not a raw, page-agnostic screen position.
  let pageIndex = 0;
  for (let i = 0; i < pageOffsets.length; i++) {
    if (pageOffsets[i] <= localY) pageIndex = i;
  }
  const pageTop = pageOffsets[pageIndex];

  // Clamp the click into that page's real content box, so posAtCoords is
  // never asked to search outside this page's actual text.
  const clampedY = Math.min(
    Math.max(localY, pageTop + margins.top),
    pageTop + pageHeight - margins.bottom - 1
  );
  const clampedX = Math.min(Math.max(localX, margins.left), width - margins.right - 1);

  const coords = { left: rect.left + clampedX, top: rect.top + clampedY };
  const result = editor.view.posAtCoords(coords);

  if (result) {
    editor.commands.focus();
    editor.commands.setTextSelection(result.pos);
  } else {
    editor.commands.focus('end');
  }
}

export function PaginatedEditor({ editor, pageSizeKey, fontFamily, fontSize, margins }: PaginatedEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsets = usePagination(editor, pageSizeKey, margins, containerRef);
  const { width, height } = PAGE_SIZES[pageSizeKey] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{ width: `${width}px` }}
      onClick={(e) =>
        handleContainerClick(e, editor, containerRef.current, pageOffsets, height, width, margins)
      }
    >
      {pageOffsets.map((top, i) => (
        <div
          key={i}
          className="absolute left-0 bg-white shadow-lg"
          style={{ top: `${top}px`, width: `${width}px`, height: `${height}px` }}
        />
      ))}

      <div
        className="relative z-10"
        style={{
          paddingTop: `${margins.top}px`,
          paddingBottom: `${margins.bottom}px`,
          paddingLeft: `${margins.left}px`,
          paddingRight: `${margins.right}px`,
        }}
      >
        <EditorContent
          editor={editor}
          className="prose prose-neutral min-h-100 focus:outline-none text-black"
          style={{ fontFamily, fontSize: `${fontSize}px` }}
        />
      </div>

      <SelectionOverlay
        editor={editor}
        containerRef={containerRef}
        pageOffsets={pageOffsets}
        pageHeight={height}
        marginTop={margins.top}
        marginBottom={margins.bottom}
      />
    </div>
  );
}
