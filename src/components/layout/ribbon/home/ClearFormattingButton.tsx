import { RemoveFormatting } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { IconButton } from '../../IconButton';

export function clearFormatting(editor) {
  editor
    .chain()
    .focus()
    .unsetAllMarks()
    .updateAttributes('paragraph', { lineHeight: null, indent: 0, textAlign: null })
    .updateAttributes('heading', { lineHeight: null, textAlign: null })
    .run();
}

export function ClearFormattingButton({ editor }: { editor: Editor }) {
  return (
    <IconButton
      label="Clear Formatting"
      icon={<RemoveFormatting size={16} />}
      onClick={(e: Editor) => { clearFormatting(e) }}
      shortcutId="clearFormatting"
    />
  );
}
