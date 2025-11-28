import { useState, useEffect, useRef } from 'react';

const useAudio = () => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log('🎵 Initializing audio...');
    
    const audio = new Audio('/audio/lofi.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    
    audio.addEventListener('loadeddata', () => {
      console.log('✅ Audio loaded successfully');
      setAudioLoaded(true);
    });
    
    audio.addEventListener('play', () => {
      console.log('▶️ Audio started playing');
      setIsPlaying(true);
    });
    
    audio.addEventListener('pause', () => {
      console.log('⏸️ Audio paused');
      setIsPlaying(false);
    });
    
    audio.addEventListener('ended', () => {
      console.log('⏹️ Audio ended');
      setIsPlaying(false);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('❌ Audio error:', e);
    });
    
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        console.log('🔇 Cleaning up audio');
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = async () => {
    if (audioRef.current && audioLoaded) {
      try {
        console.log('🎵 Attempting to play audio...');
        
        // 🚀 FIX: HAPUS reset currentTime, biar lanjut dari posisi terakhir
        // audioRef.current.currentTime = 0; // ❌ HAPUS BARIS INI
        
        await audioRef.current.play();
        console.log('✅ Audio play successful');
        setIsPlaying(true);
      } catch (error) {
        console.log('❌ Audio play failed:', error);
        
        // Auto-retry
        setTimeout(() => {
          if (audioRef.current && !isPlaying) {
            audioRef.current.play().catch(e => {
              console.log('🔁 Retry also failed:', e);
            });
          }
        }, 300);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      console.log('⏸️ Pausing audio');
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const setVolume = (volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      console.log('🔊 Volume set to:', volume + '%');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      console.log('⏹️ Stopping audio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // ✅ Reset hanya saat stop, bukan pause
      setIsPlaying(false);
    }
  };

  // 🆕 FUNCTION BARU: Resume audio dari posisi terakhir
  const resumeAudio = async () => {
    if (audioRef.current && audioLoaded && !isPlaying) {
      try {
        console.log('🎵 Resuming audio from current position...');
        await audioRef.current.play();
        console.log('✅ Audio resume successful');
        setIsPlaying(true);
      } catch (error) {
        console.log('❌ Audio resume failed:', error);
      }
    }
  };

  return {
    playAudio,
    pauseAudio,
    toggleAudio,
    setVolume,
    stopAudio,
    resumeAudio, // 🆕 EXPORT FUNCTION BARU
    audioLoaded,
    isPlaying
  };
};

export default useAudio;