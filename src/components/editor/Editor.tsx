import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { useDocumentStore } from '../../lib/document/store';
import { useConfigStore } from '../../lib/config/store';
import { PaginationExtension } from '../../lib/pagination/PaginationExtension';
import { PageBreakNode } from '../../lib/pagination/PageBreakNode';
import { PaginatedEditor } from './PaginatedEditor';

export function Editor() {
  const setEditor = useDocumentStore((s) => s.setEditor);
  const markDirty = useDocumentStore((s) => s.markDirty);
  const pageSetup = useDocumentStore((s) => s.pageSetup);

  const defaultFontFamily = useConfigStore((s) => s.config.editor.defaultFontFamily);
  const defaultFontSize = useConfigStore((s) => s.config.editor.defaultFontSize);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color,
      FontSize,
      PageBreakNode,
      PaginationExtension.configure({
        pageGap: pageSetup.pageGap,
        marginTop: pageSetup.margins.top,
        marginBottom: pageSetup.margins.bottom,
      }),
    ],
    content: '<p>Start typing…</p>',
    onUpdate: () => markDirty(),
  });

  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  return (
    <PaginatedEditor
      editor={editor}
      pageSizeKey={pageSetup.pageSize}
      fontFamily={defaultFontFamily}
      fontSize={defaultFontSize}
      margins={pageSetup.margins}
      pageGap={pageSetup.pageGap}
    />
  );
}
