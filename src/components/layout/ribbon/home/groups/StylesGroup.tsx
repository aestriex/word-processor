import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '../../../RibbonGroup';
import { StylesDropdown } from '../StylesDropdown';

export function StylesGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup>
      <StylesDropdown editor={editor} />
    </RibbonGroup>
  );
}
