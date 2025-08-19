import React, { useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import DiaryItem from './DiaryItem';

const DiaryList = () => {
  const { diaries } = useContext(DiaryContext);

  if (diaries.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
        还没有记录，开始写下你的第一篇心情日记吧！
      </div>
    );
  }

  return (
    <div className="diary-list">
      {diaries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(diary => (
          <DiaryItem key={diary.id} diary={diary} />
        ))}
    </div>
  );
};

export default DiaryList;