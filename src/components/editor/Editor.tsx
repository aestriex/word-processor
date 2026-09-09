import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing…</p>',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl p-4">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert min-h-100 focus:outline-none"
        />
      </div>
    </div>
  );
}
