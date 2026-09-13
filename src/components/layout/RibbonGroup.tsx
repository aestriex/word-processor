import type { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface RibbonGroupProps {
  children: ReactNode;
}

export function RibbonGroup({ children }: RibbonGroupProps) {
  return (
    <div className="flex h-14 items-center">
      <div className="flex items-center gap-1">{children}</div>
      <Separator orientation="vertical" className="mx-2 h-8 self-auto" />
    </div>
  );
}
