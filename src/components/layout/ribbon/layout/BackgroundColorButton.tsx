import { PaintBucket } from 'lucide-react';
import { IconButton } from '../../IconButton';

export function BackgroundColorButton() {
  return (
    <IconButton
      label="Page Background Color (coming soon)"
      icon={<PaintBucket size={16} />}
      onClick={() => {}}
      disabled
    />
  );
}
