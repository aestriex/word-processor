import type { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface RibbonGroupProps {
  children: ReactNode;
}

export function RibbonGroup({ children }: RibbonGroupProps) {
  return (
    <div className="flex h-14 items-center gap-3 px-3">
      <div className="flex items-center gap-1">{children}</div>
      <Separator orientation="vertical" className="h-8" />
    </div>
  );
}
