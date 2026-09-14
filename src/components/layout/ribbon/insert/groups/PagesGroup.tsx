import { PanelTop } from 'lucide-react';
import { HorizontalRuleButton } from '../HorizontalRuleButton';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function PagesGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup>
      <HorizontalRuleButton editor={editor} />
      <RibbonIconButton
        label="Header & Footer"
        icon={<PanelTop size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
