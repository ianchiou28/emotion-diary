import React, { useState, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';

const BackgroundSettings = () => {
  const { backgroundSettings, setBackgroundSettings } = useContext(DiaryContext);
  const [showSettings, setShowSettings] = useState(false);

  const presetBackgrounds = [
    { name: '默认', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: '日落', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
    { name: '海洋', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: '森林', value: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' },
    { name: '夜空', value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' },
    { name: '樱花', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: '薄荷', value: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' },
    { name: '紫霞', value: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)' },
    { name: '极光', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
    { name: '火焰', value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' },
    { name: '彩虹', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #a8edea 75%, #fed6e3 100%)' },
    { name: '星空', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }
  ];

  const handleBackgroundChange = (background) => {
    setBackgroundSettings({ ...backgroundSettings, background });
  };

  const handleOpacityChange = (opacity) => {
    setBackgroundSettings({ ...backgroundSettings, opacity });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setBackgroundSettings({ 
          ...backgroundSettings, 
          background: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="background-settings">
      <button 
        className="settings-toggle"
        onClick={() => setShowSettings(!showSettings)}
      >
        🎨 背景设置
      </button>
      
      {showSettings && (
        <div className="settings-panel">
          <div className="setting-group">
            <label>背景主题</label>
            <div className="background-options">
              {presetBackgrounds.map((bg) => (
                <button
                  key={bg.name}
                  className={`bg-option ${backgroundSettings.background === bg.value ? 'active' : ''}`}
                  style={{ background: bg.value }}
                  onClick={() => handleBackgroundChange(bg.value)}
                  title={bg.name}
                >
                  {bg.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="setting-group">
            <label>自定义背景</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
          
          <div className="setting-group">
            <label>透明度: {Math.round(backgroundSettings.opacity * 100)}%</label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={backgroundSettings.opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="opacity-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSettings;