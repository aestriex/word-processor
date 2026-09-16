import { forwardRef, useState, useEffect } from 'react';
import { ExternalLink, Pencil, Link2Off, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { openUrl } from '@tauri-apps/plugin-opener';
import type { Editor } from '@tiptap/core';
import type { LinkBubbleState } from '@/lib/editor/useLinkBubble';
import { fetchLinkMetadata, type LinkMetadata } from '@/lib/editor/linkMetadata';
import { useLinkEditorStore } from '@/lib/editor/linkEditorStore';

interface LinkBubbleProps {
  editor: Editor;
  bubble: LinkBubbleState;
  containerTop: number;
  containerLeft: number;
}

export const LinkBubble = forwardRef<HTMLDivElement, LinkBubbleProps>(function LinkBubble(
  { editor, bubble, containerTop, containerLeft },
  ref
) {
  function handleClose() {
    useLinkEditorStore.getState().requestClose();
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  }

  const [insertUrl, setInsertUrl] = useState('');
  const [insertText, setInsertText] = useState(bubble.text);

  useEffect(() => {
    if (bubble.mode !== 'insert') return;
    setInsertUrl('');
    setInsertText(bubble.text);
  }, [bubble.mode, bubble.from, bubble.to, bubble.text]);

  function applyInsert() {
      if (!insertUrl) return;
      const href = /^https?:\/\//i.test(insertUrl) ? insertUrl : `https://${insertUrl}`;
      const displayText = bubble.text || insertText || href;

      if (bubble.from === bubble.to) {
        editor
          .chain()
          .focus()
          .insertContentAt(bubble.from, {
            type: 'text',
            text: displayText,
            marks: [{ type: 'link', attrs: { href } }, { type: 'underline' }],
          })
          .setTextSelection(bubble.from + displayText.length)
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setTextSelection({ from: bubble.from, to: bubble.to })
          .extendMarkRange('link')
          .setLink({ href })
          .setUnderline()
          .run();
      }

      handleClose();
    }

  const [editing, setEditing] = useState(false);
  const [urlDraft, setUrlDraft] = useState(bubble.href);
  const [activeHref, setActiveHref] = useState(bubble.href);
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    if (bubble.mode !== 'edit') return;
    setActiveHref(bubble.href);
  }, [bubble.mode, bubble.href, bubble.from]);

  useEffect(() => {
    if (bubble.mode !== 'edit') return;
    setUrlDraft(activeHref);
    setEditing(false);
    setMetadata(null);
    setStatus('loading');

    let cancelled = false;
    fetchLinkMetadata(activeHref).then((result) => {
      if (cancelled) return;
      setMetadata(result);
      setStatus(result ? 'done' : 'error');
    });

    return () => {
      cancelled = true;
    };
  }, [bubble.mode, activeHref]);

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
    setActiveHref(href);

    setMetadata(null);
    setStatus('loading');
    fetchLinkMetadata(href).then((result) => {
      setMetadata(result);
      setStatus(result ? 'done' : 'error');
    });
  }

  function removeLink() {
    editor
      .chain()
      .setTextSelection({ from: bubble.from, to: bubble.to })
      .extendMarkRange('link')
      .unsetLink()
      .run();
    handleClose();
  }

  const popoverStyle = { left: bubble.coords.left - containerLeft, top: bubble.coords.top - containerTop + 4 };

  if (bubble.mode === 'insert') {
    return (
      <div
        ref={ref}
        data-link-bubble
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="absolute z-30 w-72 rounded-lg border border-border bg-popover p-3 text-sm shadow-md"
        style={popoverStyle}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Add Link</span>
          <Button variant="ghost" size="icon-xs" onClick={handleClose}>
            <X size={12} />
          </Button>
        </div>

        {bubble.text === '' && (
          <div className="mb-2">
            <label className="mb-1 block text-xs text-muted-foreground">Text to display</label>
            <Input
              value={insertText}
              onChange={(e) => setInsertText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyInsert()}
              className="h-7 text-xs"
              placeholder="Link text"
            />
          </div>
        )}

        <div className="mb-2">
          <label className="mb-1 block text-xs text-muted-foreground">Link</label>
          <Input
            autoFocus
            value={insertUrl}
            onChange={(e) => setInsertUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyInsert();
              }
            }}
            className="h-7 text-xs"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 px-2 text-xs" onClick={applyInsert} disabled={!insertUrl}>
            Insert
          </Button>
        </div>
      </div>
    );
  }

  let hostname = activeHref;
  try {
    hostname = new URL(activeHref).hostname;
  } catch {
  }

  return (
    <div
      ref={ref}
      data-link-bubble
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      className="absolute z-30 w-72 rounded-lg border border-border bg-popover p-3 text-sm shadow-md"
      style={popoverStyle}
    >
      {editing ? (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Edit Link</span>
            <Button variant="ghost" size="icon-xs" onClick={handleClose}>
              <X size={12} />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Input
              autoFocus
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              className="h-7 flex-1 text-xs"
            />
            <Button size="sm" className="h-7 px-2 text-xs" onClick={saveEdit}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {status === 'loading' ? (
                <Skeleton className="h-5 w-5 flex-none rounded-sm" />
              ) : metadata?.favicon ? (
                <div className="flex h-5 w-5 flex-none items-center justify-center rounded-sm bg-white p-0.5">
                  <img src={metadata.favicon} alt="" className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-5 w-5 flex-none rounded-sm bg-muted" />
              )}
              <button
                type="button"
                onClick={() => openUrl(activeHref)}
                className="truncate text-left font-medium cursor-pointer hover:text-primary"
              >
                {metadata?.title || hostname}
              </button>
            </div>

            <div className="flex flex-none items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => navigator.clipboard.writeText(activeHref)}
                    >
                      <Copy size={12} />
                    </Button>
                  }
                />
                <TooltipContent>Copy link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon-xs" onClick={() => setEditing(true)}>
                      <Pencil size={12} />
                    </Button>
                  }
                />
                <TooltipContent>Edit link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon-xs" onClick={removeLink}>
                      <Link2Off size={12} />
                    </Button>
                  }
                />
                <TooltipContent>Remove link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon-xs" onClick={() => openUrl(activeHref)}>
                      <ExternalLink size={12} />
                    </Button>
                  }
                />
                <TooltipContent>Open in browser</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="mt-0.5 truncate text-xs text-muted-foreground">{hostname}</div>

          {status === 'loading' && <Skeleton className="mt-2 h-3 w-full" />}
          {status === 'done' && metadata?.description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{metadata.description}</p>
          )}
        </>
      )}
    </div>
  );
});
