import React from 'react';
import './ThemeSelector.css';

const ThemeSelector = ({ theme, setTheme }) => {
  const themes = [
    { id: 'default', name: 'Стандартная' },
    { id: 'dark', name: 'Тёмная' },
    { id: 'retro', name: 'Ретро' },
  ];

  return (
    <div className="theme-selector">
      <label>Тема оформления:</label>
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
      >
        {themes.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;