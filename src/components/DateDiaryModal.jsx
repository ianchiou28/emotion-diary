import React, { useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import DiaryItem from './DiaryItem';

const DateDiaryModal = () => {
  const { selectedDate, setSelectedDate, getDiariesByDate } = useContext(DiaryContext);
  
  if (!selectedDate) return null;
  
  const diariesForDate = getDiariesByDate(selectedDate);
  const formattedDate = new Date(selectedDate).toLocaleDateString('zh-CN');

  return (
    <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{formattedDate} 的记录</h3>
          <button onClick={() => setSelectedDate(null)}>×</button>
        </div>
        <div className="modal-body">
          {diariesForDate.map(diary => (
            <DiaryItem key={diary.id} diary={diary} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateDiaryModal;