import type { ReactNode } from 'react';
import { useConfigStore } from '../../lib/config/store';
import { PAGE_SIZES, FALLBACK_PAGE_SIZE, DEFAULT_MARGINS } from '../../lib/pagination/constants';

interface PageProps {
  children: ReactNode;
}

export function Page({ children }: PageProps) {
  const configuredSize = useConfigStore((s) => s.config.editor.defaultPageSize);
  const { width, height } = PAGE_SIZES[configuredSize] ?? PAGE_SIZES[FALLBACK_PAGE_SIZE];

  return (
    <div
      className="mx-auto mb-8 bg-white text-black shadow-lg"
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        paddingTop: `${DEFAULT_MARGINS.top}px`,
        paddingBottom: `${DEFAULT_MARGINS.bottom}px`,
        paddingLeft: `${DEFAULT_MARGINS.left}px`,
        paddingRight: `${DEFAULT_MARGINS.right}px`,
      }}
    >
      {children}
    </div>
  );
}
