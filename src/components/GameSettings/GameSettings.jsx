import React from 'react';
import './GameSettings.css';

const GameSettings = ({ 
  boardSize, 
  setBoardSize, 
  winLength, 
  setWinLength 
}) => {
  return (
    <div className="game-settings">
      <h2>Настройки игры</h2>
      
      <div className="setting-group">
        <label>Размер поля:</label>
        <select 
          value={boardSize} 
          onChange={(e) => setBoardSize(parseInt(e.target.value))}
        >
          <option value="3">3×3</option>
          <option value="4">4×4</option>
          <option value="5">5×5</option>
        </select>
      </div>
      
      <div className="setting-group">
        <label>Длина линии для победы:</label>
        <select 
          value={winLength} 
          onChange={(e) => setWinLength(parseInt(e.target.value))}
          disabled={winLength > boardSize}
        >
          {[3, 4, 5].map(num => (
            <option 
              key={num} 
              value={num}
              disabled={num > boardSize}
            >
              {num} в ряд
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GameSettings;