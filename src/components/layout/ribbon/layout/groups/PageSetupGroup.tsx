import { RulerDimensionLine, RectangleHorizontal, FileText, PaintBucket } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';

export function PageSetupGroup() {
  return (
    <RibbonGroup>
      <IconButton label="Margins" icon={<RulerDimensionLine size={16} />} onClick={() => {}} disabled />
      <IconButton label="Orientation" icon={<RectangleHorizontal size={16} />} onClick={() => {}} disabled />
      <IconButton label="Paper Size" icon={<FileText size={16} />} onClick={() => { }} disabled />
      <IconButton label="Page Background" icon={<PaintBucket size={16} />} onClick={() => {}} disabled/>
    </RibbonGroup>
  );
}
