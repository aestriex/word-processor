import { useEffect } from 'react';
import { Editor } from './components/editor/Editor';
import { TopBar } from './components/layout/TopBar';
import { useConfigStore } from './lib/config/store';
import { useConfigPersistence } from './lib/config/useConfigPersistence';
import { useDocumentStore } from './lib/document/store';
import './index.css';
import { matchesShortcut } from './lib/shortcuts';

function App() {
  useConfigPersistence();
  const theme = useConfigStore((s) => s.config.theme);

  const saveShortcut = useConfigStore((s) => s.config.keybindings.save);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (matchesShortcut(e, saveShortcut)) {
        e.preventDefault();
        useDocumentStore.getState().save();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveShortcut]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <main className="flex h-screen flex-col bg-background text-foreground">
        <TopBar />
        <div className="flex-1 overflow-auto">
          <Editor />
        </div>
      </main>
    </div>
  );
}

export default App;
