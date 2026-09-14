import { MessageSquarePlus } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '../../RibbonGroup';
import { LinkButton } from '../LinkButton';
import { RibbonIconButton } from '../RibbonIconButton';
import { ClearFormattingButton } from '../ClearFormattingButton';

export function ActionsGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup>
      <LinkButton editor={editor} />
      <RibbonIconButton
        label="Comment (coming soon)"
        icon={<MessageSquarePlus size={16} />}
        onClick={() => {}}
      />
      <ClearFormattingButton editor={editor} />
    </RibbonGroup>
  );
}
