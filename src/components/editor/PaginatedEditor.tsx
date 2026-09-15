import { useRef } from "react";
import { EditorContent, type Editor } from "@tiptap/react";
import { usePagination } from "../../lib/pagination/usePagination";
import { PAGE_SIZES, FALLBACK_PAGE_SIZE } from "../../lib/pagination/constants";
import { SelectionOverlay } from "./SelectionOverlay";
import { useLinkBubble } from "@/lib/editor/useLinkBubble";
import { LinkBubble } from "./LinkBubble";
import { TooltipProvider } from "../ui/tooltip";
import { useConfigStore } from "@/lib/config/store";

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
  margins: Margins,
) {
  if (!editor || !containerEl) return;
  if (!editor.state.selection.empty) return;

  const target = e.target as HTMLElement;
  if (target.closest('[data-link-bubble]')) return;

  const rect = containerEl.getBoundingClientRect();
  const localX = e.clientX - rect.left;
  const localY = e.clientY - rect.top;

  let pageIndex = 0;
  for (let i = 0; i < pageOffsets.length; i++) {
    if (pageOffsets[i] <= localY) pageIndex = i;
  }
  const pageTop = pageOffsets[pageIndex];

  const clampedY = Math.min(
    Math.max(localY, pageTop + margins.top),
    pageTop + pageHeight - margins.bottom - 1,
  );
  const clampedX = Math.min(
    Math.max(localX, margins.left),
    width - margins.right - 1,
  );

  const coords = { left: rect.left + clampedX, top: rect.top + clampedY };
  const result = editor.view.posAtCoords(coords);

  if (result) {
    editor.commands.focus();
    editor.commands.setTextSelection(result.pos);
  } else {
    editor.commands.focus("end");
  }
}

export function PaginatedEditor({
  editor,
  pageSizeKey,
  fontFamily,
  fontSize,
  margins,
}: PaginatedEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageOffsets = usePagination(editor, pageSizeKey, margins, containerRef);
  const linkBubbleRef = useRef<HTMLDivElement>(null);
  const linkBubble = useLinkBubble(editor, linkBubbleRef);
  const showNonPrintingChars = useConfigStore((s) => s.config.editor.showNonPrintingChars);
  const { width, height } =
    PAGE_SIZES[pageSizeKey] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ width: `${width}px` }}
        onClick={(e) =>
          handleContainerClick(
            e,
            editor,
            containerRef.current,
            pageOffsets,
            height,
            width,
            margins,
          )
        }
      >
        {pageOffsets.map((top, i) => (
          <div
            key={i}
            className="absolute left-0 bg-white shadow-lg"
            style={{
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
            }}
          />
        ))}

        <div
          className={`relative z-10 ${showNonPrintingChars ? "show-non-printing" : ""}`}
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

        {linkBubble && editor && containerRef.current && (
          <LinkBubble
            ref={linkBubbleRef}
            editor={editor}
            bubble={linkBubble}
            containerTop={containerRef.current.getBoundingClientRect().top}
            containerLeft={containerRef.current.getBoundingClientRect().left}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
