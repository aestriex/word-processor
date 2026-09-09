import { Editor } from './components/editor/Editor';
import { useConfigStore } from './lib/config/store';
import { useConfigPersistence } from './lib/config/useConfigPersistence';
import './index.css';

function App() {
  useConfigPersistence();

  const theme = useConfigStore((s) => s.config.theme);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <main className="app">
        <Editor />
      </main>
    </div>
  );
}

export default App;
