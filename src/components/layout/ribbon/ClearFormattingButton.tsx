import { RemoveFormatting } from 'lucide-react';
import { RibbonIconButton } from './RibbonIconButton';
import type { Editor } from '@tiptap/core';

export function ClearFormattingButton({ editor }: { editor: Editor }) {
  function clearFormatting() {
    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .updateAttributes('paragraph', { lineHeight: null, indent: 0, textAlign: null })
      .updateAttributes('heading', { lineHeight: null, textAlign: null })
      .run();
  }

  return (
    <RibbonIconButton
      label="Clear Formatting"
      icon={<RemoveFormatting size={16} />}
      onClick={clearFormatting}
      shortcutId="clearFormatting"
    />
  );
}
