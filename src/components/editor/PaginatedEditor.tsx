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

export function PaginatedEditor({ editor, pageSizeKey, fontFamily, fontSize, margins }: PaginatedEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsets = usePagination(editor, pageSizeKey, margins, containerRef);
  const { width, height } = PAGE_SIZES[pageSizeKey] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];

  return (
    <div ref={containerRef} className="relative mx-auto" style={{ width: `${width}px` }}>
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
