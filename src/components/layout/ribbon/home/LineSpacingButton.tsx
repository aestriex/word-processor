import { useState } from 'react';
import { AlignVerticalSpaceAround, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import type { Editor } from '@tiptap/core';

const PRESETS = [
  { label: 'Single', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: 'Double', value: '2' },
];

export function LineSpacingButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  function apply(value: string) {
    editor.chain().focus().setLineHeight(value).run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="group flex items-stretch overflow-hidden gap-0 rounded-md">
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 rounded-none !hover:bg-transparent group-hover:bg-muted"
                  >
                    <AlignVerticalSpaceAround size={16} />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Line Spacing</TooltipContent>
        </Tooltip>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-8 w-4 rounded-none !hover:bg-transparent group-hover:bg-muted"
            >
              <ChevronDown size={10} />
            </Button>
          }
        />
      </div>

      <PopoverContent className="w-40 p-1">
        <div className="flex flex-col gap-0.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              className="rounded px-2 py-1 text-left text-sm hover:bg-muted"
              onClick={() => apply(preset.value)}
            >
              {preset.label}
            </button>
          ))}

          <div className="flex items-center gap-1 border-t border-border pt-1">
            <Input
              type="number"
              step="0.05"
              min="0.5"
              max="4"
              placeholder="Custom"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="mx-1.5 h-7 text-sm"
            />
            <Button
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => customValue && apply(customValue)}
            >
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
