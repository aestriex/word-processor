import type { Editor } from '@tiptap/core';

export interface DocumentStats {
  words: number;
  characters: number;
  charactersWithSpaces: number;
}

export function getDocumentStats(editor: Editor): DocumentStats {
  const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ', ' ');
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const characters = text.replace(/\s/g, '').length;
  const charactersWithSpaces = text.length;
  return { words, characters, charactersWithSpaces };
}

export interface CursorPosition {
  line: number;
  column: number;
}

export function getCursorPosition(editor: Editor): CursorPosition {
  const { from } = editor.state.selection;
  const resolvedPos = editor.state.doc.resolve(from);

  let line = 1;
  editor.state.doc.forEach((_node, offset, index) => {
    if (offset < from) line = index + 1;
  });

  const column = resolvedPos.parentOffset + 1;
  return { line, column };
}
