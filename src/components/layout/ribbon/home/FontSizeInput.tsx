import { CaseSensitive } from 'lucide-react';
import { RibbonIconInput } from '../RibbonIconInput';
import type { Editor } from '@tiptap/core';

interface FontSizeInputProps {
  editor: Editor;
  currentSize: string;
}

export function FontSizeInput({ editor, currentSize }: FontSizeInputProps) {
  return (
    <RibbonIconInput
      label="Font Size"
      icon={<CaseSensitive size={14} />}
      value={Number(currentSize) || 16}
      min={1}
      max={400}
      width="w-16"
      showSteppers
      onCommit={(v) => editor.chain().focus().setFontSize(`${v}px`).run()}
    />
  );
}
