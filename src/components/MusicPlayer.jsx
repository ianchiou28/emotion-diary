import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // 模拟网易云API数据，实际使用时需要配置代理服务器
    const mockPlaylist = [
      {
        id: 1,
        name: '晴天',
        artist: '周杰伦',
        url: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
        cover: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
      },
      {
        id: 2,
        name: '夜曲',
        artist: '周杰伦',
        url: 'https://music.163.com/song/media/outer/url?id=186017.mp3',
        cover: 'https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'
      }
    ];
    
    setPlaylist(mockPlaylist);
    setCurrentSong(mockPlaylist[0]);
    setLoading(false);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('播放失败:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(false);
  };

  const playPrev = () => {
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="music-player">
        <div className="music-loading">加载音乐中...</div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <h3>🎵 音乐播放器</h3>
      
      {currentSong && (
        <>
          <div className="song-info">
            <img src={currentSong.cover} alt={currentSong.name} className="song-cover" />
            <div className="song-details">
              <div className="song-name">{currentSong.name}</div>
              <div className="song-artist">{currentSong.artist}</div>
            </div>
          </div>

          <div className="player-controls">
            <button onClick={playPrev} className="control-btn">⏮️</button>
            <button onClick={togglePlay} className="play-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={playNext} className="control-btn">⏭️</button>
          </div>

          <audio
            ref={audioRef}
            src={currentSong.url}
            onEnded={playNext}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </>
      )}

      <div className="playlist">
        <h4>播放列表</h4>
        {playlist.map(song => (
          <div
            key={song.id}
            className={`playlist-item ${currentSong?.id === song.id ? 'active' : ''}`}
            onClick={() => {
              setCurrentSong(song);
              setIsPlaying(false);
            }}
          >
            <span className="song-title">{song.name}</span>
            <span className="song-artist-small">{song.artist}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;