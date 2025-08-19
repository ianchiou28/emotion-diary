import React, { useState, useEffect } from 'react';

const Weather = () => {
  const [weather, setWeather] = useState({ temp: '--', text: '--' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('北京');

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    
    setLoading(true);
    setWeather({ temp: '--', text: '加载中...' });
    
    try {
      const API_KEY = '9ac7e67bd8bc4b2ea179c05f33e2493f';
      const API_HOST = 'p92vhdt5yu.re.qweatherapi.com';
      
      const response = await fetch(`https://${API_HOST}/v7/weather/now?location=${encodeURIComponent(cityName)}&key=${API_KEY}`);
      const data = await response.json();
      
      if (data.code === '200' && data.now) {
        setWeather({
          temp: data.now.temp,
          text: data.now.text,
          windDir: data.now.windDir,
          windScale: data.now.windScale,
          humidity: data.now.humidity,
          location: cityName
        });
      } else {
        setWeather({ temp: 'N/A', text: '未找到城市', location: cityName });
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeather({ temp: 'N/A', text: '获取失败', location: cityName });
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
        <div className="weather-loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <h3>今日天气</h3>
      <form onSubmit={handleSearch} className="weather-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="输入城市名称"
          className="city-search-input"
        />
        <button type="submit" className="search-btn">搜索</button>
      </form>
      {loading ? (
        <div className="weather-loading">加载中...</div>
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
                <span>风向：{weather.windDir}</span>
              </div>
              <div className="weather-item">
                <span>风力：{weather.windScale}级</span>
              </div>
              <div className="weather-item">
                <span>湿度：{weather.humidity}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;