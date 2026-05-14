import React, { createContext, useContext, useState, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const playTrack = useCallback((track, trackList = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (trackList.length > 0) {
      const idx = trackList.findIndex(t => t.id === track.id);
      const remaining = trackList.slice(idx + 1);
      setQueue(remaining);
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrentTrack(next);
      setQueue(rest);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [queue]);

  const skipPrev = useCallback(() => {
    setProgress(0);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  const toggleQueue = useCallback(() => {
    setShowQueue(prev => !prev);
  }, []);

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, queue, progress, isLooping, showQueue,
      playTrack, togglePlay, skipNext, skipPrev, toggleLoop, toggleQueue,
      setProgress, addToQueue, setQueue
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}