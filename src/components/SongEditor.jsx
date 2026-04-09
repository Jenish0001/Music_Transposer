import React, { useState } from 'react';

function SongEditor({ song, onSave }) {
  const [title, setTitle] = useState(song ? (song.title || '') : '');
  const [text, setText] = useState(song ? (song.text || '') : '');

  const handleSave = () => {
    if (!title.trim() && !text.trim()) return;
    onSave({ ...song, title: title.trim() || 'Untitled', text });
  };

  const exampleText = `Tujhkoo main rakh loon wahaan
R'.S'.N… N.S'.N.D.P.P.G…

Jahan pee kahii
G..G..P.D.N.D…`;

  return (
    <div className="song-editor">
      <div className="editor-field">
        <label>Song Title</label>
        <input
          className="input-title"
          type="text"
          placeholder="Enter song title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="editor-field">
        <label>Notation (alternating lyrics / notation lines)</label>
        <textarea
          className="textarea-notation"
          placeholder={exampleText}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={12}
        />
      </div>
      <div className="editor-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          💾 Save Song
        </button>
      </div>
      <div className="editor-hint">
        <strong>Format:</strong> Line 1 = lyrics, Line 2 = notation, repeat.<br />
        <strong>Notes:</strong> S R G M m P D N with optional (k) for komal, ' for higher octave.<br />
        <strong>Example:</strong> R'(k).S'.N…
      </div>
    </div>
  );
}

export default SongEditor;
