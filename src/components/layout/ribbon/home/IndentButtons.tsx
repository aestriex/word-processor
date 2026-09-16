import { IndentIncrease, IndentDecrease } from 'lucide-react';
import { IconButton } from '../../IconButton';
import type { Editor } from '@tiptap/core';

export function IndentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <IconButton
        label="Decrease Indent"
        icon={<IndentDecrease size={16} />}
        onClick={() => editor.chain().focus().decreaseIndent().run()}
        shortcutId="decreaseIndent"
      />
      <IconButton
        label="Increase Indent"
        icon={<IndentIncrease size={16} />}
        onClick={() => editor.chain().focus().increaseIndent().run()}
        shortcutId="increaseIndent"
      />
    </>
  );
}
