import { useEditorState } from '@tiptap/react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter, MessageSquarePlus } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { Separator } from '@/components/ui/separator';
import type { FloatingToolbarPosition } from '@/lib/editor/useFloatingToolbar';
import { ColorPickerButton } from '../layout/ribbon/ColorPickerButton';
import { LinkButton } from '../layout/ribbon/LinkButton';
import { ClearFormattingButton } from '../layout/ribbon/home/ClearFormattingButton';
import { IconButton } from '../layout/IconButton';

interface FloatingToolbarProps {
  editor: Editor;
  position: FloatingToolbarPosition;
  containerTop: number;
  containerLeft: number;
}

export function FloatingToolbar({ editor, position, containerTop, containerLeft }: FloatingToolbarProps) {
  const attrs = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive('bold') ?? false,
      isItalic: ctx.editor?.isActive('italic') ?? false,
      isUnderline: ctx.editor?.isActive('underline') ?? false,
      isStrike: ctx.editor?.isActive('strike') ?? false,
    }),
  });

  const translateY = position.placement === 'above' ? 'translateY(calc(-100% - 8px))' : 'translateY(8px)';

  return (
    <div
        data-floating-toolbar
        onMouseDown={(e) => e.preventDefault()}
        className="absolute z-30 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
        style={{
          left: position.left - containerLeft,
          top: (position.placement === 'above' ? position.top : position.bottom) - containerTop,
          transform: translateY,
        }}
      >
        <IconButton
          label="Bold"
          icon={<Bold size={16} />}
          active={attrs?.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          shortcutId="bold"
        />

        <IconButton
          label="Italic"
          icon={<Italic size={16} />}
          active={attrs?.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          shortcutId="italic"
        />

        <IconButton
          label="Underline"
          icon={<UnderlineIcon size={16} />}
          active={attrs?.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          shortcutId="underline"
        />

        <IconButton
          label="Strikethrough"
          icon={<Strikethrough size={16} />}
          active={attrs?.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          shortcutId="strike"
        />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ColorPickerButton
        label="Text Color"
        icon={<span className="text-sm font-semibold">A</span>}
        onChange={(color) => {
          if (color) editor.chain().focus().setColor(color).run();
          else editor.chain().focus().unsetColor().run();
        }}
      />

      <ColorPickerButton
        label="Highlight Color"
        icon={<Highlighter size={16} />}
        resetLabel="Transparent"
        onChange={(color) => {
          if (color) editor.chain().focus().toggleHighlight({ color }).run();
          else editor.chain().focus().unsetHighlight().run();
        }}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <LinkButton editor={editor} />
      <IconButton
        label="Insert Comment"
        icon={<MessageSquarePlus size={16} />}
        onClick={() => { }}
        disabled
      />
      <ClearFormattingButton editor={editor} />
    </div>
  );
}
