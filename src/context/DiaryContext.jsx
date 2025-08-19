import React, { createContext, useState, useEffect } from 'react';

export const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const [diaries, setDiaries] = useState(() => {
    // 从 localStorage 获取初始数据
    const savedDiaries = localStorage.getItem('diaries');
    return savedDiaries ? JSON.parse(savedDiaries) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [backgroundSettings, setBackgroundSettings] = useState(() => {
    const saved = localStorage.getItem('backgroundSettings');
    return saved ? JSON.parse(saved) : {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 0.9
    };
  });

  // 当日记数据改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  }, [diaries]);

  // 保存背景设置
  useEffect(() => {
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundSettings));
  }, [backgroundSettings]);

  // 添加日记
  const addDiary = (newDiary) => {
    setDiaries([...diaries, { ...newDiary, id: Date.now() }]);
  };

  // 删除日记
  const deleteDiary = (id) => {
    setDiaries(diaries.filter(diary => diary.id !== id));
  };

  // 根据日期获取日记
  const getDiariesByDate = (date) => {
    return diaries.filter(diary => diary.date.startsWith(date));
  };

  return (
    <DiaryContext.Provider value={{ 
      diaries, 
      addDiary, 
      deleteDiary, 
      selectedDate, 
      setSelectedDate,
      getDiariesByDate,
      backgroundSettings,
      setBackgroundSettings
    }}>
      {children}
    </DiaryContext.Provider>
  );
};