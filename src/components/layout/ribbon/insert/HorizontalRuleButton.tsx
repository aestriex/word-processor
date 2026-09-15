import { Minus } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonIconButton } from '../RibbonIconButton';

export function HorizontalRuleButton({ editor }: { editor: Editor }) {
  return (
    <RibbonIconButton
      label="Horizontal Line"
      icon={<Minus size={16} />}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    />
  );
}
