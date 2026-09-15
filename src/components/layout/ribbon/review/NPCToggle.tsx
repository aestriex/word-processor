import { Pilcrow } from 'lucide-react';
import { RibbonIconButton } from '../RibbonIconButton';
import { useConfigStore } from '@/lib/config/store';

export function NonPrintingCharsToggle() {
  const enabled = useConfigStore((s) => s.config.editor.showNonPrintingChars);
  const setConfig = useConfigStore.setState;

  function toggle() {
    setConfig((state) => ({
      config: {
        ...state.config,
        editor: { ...state.config.editor, showNonPrintingChars: !enabled },
      },
    }));
  }

  return (
    <RibbonIconButton
      label="Show Non-Printing Characters"
      icon={<Pilcrow size={16} />}
      active={enabled}
      onClick={toggle}
    />
  );
}
