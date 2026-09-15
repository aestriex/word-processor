import { Ruler, PanelTop, Droplet, Superscript, SquareDashed } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';

export function ShowGroup() {
  return (
    <RibbonGroup>
      <IconButton
        label="Show Ruler"
        icon={<Ruler size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Show Margins"
        icon={<SquareDashed size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Show Headers & Footers"
        icon={<PanelTop size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Show Watermark"
        icon={<Droplet size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Show Footnotes & Endnotes"
        icon={<Superscript size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
