import { useEffect } from 'react';
import { Editor } from './components/editor/Editor';
import { SearchPanel } from './components/editor/SearchPanel';
import { SearchResultsSidebar } from './components/editor/SearchResultsSidebar';
import { SidebarHost } from './lib/layout/sidebar/SidebarHost';
import { useConfigStore } from './lib/config/store';
import { useConfigPersistence } from './lib/config/useConfigPersistence';
import { useDocumentStore } from './lib/document/store';
import './index.css';
import { matchesShortcut } from './lib/shortcuts';
import { useAutosave } from './lib/document/useAutosave';
import { useMenuEvents } from './lib/menu/useMenuEvents';
import { StatusBar } from './components/layout/StatusBar';
import { Ribbon } from './components/layout/Ribbon';

function App() {
  useConfigPersistence();
  useAutosave();
  useMenuEvents();

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
        <Ribbon />
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-auto pt-6">
            <Editor />
          </div>
          <SearchPanel />
          <SidebarHost id="search" anchor="right">
            <SearchResultsSidebar />
          </SidebarHost>
        </div>
        <StatusBar />
      </main>
    </div>
  );
}

export default App;
