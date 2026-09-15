import { useEffect, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import { Link2, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Editor } from '@tiptap/core';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { formatShortcutParts } from '@/lib/shortcuts';

export function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const attrs = useEditorState({
    editor,
    selector: (ctx) => ({
      isActive: ctx.editor?.isActive('link') ?? false,
      href: ctx.editor?.getAttributes('link').href ?? '',
    }),
  });

  useEffect(() => {
    if (open) setUrl(attrs?.href ?? '');
  }, [open, attrs?.href]);

  function applyLink() {
    if (!url) return;
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).setUnderline().run();
    setOpen(false);
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button variant={attrs?.isActive ? 'secondary' : 'ghost'} size="icon-sm">
                  <Link2 size={16} />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          Hyperlink
          <KbdGroup>
            {formatShortcutParts("ctrl+k").map((part, i) => (
              <Kbd key={i}>{part}</Kbd>
            ))}
          </KbdGroup>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-64 p-2">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              }
            }}
            className="h-8 text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-1">
            {attrs?.isActive && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={removeLink}>
                <Link2Off size={12} />
                Remove
              </Button>
            )}
            <Button size="sm" className="h-7 px-2 text-xs" onClick={applyLink}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
