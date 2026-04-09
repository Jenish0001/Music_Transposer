import React from 'react';

function SongList({ songs, selectedId, onSelect, onAdd, onDelete }) {
  return (
    <div className="song-list">
      <div className="song-list-header">
        <h2>Songs</h2>
        <button className="btn btn-primary" onClick={onAdd}>+ New Song</button>
      </div>
      {songs.length === 0 && (
        <p className="empty-msg">No songs yet. Add one!</p>
      )}
      <ul>
        {songs.map(song => (
          <li
            key={song.id}
            className={`song-item ${song.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(song.id)}
          >
            <span className="song-title">{song.title || 'Untitled'}</span>
            <button
              className="btn btn-danger btn-sm"
              onClick={e => { e.stopPropagation(); onDelete(song.id); }}
              title="Delete"
            >✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;
