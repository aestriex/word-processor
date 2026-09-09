import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentStore } from '../../lib/document/store';

export function Editor() {
  const setEditor = useDocumentStore((s) => s.setEditor);
  const markDirty = useDocumentStore((s) => s.markDirty);

  const editor = useEditor({
    extensions: [StarterKit],
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
      />
    </div>
  );
}
