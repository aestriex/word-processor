import { MessageSquarePlus } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { LinkButton } from '../../LinkButton';
import { RibbonIconButton } from '../../RibbonIconButton';
import { ClearFormattingButton } from '../ClearFormattingButton';

export function ActionsGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup showSeparator={false}>
      <LinkButton editor={editor} />
      <RibbonIconButton
        label="Insert Comment"
        icon={<MessageSquarePlus size={16} />}
        onClick={() => { }}
        disabled
      />
      <ClearFormattingButton editor={editor} />
    </RibbonGroup>
  );
}
