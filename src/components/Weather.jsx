import React, { useState, useEffect, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import { translations } from '../utils/translations';

const Weather = () => {
  const { language } = useContext(DiaryContext);
  const t = translations[language];
  const [weather, setWeather] = useState({ temp: '--', text: '--' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('北京');

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    
    setLoading(true);
    setWeather({ temp: '--', text: t.loading });
    
    try {
      const API_KEY = 'dbdfe64f8ea944aa859efb339b63ac81';
      const API_HOST = 'p92vhdt5yu.re.qweatherapi.com';
      
      // 先查询城市获取LocationID
      const cityResponse = await fetch(`https://${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(cityName)}&key=${API_KEY}`);
      const cityData = await cityResponse.json();
      
      if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
        const locationId = cityData.location[0].id;
        const cityDisplayName = cityData.location[0].name;
        
        // 使用LocationID查询天气
        const weatherResponse = await fetch(`https://${API_HOST}/v7/weather/now?location=${locationId}&key=${API_KEY}`);
        const weatherData = await weatherResponse.json();
        
        if (weatherData.code === '200' && weatherData.now) {
          setWeather({
            temp: weatherData.now.temp,
            text: weatherData.now.text,
            windDir: weatherData.now.windDir,
            windScale: weatherData.now.windScale,
            humidity: weatherData.now.humidity,
            location: cityDisplayName
          });
        } else {
          setWeather({ temp: 'N/A', text: 'Weather fetch failed', location: cityName });
        }
      } else {
        setWeather({ temp: 'N/A', text: 'City not found', location: cityName });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeather({ temp: 'N/A', text: 'Network error', location: cityName });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
    }
  };

  useEffect(() => {
    fetchWeather('北京');
  }, []);



  const getWeatherIcon = (iconCode) => {
    const icons = {
      '100': '☀️', // 晴
      '101': '🌤️', // 多云
      '102': '⛅', // 少云
      '103': '☁️', // 晴间多云
      '104': '☁️', // 阴
      '300': '🌦️', // 阵雨
      '301': '🌧️', // 强阵雨
      '302': '⛈️', // 雷阵雨
      '400': '🌨️', // 小雪
      '401': '❄️', // 中雪
      '402': '🌨️', // 大雪
    };
    return icons[iconCode] || '🌤️';
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-loading">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <h3>{t.todayWeather}</h3>
      <form onSubmit={handleSearch} className="weather-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchCity}
          className="city-search-input"
        />
        <button type="submit" className="search-btn">{t.search}</button>
      </form>
      {loading ? (
        <div className="weather-loading">{t.loading}</div>
      ) : (
        <div className="weather-details">
          {weather.location && (
            <div className="weather-location-display">
              <span>📍 {weather.location}</span>
            </div>
          )}
          <div className="weather-current">
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-desc">{weather.text}</div>
          </div>
          {weather.windDir && (
            <div className="weather-info">
              <div className="weather-item">
                <span>{t.windDirection}{weather.windDir}</span>
              </div>
              <div className="weather-item">
                <span>{t.windScale}{weather.windScale}{language === 'zh' ? '级' : ''}</span>
              </div>
              <div className="weather-item">
                <span>{t.humidity}{weather.humidity}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;