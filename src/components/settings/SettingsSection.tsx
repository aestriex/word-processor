import { forwardRef, type ReactNode } from 'react';

interface SettingsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Wraps one labeled group of settings inside a panel. `data-section-id`
 * is what useActiveSection's IntersectionObserver, and the nav's
 * scroll-to-section click handler, both key off of — a data attribute
 * rather than a DOM `id`, since only one panel is ever mounted at a time
 * and there's no need for these to be globally unique across panels.
 */
export const SettingsSection = forwardRef<HTMLDivElement, SettingsSectionProps>(function SettingsSection(
  { id, title, children },
  ref,
) {
  return (
    <div ref={ref} data-section-id={id} className="mb-8 scroll-mt-2 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col divide-y divide-border">{children}</div>
    </div>
  );
});
