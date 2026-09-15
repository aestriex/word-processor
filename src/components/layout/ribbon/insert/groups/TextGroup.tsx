import { MessageSquarePlus, Sigma as EquationIcon } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { LinkButton } from '../../LinkButton';
import { IconButton } from '../../../IconButton';
import { SymbolButton } from '../SymbolButton';

export function TextGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup showSeparator={false}>
      <LinkButton editor={editor} />
      <IconButton
        label="Comment"
        icon={<MessageSquarePlus size={16} />}
        onClick={() => {}}
        disabled
      />
      <SymbolButton editor={editor} />
      <IconButton
        label="Equation"
        icon={<EquationIcon size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
