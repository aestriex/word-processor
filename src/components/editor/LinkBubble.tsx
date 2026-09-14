import { useState, useEffect } from 'react';
import { ExternalLink, Pencil, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Editor } from '@tiptap/core';
import type { LinkBubbleState } from '@/lib/editor/useLinkBubble';

interface LinkBubbleProps {
  editor: Editor;
  bubble: LinkBubbleState;
  containerTop: number;
  containerLeft: number;
}

export function LinkBubble({ editor, bubble, containerTop, containerLeft }: LinkBubbleProps) {
  const [editing, setEditing] = useState(false);
  const [urlDraft, setUrlDraft] = useState(bubble.href);

  useEffect(() => {
    setUrlDraft(bubble.href);
    setEditing(false);
  }, [bubble.href, bubble.from]);

  function saveEdit() {
    if (!urlDraft) return;
    const href = /^https?:\/\//i.test(urlDraft) ? urlDraft : `https://${urlDraft}`;
    editor
      .chain()
      .setTextSelection({ from: bubble.from, to: bubble.to })
      .extendMarkRange('link')
      .setLink({ href })
      .run();
    setEditing(false);
  }

  function removeLink() {
    editor
      .chain()
      .setTextSelection({ from: bubble.from, to: bubble.to })
      .extendMarkRange('link')
      .unsetLink()
      .run();
  }

  return (
    <div
      className="absolute z-30 flex items-center gap-1 rounded-md border border-border bg-popover p-1.5 text-sm shadow-md"
      style={{ left: bubble.coords.left - containerLeft, top: bubble.coords.top - containerTop + 4 }}
    >
      {editing ? (
        <>
          <Input
            autoFocus
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className="h-7 w-48 text-xs"
          />
          <Button size="sm" className="h-7 px-2 text-xs" onClick={saveEdit}>
            Save
          </Button>
        </>
      ) : (
        <>
          <a
            href={bubble.href}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-48 truncate text-xs text-primary underline"
          >
            {bubble.href}
          </a>
          <Button variant="ghost" size="icon-xs" onClick={() => window.open(bubble.href, '_blank')}>
            <ExternalLink size={12} />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => setEditing(true)}>
            <Pencil size={12} />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={removeLink}>
            <Link2Off size={12} />
          </Button>
        </>
      )}
    </div>
  );
}
