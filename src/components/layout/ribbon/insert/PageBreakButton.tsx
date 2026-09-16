import { SquareSplitVertical } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { IconButton } from '../../IconButton';

export function PageBreakButton({ editor }: { editor: Editor }) {
  return (
    <IconButton
      label="Page Break"
      icon={<SquareSplitVertical size={16} />}
      onClick={() => editor.commands.insertPageBreak()}
      shortcutId="insertPageBreak"
    />
  );
}
