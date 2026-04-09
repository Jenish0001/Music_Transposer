import { useState, useEffect, useCallback } from 'react';
import SongList from './components/SongList';
import SongEditor from './components/SongEditor';
import TransposePanel from './components/TransposePanel';
import OutputViewer from './components/OutputViewer';
import './App.css';

const STORAGE_KEY = 'music_transposer_songs';

function loadSongs() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSongs(songs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}

function App() {
  const [songs, setSongs] = useState(loadSongs);
  const [selectedId, setSelectedId] = useState(null);
  const [saNote, setSaNote] = useState('C');
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [activeTab, setActiveTab] = useState('editor');

  const selectedSong = songs.find(s => s.id === selectedId) || null;

  useEffect(() => {
    saveSongs(songs);
  }, [songs]);

  const handleAdd = useCallback(() => {
    const newSong = {
      id: Date.now().toString(),
      title: 'New Song',
      text: '',
    };
    setSongs(prev => [...prev, newSong]);
    setSelectedId(newSong.id);
    setActiveTab('editor');
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setActiveTab('output');
  }, []);

  const handleSave = useCallback((updatedSong) => {
    setSongs(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
    setActiveTab('output');
  }, []);

  const handleDelete = useCallback((id) => {
    setSongs(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎼 Sargam Transposer</h1>
        <p className="subtitle">Store and transpose Indian sargam notations</p>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <SongList
            songs={songs}
            selectedId={selectedId}
            onSelect={handleSelect}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        </aside>

        <main className="main-content">
          {!selectedSong ? (
            <div className="no-selection">
              <p>👈 Select a song or create a new one</p>
            </div>
          ) : (
            <>
              <div className="tab-bar">
                <button
                  className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('editor')}
                >✏️ Edit</button>
                <button
                  className={`tab ${activeTab === 'output' ? 'active' : ''}`}
                  onClick={() => setActiveTab('output')}
                >🎵 View</button>
              </div>

              {activeTab === 'editor' ? (
                <SongEditor song={selectedSong} onSave={handleSave} />
              ) : (
                <>
                  <TransposePanel
                    saNote={saNote}
                    setSaNote={setSaNote}
                    transposeSteps={transposeSteps}
                    setTransposeSteps={setTransposeSteps}
                  />
                  <OutputViewer
                    songText={selectedSong.text}
                    saNote={saNote}
                    transposeSteps={transposeSteps}
                  />
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
