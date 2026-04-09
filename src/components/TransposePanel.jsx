import React from 'react';
import { SA_OPTIONS } from '../utils/noteUtils';

function TransposePanel({ saNote, setSaNote, transposeSteps, setTransposeSteps }) {
  return (
    <div className="transpose-panel">
      <h3>🎹 Transpose</h3>
      <div className="transpose-row">
        <label>Base Note (Sa):</label>
        <select
          value={saNote}
          onChange={e => setSaNote(e.target.value)}
          className="select-sa"
        >
          {SA_OPTIONS.map(note => (
            <option key={note} value={note}>{note}</option>
          ))}
        </select>
      </div>
      <div className="transpose-row">
        <label>Shift: <strong>{transposeSteps > 0 ? '+' : ''}{transposeSteps}</strong> semitones</label>
        <input
          type="range"
          min="-6"
          max="6"
          value={transposeSteps}
          onChange={e => setTransposeSteps(Number(e.target.value))}
          className="slider"
        />
        <div className="slider-labels">
          <span>-6</span><span>0</span><span>+6</span>
        </div>
      </div>
    </div>
  );
}

export default TransposePanel;
