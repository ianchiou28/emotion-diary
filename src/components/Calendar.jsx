import React, { useContext, useState } from 'react';
import { DiaryContext } from '../context/DiaryContext';

const Calendar = () => {
  const { diaries, setSelectedDate } = useContext(DiaryContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const getDiaryForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return diaries.find(diary => diary.date.startsWith(dateStr));
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      neutral: '😐',
      excited: '🤩'
    };
    return moods[mood] || '';
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const diary = getDiaryForDate(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    days.push(
      <div 
        key={day} 
        className="calendar-day"
        onClick={() => diary && setSelectedDate(dateStr)}
        style={{ cursor: diary ? 'pointer' : 'default' }}
      >
        <span className="day-number">{day}</span>
        {diary && <span className="mood-indicator">{getMoodEmoji(diary.mood)}</span>}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>‹</button>
        <h3>{year}年{month + 1}月</h3>
        <button onClick={nextMonth}>›</button>
      </div>
      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {days}
      </div>
    </div>
  );
};

export default Calendar;