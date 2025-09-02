import React, { useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useContext(DiaryContext);

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button 
      className="language-toggle"
      onClick={toggleLanguage}
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {language === 'zh' ? 'EN' : '中'}
    </button>
  );
};

export default LanguageToggle;