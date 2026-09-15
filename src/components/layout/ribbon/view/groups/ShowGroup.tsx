import { Ruler, PanelTop, Droplet, Superscript, SquareDashed } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function ShowGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton
        label="Show Ruler"
        icon={<Ruler size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Show Margins"
        icon={<SquareDashed size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Show Headers & Footers"
        icon={<PanelTop size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Show Watermark"
        icon={<Droplet size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Show Footnotes & Endnotes"
        icon={<Superscript size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
