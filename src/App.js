import React, { useContext, useState } from 'react';
import { DiaryProvider, DiaryContext } from './context/DiaryContext';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import Calendar from './components/Calendar';
import DateDiaryModal from './components/DateDiaryModal';
import Weather from './components/Weather';
import ChatBot from './components/ChatBot';
import Navigation from './components/Navigation';
import EmotionAnalysis from './components/EmotionAnalysis';
import BackgroundSettings from './components/BackgroundSettings';
import DiaryWriter from './components/DiaryWriter';
import LanguageToggle from './components/LanguageToggle';
import { translations } from './utils/translations';
import './App.css';

const AppContent = () => {
  const { backgroundSettings, language } = useContext(DiaryContext);
  const t = translations[language];
  const [currentPage, setCurrentPage] = useState('diary');
  
  return (
    <div 
      className="App" 
      style={{
        background: backgroundSettings.background,
        backgroundSize: backgroundSettings.backgroundSize || 'initial',
        backgroundPosition: backgroundSettings.backgroundPosition || 'initial',
        backgroundRepeat: 'no-repeat',
        opacity: backgroundSettings.opacity,
        minHeight: '100vh'
      }}
    >
      <div className="sidebar">
        <BackgroundSettings />
        <Weather />
        <ChatBot />
      </div>
      <div className="main-content">
        <div className="header">
          <h1>{t.title}</h1>
          <LanguageToggle />
        </div>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage === 'diary' ? (
          <>
            <DiaryForm />
            <Calendar />
            <DiaryList />
            <DiaryWriter />
          </>
        ) : (
          <EmotionAnalysis />
        )}
      </div>
      <DateDiaryModal />
    </div>
  );
};

function App() {
  return (
    <DiaryProvider>
      <AppContent />
    </DiaryProvider>
  );
}

export default App;
