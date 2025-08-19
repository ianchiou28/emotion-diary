import React, { useState, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';

const DiaryWriter = () => {
  const [content, setContent] = useState('');
  const { addDiary } = useContext(DiaryContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newDiary = {
      content,
      mood: 'neutral',
      date: new Date().toISOString(),
    };

    addDiary(newDiary);
    setContent('');
  };

  const detectLanguage = (text) => {
    return /[\u4e00-\u9fff]/.test(text) ? 'chinese' : 'english';
  };

  return (
    <div className="diary-writer">
      <h3>📝 日记本</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="亲爱的日记，今天发生了什么有趣的事情呢？"
          className={`diary-textarea ${detectLanguage(content)}`}
        />
        <button type="submit" className="diary-submit">
          保存日记
        </button>
      </form>
    </div>
  );
};

export default DiaryWriter;