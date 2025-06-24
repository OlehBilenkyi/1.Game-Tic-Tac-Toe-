import React from 'react';
import './History.css';

const History = ({ history, currentMove, setCurrentMove, players }) => {
  const jumpTo = (move) => {
    setCurrentMove(move);
  };

  return (
    <div className="history">
      <h3>История ходов</h3>
      <ul>
        {history.map((step, move) => (
          <li key={move}>
            <button 
              onClick={() => jumpTo(move)}
              className={move === currentMove ? 'current-move' : ''}
            >
              {move === 0 
                ? 'Начало игры' 
                : `Ход ${move}: ${players[step.player].name} (${step.player})`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;