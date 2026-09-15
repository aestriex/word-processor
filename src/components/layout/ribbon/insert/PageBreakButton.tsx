import { SquareSplitVertical } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonIconButton } from '../RibbonIconButton';

export function PageBreakButton({ editor }: { editor: Editor }) {
  return (
    <RibbonIconButton
      label="Page Break"
      icon={<SquareSplitVertical size={16} />}
      onClick={() => editor.commands.insertPageBreak()}
      shortcutId="insertPageBreak"
    />
  );
}
