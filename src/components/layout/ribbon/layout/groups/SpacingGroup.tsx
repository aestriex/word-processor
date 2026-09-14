import { useEditorState } from '@tiptap/react';
import { ArrowUpToLine, ArrowDownToLine, IndentIncrease, IndentDecrease } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconInput } from '../../RibbonIconInput';
import type { Editor } from '@tiptap/core';

export function ParagraphSpacingGroup({ editor }: { editor: Editor }) {
  const attrs = useEditorState({
    editor,
    selector: (ctx) => ({
      spaceBefore: ctx.editor?.getAttributes('paragraph').spaceBefore ?? 0,
      spaceAfter: ctx.editor?.getAttributes('paragraph').spaceAfter ?? 0,
      indentLeft: ctx.editor?.getAttributes('paragraph').indentLeft ?? 0,
      indentRight: ctx.editor?.getAttributes('paragraph').indentRight ?? 0,
    }),
  });

  return (
    <RibbonGroup>
      <RibbonIconInput
        label="Space Before"
        icon={<ArrowUpToLine size={14} />}
        value={attrs?.spaceBefore ?? 0}
        onCommit={(v) => editor.chain().updateAttributes('paragraph', { spaceBefore: v }).run()}
        showSteppers
      />
      <RibbonIconInput
        label="Space After"
        icon={<ArrowDownToLine size={14} />}
        value={attrs?.spaceAfter ?? 0}
        onCommit={(v) => editor.chain().updateAttributes('paragraph', { spaceAfter: v }).run()}
        showSteppers
      />
      <RibbonIconInput
        label="Indent Left"
        icon={<IndentIncrease size={14} />}
        value={attrs?.indentLeft ?? 0}
        onCommit={(v) => editor.chain().updateAttributes('paragraph', { indentLeft: v }).run()}
        showSteppers
      />
      <RibbonIconInput
        label="Indent Right"
        icon={<IndentDecrease size={14} />}
        value={attrs?.indentRight ?? 0}
        onCommit={(v) => editor.chain().updateAttributes('paragraph', { indentRight: v }).run()}
        showSteppers
      />
    </RibbonGroup>
  );
}
