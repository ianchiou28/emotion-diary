import React, { useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import { translations } from '../utils/translations';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { language } = useContext(DiaryContext);
  const t = translations[language];

  const pages = [
    { id: 'diary', name: language === 'zh' ? '日记本' : 'Diary' },
    { id: 'analysis', name: language === 'zh' ? '情绪分析' : 'Emotion Analysis' }
  ];

  return (
    <nav className="navigation">
      {pages.map(page => (
        <button
          key={page.id}
          className={`nav-btn ${currentPage === page.id ? 'active' : ''}`}
          onClick={() => setCurrentPage(page.id)}
        >
          {page.name}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;