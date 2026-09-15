import { RulerDimensionLine, RectangleHorizontal, FileText, PaintBucket } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function PageSetupGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Margins" icon={<RulerDimensionLine size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Orientation" icon={<RectangleHorizontal size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Paper Size" icon={<FileText size={16} />} onClick={() => { }} disabled />
      <RibbonIconButton label="Page Background" icon={<PaintBucket size={16} />} onClick={() => {}} disabled/>
    </RibbonGroup>
  );
}
