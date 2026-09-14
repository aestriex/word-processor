import { useState, useMemo } from 'react';
import { Omega } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SYMBOL_CATEGORIES } from '@/lib/editor/symbols';
import type { Editor } from '@tiptap/core';

export function SymbolButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return SYMBOL_CATEGORIES;
    const q = query.trim().toLowerCase();
    const result: Record<string, typeof SYMBOL_CATEGORIES[string]> = {};
    for (const [category, symbols] of Object.entries(SYMBOL_CATEGORIES)) {
      const matches = symbols.filter((s) => s.name.includes(q));
      if (matches.length > 0) result[category] = matches;
    }
    return result;
  }, [query]);

  function insertSymbol(symbol: string) {
    editor.chain().focus().insertContent(symbol).run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger render={<Button variant="ghost" size="icon-sm"><Omega size={16} /></Button>} />
          }
        />
        <TooltipContent>Insert Symbol</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 p-2">
        <Input
          placeholder="Search symbols…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2 h-8 text-sm"
          autoFocus
        />
        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {Object.keys(filtered).length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">No symbols found</div>
          )}
          {Object.entries(filtered).map(([category, symbols]) => (
            <div key={category}>
              <div className="mb-1 text-[11px] text-muted-foreground">{category}</div>
              <div className="grid grid-cols-10 gap-0.5">
                {symbols.map((s) => (
                  <Tooltip key={s.char}>
                    <TooltipTrigger
                      render={
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-muted"
                          onClick={() => insertSymbol(s.char)}
                        >
                          {s.char}
                        </button>
                      }
                    />
                    <TooltipContent>{s.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
