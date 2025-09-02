import React, { useState, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import MoodSelector from './MoodSelector';

const DiaryForm = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const { addDiary } = useContext(DiaryContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newDiary = {
      content,
      mood,
      date: new Date().toISOString(),
    };

    addDiary(newDiary);
    setContent('');
    setMood('neutral');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <MoodSelector selected={mood} onSelect={setMood} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天感觉如何？"
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '10px',
            resize: 'vertical'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          记录心情
        </button>
      </form>
    </div>
  );
};

export default DiaryForm;