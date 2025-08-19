import React, { useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';

const moods = {
  happy: '😊 开心',
  sad: '😢 难过',
  angry: '😠 生气',
  neutral: '😐 平静',
  excited: '🤩 兴奋'
};

const DiaryItem = ({ diary }) => {
  const { deleteDiary } = useContext(DiaryContext);
  const date = new Date(diary.date).toLocaleString('zh-CN');
  
  const detectLanguage = (text) => {
    return /[\u4e00-\u9fff]/.test(text) ? 'chinese' : 'english';
  };

  return (
    <div className="diary-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '18px' }}>{moods[diary.mood]}</span>
        <div>
          <span style={{ color: '#666', fontSize: '14px', marginRight: '10px' }}>{date}</span>
          <button
            onClick={() => deleteDiary(diary.id)}
            style={{
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            删除
          </button>
        </div>
      </div>
      <p 
        className={`diary-content ${detectLanguage(diary.content)}`}
        style={{ margin: 0, lineHeight: '1.6' }}
      >
        {diary.content}
      </p>
    </div>
  );
};

export default DiaryItem;