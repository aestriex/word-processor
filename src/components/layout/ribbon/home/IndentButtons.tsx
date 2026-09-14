import { IndentIncrease, IndentDecrease } from 'lucide-react';
import { RibbonIconButton } from '../RibbonIconButton';
import type { Editor } from '@tiptap/core';

export function IndentButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <RibbonIconButton
        label="Decrease Indent"
        icon={<IndentDecrease size={16} />}
        onClick={() => editor.chain().focus().decreaseIndent().run()}
        shortcutId="decreaseIndent"
      />
      <RibbonIconButton
        label="Increase Indent"
        icon={<IndentIncrease size={16} />}
        onClick={() => editor.chain().focus().increaseIndent().run()}
        shortcutId="increaseIndent"
      />
    </>
  );
}
