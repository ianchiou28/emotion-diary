import React from 'react';

const moods = [
  { id: 'happy', label: '😊 开心', color: '#4CAF50' },
  { id: 'sad', label: '😢 难过', color: '#2196F3' },
  { id: 'angry', label: '😠 生气', color: '#F44336' },
  { id: 'neutral', label: '😐 平静', color: '#9E9E9E' },
  { id: 'excited', label: '🤩 兴奋', color: '#FF9800' }
];

const MoodSelector = ({ selected, onSelect }) => {
  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button
          key={mood.id}
          className={`mood-button ${selected === mood.id ? 'selected' : ''}`}
          onClick={() => onSelect(mood.id)}
          style={{
            borderColor: selected === mood.id ? mood.color : undefined
          }}
        >
          {mood.label}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;