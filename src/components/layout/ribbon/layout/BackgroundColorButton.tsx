import { PaintBucket } from 'lucide-react';
import { RibbonIconButton } from '../RibbonIconButton';

export function BackgroundColorButton() {
  return (
    <RibbonIconButton
      label="Page Background Color (coming soon)"
      icon={<PaintBucket size={16} />}
      onClick={() => {}}
      disabled
    />
  );
}
