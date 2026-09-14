import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SpacingInputProps {
  editor: Editor;
  label: string;
  attribute: 'spaceBefore' | 'spaceAfter' | 'indentLeft' | 'indentRight';
  currentValue: number;
}

export function SpacingInput({ editor, label, attribute, currentValue }: SpacingInputProps) {
  const [localValue, setLocalValue] = useState(String(currentValue));

  useEffect(() => {
    setLocalValue(String(currentValue));
  }, [currentValue]);

  function commit() {
    const num = Number(localValue);
    if (!Number.isNaN(num)) {
      editor.chain().focus().updateAttributes('paragraph', { [attribute]: num }).run();
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Input
            type="number"
            min={0}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
                e.currentTarget.blur();
              }
            }}
            className="mx-1.5 h-8 w-14 text-sm"
          />
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
