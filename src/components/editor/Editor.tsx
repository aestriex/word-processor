import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { useDocumentStore } from '../../lib/document/store';
import { useConfigStore } from '../../lib/config/store';

export function Editor() {
  const setEditor = useDocumentStore((s) => s.setEditor);
  const markDirty = useDocumentStore((s) => s.markDirty);

  const defaultFontFamily = useConfigStore((s) => s.config.editor.defaultFontFamily);
  const defaultFontSize = useConfigStore((s) => s.config.editor.defaultFontSize);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      FontSize,
    ],
    content: '<p>Start typing…</p>',
    onUpdate: () => markDirty(),
  });

  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <EditorContent
        editor={editor}
        className="prose prose-neutral dark:prose-invert min-h-100 focus:outline-none"
        style={{ fontFamily: defaultFontFamily, fontSize: `${defaultFontSize}px` }}
      />
    </div>
  );
}
