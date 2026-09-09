import { useEffect, useRef, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import { useDocumentStore } from '../../lib/document/store';
import { getDocumentStats, getCursorPosition, type DocumentStats, type CursorPosition } from '../../lib/editor/documentStats';

export function StatusBar() {
  const editor = useDocumentStore((s) => s.editor);

  const cursor = useEditorState<CursorPosition | null>({
    editor,
    selector: (ctx) => (ctx.editor ? getCursorPosition(ctx.editor) : null),
  });

  const rawStats = useEditorState<DocumentStats | null>({
    editor,
    selector: (ctx) => (ctx.editor ? getDocumentStats(ctx.editor) : null),
  });

  const [stats, setStats] = useState<DocumentStats>({ words: 0, characters: 0, charactersWithSpaces: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!rawStats) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStats(rawStats), 150);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [rawStats]);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-4 border-t border-border px-4 py-1 text-xs text-muted">
      <span>{stats.words} words</span>
      <span>{stats.characters} characters</span>
      <span>{stats.charactersWithSpaces} characters (whitespace)</span>
      <span className="ml-auto">
        Ln {cursor?.line ?? 1}, Col {cursor?.column ?? 1}
      </span>
    </div>
  );
}
