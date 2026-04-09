import React, { useState } from 'react';
import { parseSongText, transposeNotationLine, noteToSargam, noteToWestern } from '../utils/noteUtils';

function OutputViewer({ songText, saNote, transposeSteps }) {
  const [viewMode, setViewMode] = useState('both'); // 'sargam', 'western', 'both'

  if (!songText || !songText.trim()) {
    return (
      <div className="output-viewer empty">
        <p>No song loaded. Select or create a song.</p>
      </div>
    );
  }

  const pairs = parseSongText(songText);

  return (
    <div className="output-viewer">
      <div className="output-header">
        <h3>🎵 Output</h3>
        <div className="view-toggle">
          <button
            className={`btn btn-sm ${viewMode === 'both' ? 'active' : ''}`}
            onClick={() => setViewMode('both')}
          >Both</button>
          <button
            className={`btn btn-sm ${viewMode === 'sargam' ? 'active' : ''}`}
            onClick={() => setViewMode('sargam')}
          >Sargam</button>
          <button
            className={`btn btn-sm ${viewMode === 'western' ? 'active' : ''}`}
            onClick={() => setViewMode('western')}
          >Western</button>
        </div>
      </div>

      <div className="output-blocks">
        {pairs.map((pair, idx) => (
          <PairBlock
            key={idx}
            pair={pair}
            saNote={saNote}
            transposeSteps={transposeSteps}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}

function PairBlock({ pair, saNote, transposeSteps, viewMode }) {
  const tokens = transposeNotationLine(pair.notation, transposeSteps);

  return (
    <div className="pair-block">
      {pair.lyrics.trim() && (
        <div className="lyrics-line">{pair.lyrics}</div>
      )}
      {pair.notation.trim() && (
        <>
          <div className="notation-original">
            <span className="label">Original:</span>
            {renderOriginalTokens(tokens)}
          </div>
          {(viewMode === 'sargam' || viewMode === 'both') && (
            <div className="notation-transposed">
              <span className="label">Transposed:</span>
              {renderTransposedSargam(tokens)}
            </div>
          )}
          {(viewMode === 'western' || viewMode === 'both') && (
            <div className="notation-western">
              <span className="label">Western:</span>
              {renderWestern(tokens, saNote)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function renderOriginalTokens(tokens) {
  return (
    <span className="note-line">
      {tokens.map((token, i) => {
        if (token.type === 'note') {
          const valid = token.value && token.value.swar !== '?';
          return (
            <span key={i} className={valid ? 'note-valid' : 'note-invalid'}>
              {token.raw}
            </span>
          );
        }
        return <span key={i} className="note-symbol">{token.raw}</span>;
      })}
    </span>
  );
}

function renderTransposedSargam(tokens) {
  return (
    <span className="note-line">
      {tokens.map((token, i) => {
        if (token.type === 'note' && token.transposed) {
          const valid = token.transposed.swar !== '?';
          return (
            <span key={i} className={valid ? 'note-valid transposed' : 'note-invalid'}>
              {noteToSargam(token.transposed)}
            </span>
          );
        }
        return <span key={i} className="note-symbol">{token.raw}</span>;
      })}
    </span>
  );
}

function renderWestern(tokens, saNote) {
  return (
    <span className="note-line">
      {tokens.map((token, i) => {
        if (token.type === 'note' && token.transposed) {
          const valid = token.transposed.swar !== '?';
          const western = valid ? noteToWestern(token.transposed, saNote) : '?';
          return (
            <span key={i} className={valid ? 'note-western' : 'note-invalid'}>
              {western}
            </span>
          );
        }
        return <span key={i} className="note-symbol">{token.raw}</span>;
      })}
    </span>
  );
}

export default OutputViewer;
