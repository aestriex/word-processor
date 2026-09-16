import { Keyboard, Info, Settings2, ShieldCheck } from 'lucide-react';
import { ShortcutsPanel, SHORTCUTS_PANEL_SECTIONS } from '@/components/settings/panels/ShortcutsPanel';
import { GeneralPanel, GENERAL_PANEL_SECTIONS } from '@/components/settings/panels/GeneralPanel';
import { PrivacyPanel, PRIVACY_PANEL_SECTIONS } from '@/components/settings/panels/PrivacyPanel';
import { AboutPanel, ABOUT_PANEL_SECTIONS } from '@/components/settings/panels/AboutPanel';
import type { SettingsPanelDefinition } from '@/lib/settings/types';

export const SETTINGS_PANELS: SettingsPanelDefinition[] = [
  { id: 'general', label: 'General', icon: Settings2, component: GeneralPanel, sections: GENERAL_PANEL_SECTIONS },
  { id: 'privacy', label: 'Privacy', icon: ShieldCheck, component: PrivacyPanel, sections: PRIVACY_PANEL_SECTIONS },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard, component: ShortcutsPanel, sections: SHORTCUTS_PANEL_SECTIONS },
  { id: 'about', label: 'About', icon: Info, component: AboutPanel, sections: ABOUT_PANEL_SECTIONS },
];
