import { Pilcrow } from 'lucide-react';
import { IconButton } from '../../IconButton';
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
    <IconButton
      label="Show Non-Printing Characters"
      icon={<Pilcrow size={16} />}
      active={enabled}
      onClick={toggle}
    />
  );
}
