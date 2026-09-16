import { useEditorState } from '@tiptap/react';
import { Link2 } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { IconButton } from '@/components/layout/IconButton';
import { useLinkEditorStore } from '@/lib/editor/linkEditorStore';

/**
 * Now a thin trigger — same component instance used in the Ribbon's
 * ActionsGroup and in FloatingToolbar, both of which just need to open
 * the shared link editor (LinkBubble, via useLinkBubble's
 * insertRequestId), not maintain their own popover. If the cursor is
 * already on an existing link, the shared hook detects that and opens
 * the rich edit view instead of a blank insert form — see
 * useLinkBubble.ts.
 */
export function LinkButton({ editor }: { editor: Editor }) {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.isActive('link') ?? false,
  });

  return (
    <IconButton
      label="Hyperlink"
      icon={<Link2 size={16} />}
      active={isActive}
      onClick={() => useLinkEditorStore.getState().requestInsert()}
      shortcutId="insertLink"
    />
  );
}
