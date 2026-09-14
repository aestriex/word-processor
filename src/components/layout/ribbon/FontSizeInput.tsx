import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FontSizeInputProps {
  editor: Editor;
  currentSize: string;
}

const MIN_SIZE = 1;
const MAX_SIZE = 400;

export function FontSizeInput({ editor, currentSize }: FontSizeInputProps) {
  const [localValue, setLocalValue] = useState(currentSize);

  useEffect(() => {
    setLocalValue(currentSize);
  }, [currentSize]);

  function commit() {
    if (localValue) {
      editor.chain().focus().setFontSize(`${localValue}px`).run();
    }
  }

  function step(delta: number) {
    const current = parseInt(localValue || currentSize || '16', 10);
    const next = Math.min(MAX_SIZE, Math.max(MIN_SIZE, current + delta));
    setLocalValue(String(next));
    editor.chain().focus().setFontSize(`${next}px`).run();
  }

  return (
    <div className="flex h-8 items-stretch overflow-hidden rounded-md border border-input">
      <Tooltip>
        <TooltipTrigger
          render={
            <Input
              type="number"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commit();
                  e.currentTarget.blur();
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  step(1);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  step(-1);
                }
              }}
              className="h-full w-12 rounded-none border-0 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          }
        />
        <TooltipContent>Font Size</TooltipContent>
      </Tooltip>

      <div className="flex h-full w-5 flex-none flex-col border-l border-input">
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-1/2 w-full flex-none items-end justify-center rounded-none p-0"
          onClick={() => step(1)}
          tabIndex={-1}
        >
          <ChevronUp size={10} className="translate-y-px" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-1/2 w-full flex-none items-start justify-center rounded-none p-0"
          onClick={() => step(-1)}
          tabIndex={-1}
        >
          <ChevronDown size={10} className="-translate-y-px" />
        </Button>
      </div>
    </div>
  );
}
