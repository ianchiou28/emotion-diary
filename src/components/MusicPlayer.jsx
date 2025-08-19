import React, { useState, useEffect, useRef, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import { translations } from '../utils/translations';

const MusicPlayer = () => {
  const { language } = useContext(DiaryContext);
  const t = translations[language];
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const loadTracks = async () => {
    setLoading(true);
    setError('');
    try {
      // 使用指定的歌单ID 19723756
      const response = await fetch('http://localhost:3000/playlist/detail?id=19723756');
      const data = await response.json();
      
      console.log('API Response:', data); // 调试信息
      
      if (data.code === 200 && data.playlist && data.playlist.tracks) {
        // 获取歌曲ID列表
        const trackIds = data.playlist.tracks.slice(0, 20).map(track => track.id).join(',');
        
        // 获取歌曲详情
        const detailResponse = await fetch(`http://localhost:3000/song/detail?ids=${trackIds}`);
        const detailData = await detailResponse.json();
        
        if (detailData.code === 200 && detailData.songs) {
          const songs = await Promise.all(
            detailData.songs.map(async (song) => {
              try {
                // 获取每首歌的播放URL，设置更高的码率
                const urlResponse = await fetch(`http://localhost:3000/song/url?id=${song.id}&br=320000`);
                const urlData = await urlResponse.json();
                const playUrl = urlData.data?.[0]?.url || null;
                
                // 检查音乐是否可用
                if (!playUrl) {
                  const checkResponse = await fetch(`http://localhost:3000/check/music?id=${song.id}`);
                  const checkData = await checkResponse.json();
                  console.log(`Song ${song.id} availability:`, checkData);
                }
                
                return {
                  id: song.id,
                  title: song.name,
                  artist: song.ar?.[0]?.name || '未知歌手',
                  url: playUrl,
                  cover: song.al?.picUrl
                };
              } catch (e) {
                console.error(`Failed to get URL for song ${song.id}:`, e);
                return null;
              }
            })
          );
          
          // 过滤掉无效的歌曲
          const validSongs = songs.filter(song => song && song.url);
          
          setTracks(validSongs);
          setCurrentTrackIndex(0);
          setCurrentTrack(validSongs[0] || null);
          
          if (!validSongs.length) {
            setError('未获取到可播放的歌曲');
          }
        } else {
          setError('获取歌曲详情失败');
        }
      } else {
        setError('获取音乐列表失败');
      }
    } catch (e) {
      console.error('Load tracks error:', e);
      // 尝试使用热歌榜作为备用方案
      try {
        const fallbackResponse = await fetch('http://localhost:3000/top/list?idx=1');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.code === 200) {
          const trackIds = fallbackData.playlist.tracks.slice(0, 5).map(track => track.id).join(',');
          const detailResponse = await fetch(`http://localhost:3000/song/detail?ids=${trackIds}`);
          const detailData = await detailResponse.json();
          
          if (detailData.code === 200) {
            const mockTracks = detailData.songs.map(song => ({
              id: song.id,
              title: song.name,
              artist: song.ar?.[0]?.name || '未知歌手',
              url: null,
              cover: song.al?.picUrl
            }));
            setTracks(mockTracks);
            setCurrentTrackIndex(0);
            setCurrentTrack(mockTracks[0]);
            setError('歌单加载失败，已切换到热歌榜。歌曲无播放URL，请检查API服务。');
            return;
          }
        }
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }
      
      // 最终备用方案
      const mockTracks = [
        { id: 1, title: '晴天', artist: '周杰伦', url: null, cover: null },
        { id: 2, title: '稻香', artist: '周杰伦', url: null, cover: null },
        { id: 3, title: '青花瓷', artist: '周杰伦', url: null, cover: null }
      ];
      setTracks(mockTracks);
      setCurrentTrackIndex(0);
      setCurrentTrack(mockTracks[0]);
      setError('API服务未启动。请先启动网易云音乐API服务。');
    }
    setLoading(false);
  };

  const searchSongsHandler = async () => {
    if (!searchKeyword.trim()) return;
    setLoading(true);
    setError('');
    setSearching(true);
    try {
      const response = await fetch(`http://localhost:3000/search?keywords=${encodeURIComponent(searchKeyword)}&limit=10`);
      const data = await response.json();
      
      if (data.code === 200 && data.result && data.result.songs) {
        const songs = await Promise.all(
          data.result.songs.map(async (song) => {
            try {
              const urlResponse = await fetch(`http://localhost:3000/song/url?id=${song.id}&br=320000`);
              const urlData = await urlResponse.json();
              const playUrl = urlData.data?.[0]?.url || null;
              
              return {
                id: song.id,
                title: song.name,
                artist: song.ar?.[0]?.name || '未知歌手',
                url: playUrl,
                cover: song.al?.picUrl
              };
            } catch (e) {
              console.error(`Failed to get URL for song ${song.id}:`, e);
              return null;
            }
          })
        );
        
        const validSongs = songs.filter(song => song && song.url);
        
        setTracks(validSongs);
        setCurrentTrackIndex(0);
        setCurrentTrack(validSongs[0] || null);
        if (!validSongs.length) setError('未搜索到可播放的歌曲');
      } else {
        setError('搜索结果为空');
      }
    } catch (e) {
      console.error('Search error:', e);
      setError('搜索失败，请检查网络连接');
    }
    setLoading(false);
  };

  const resetSearch = () => {
    setSearchKeyword('');
    setSearching(false);
    loadTracks();
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const playCurrent = () => {
    if (!currentTrack?.url) {
      setError('歌曲无播放URL，请检查API服务');
      return;
    }

    if (audioRef.current) {
      setError('');
      if (audioRef.current.src !== currentTrack.url) {
        audioRef.current.load();
      }
      audioRef.current.play().catch(() => {
        setError('播放失败，可能是版权限制');
      });
    }
  };

  const pauseCurrent = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const nextTrack = () => {
    if (!tracks.length) return;

    const startIndex = currentTrackIndex;
    let foundPlayable = false;
    let attempts = 0;
    const maxAttempts = tracks.length;

    do {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);

      if (tracks[nextIndex]?.url) {
        foundPlayable = true;
        break;
      }
      attempts++;
    } while (attempts < maxAttempts && currentTrackIndex !== startIndex);

    if (!foundPlayable) {
      setError('没有找到可播放的歌曲');
      return;
    }

    playCurrent();
  };

  const prevTrack = () => {
    if (!tracks.length) return;

    const startIndex = currentTrackIndex;
    let foundPlayable = false;
    let attempts = 0;
    const maxAttempts = tracks.length;

    do {
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);

      if (tracks[prevIndex]?.url) {
        foundPlayable = true;
        break;
      }
      attempts++;
    } while (attempts < maxAttempts && currentTrackIndex !== startIndex);

    if (!foundPlayable) {
      setError('没有找到可播放的歌曲');
      return;
    }

    playCurrent();
  };

  const toggleLoopMode = () => {
    setIsSingleLoop(!isSingleLoop);
    if (audioRef.current) audioRef.current.loop = !isSingleLoop;
  };

  const onSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const onEnded = () => {
    if (!isSingleLoop) nextTrack();
  };

  useEffect(() => {
    if (currentTrack) {
      playCurrent();
    }
  }, [currentTrack]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);



  return (
    <div className="music-player">
      <div className="player-header">
        <h3>{t.musicPlayer}</h3>
        <div className="search-bar">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchSongsHandler()}
            placeholder={language === 'zh' ? '搜索歌曲或歌手' : 'Search songs or artists'}
            className="search-input"
          />
          <div className="search-buttons">
            <button onClick={searchSongsHandler} className="search-btn">
              {language === 'zh' ? '搜索' : 'Search'}
            </button>
            {searching && (
              <button onClick={resetSearch} className="reset-btn">
                {language === 'zh' ? '重置' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.url}
        loop={isSingleLoop}
        onEnded={onEnded}
        style={{ display: 'none' }}
      />

      {currentTrack && (
        <div className="progress-container">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={onSeek}
            className="progress-slider"
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      )}

      <div className="player-content">
        {currentTrack && (
          <div className="track-info">
            <p className="track-title">{currentTrack.title}</p>
            <p className="track-artist">{currentTrack.artist}</p>
          </div>
        )}

        <div className="music-actions">
          <button onClick={prevTrack} disabled={tracks.length === 0} className="control-btn">
            ⏮️
          </button>
          <button
            onClick={isPlaying ? pauseCurrent : playCurrent}
            disabled={tracks.length === 0}
            className="play-btn"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={nextTrack} disabled={tracks.length === 0} className="control-btn">
            ⏭️
          </button>
          <button onClick={toggleLoopMode} className="control-btn">
            {isSingleLoop ? '🔂' : '🔁'}
          </button>
        </div>

        {loading && <div className="music-loading">{t.loading}</div>}
        {error && (
          <div className="music-error">
            {error}
            {error.includes('API服务') && (
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => window.open('c:\\Users\\ian28\\Desktop\\emotion_diary\\start-api.bat', '_blank')}
                  className="api-help-btn"
                >
                  {language === 'zh' ? '查看启动说明' : 'View Setup Guide'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="playlist">
        <h4>{language === 'zh' ? '歌单列表' : 'Playlist'}</h4>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`playlist-item ${currentTrackIndex === index ? 'active' : ''}`}
            onClick={() => {
              setCurrentTrackIndex(index);
              setCurrentTrack(track);
            }}
          >
            <span className="song-title">{track.title}</span>
            <span className="song-artist-small">{track.artist}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;