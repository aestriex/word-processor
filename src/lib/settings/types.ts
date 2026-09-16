import type { ComponentType } from 'react';

export interface SettingsSectionDefinition {
  id: string;
  label: string;
}

export interface SettingsPanelDefinition {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
  /** Sub-items shown under this panel's nav entry when it's active,
   *  with scroll-spy highlighting (see useActiveSection) — the Discord-
   *  style nested nav. Omit or provide a single-item array for panels
   *  too simple to need it. */
  sections?: SettingsSectionDefinition[];
}
