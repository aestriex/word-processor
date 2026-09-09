import { useEditorState } from '@tiptap/react';
import { useDocumentStore } from '../../lib/document/store';

const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'system-ui'];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export function FormattingToolbar() {
  const editor = useDocumentStore((s) => s.editor);

  const attrs = useEditorState({
    editor,
    selector: (ctx) => ({
      fontFamily: ctx.editor?.getAttributes('textStyle').fontFamily ?? '',
      fontSize: (ctx.editor?.getAttributes('textStyle').fontSize as string | undefined)?.replace('px', '') ?? '',
      color: ctx.editor?.getAttributes('textStyle').color ?? '#000000',
    }),
  });

  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-1.5 text-sm">
      <select
        value={attrs?.fontFamily ?? ''}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="rounded border border-border bg-background px-1 py-0.5"
      >
        <option value="" className="text-foreground">Font</option>
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
        ))}
      </select>

      <select
        value={attrs?.fontSize ?? ''}
        onChange={(e) => editor.chain().focus().setFontSize(`${e.target.value}px`).run()}
        className="rounded border border-border bg-background px-1 py-0.5"
      >
        <option value="">Size</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      <input
        type="color"
        value={attrs?.color ?? '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="h-6 w-6 cursor-pointer rounded border border-border bg-transparent"
        aria-label="Text color"
      />
    </div>
  );
}
