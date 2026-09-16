import { Minus } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { IconButton } from '../../IconButton';

export function HorizontalRuleButton({ editor }: { editor: Editor }) {
  return (
    <IconButton
      label="Horizontal Line"
      icon={<Minus size={16} />}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    />
  );
}
