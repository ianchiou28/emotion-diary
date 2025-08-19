import React, { useContext } from 'react';
import { DiaryProvider, DiaryContext } from './context/DiaryContext';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import Calendar from './components/Calendar';
import DateDiaryModal from './components/DateDiaryModal';
import Weather from './components/Weather';
import MusicPlayer from './components/MusicPlayer';
import BackgroundSettings from './components/BackgroundSettings';
import DiaryWriter from './components/DiaryWriter';
import './App.css';

const AppContent = () => {
  const { backgroundSettings } = useContext(DiaryContext);
  
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
        <MusicPlayer />
      </div>
      <div className="main-content">
        <h1>情绪日记</h1>
        <DiaryForm />
        <Calendar />
        <DiaryList />
        <DiaryWriter />
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
