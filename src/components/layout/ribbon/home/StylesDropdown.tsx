import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { STYLE_DEFINITIONS } from '@/lib/editor/styleDefinitions';
import type { Editor } from '@tiptap/core';
import { useState } from 'react';

export function StylesDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-sm">
            Styles
            <ChevronDown size={12} />
          </Button>
        }
      />
      <PopoverContent className="w-48 p-1">
        <div className="flex flex-col gap-0.5">
          {STYLE_DEFINITIONS.map((style) => (
            <button
              key={style.id}
              className={`rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${style.previewClassName ?? ''}`}
              onClick={() => {
                style.apply(editor);
                setOpen(false);
              }}
            >
              {style.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
