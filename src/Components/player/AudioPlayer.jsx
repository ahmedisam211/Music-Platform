import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, SkipForward, SkipBack, Repeat, ListMusic, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import WaveformVisualizer from './WaveformVisualizer';
import UpNextQueue from './UpNextQueue';
import { base44 } from '@/api/base44Client';

export default function AudioPlayer() {
  const {
    currentTrack, isPlaying, isLooping, showQueue, progress,
    togglePlay, skipNext, skipPrev, toggleLoop, toggleQueue, setProgress
  } = usePlayer();

  const [isHyped, setIsHyped] = useState(false);
  const [hyping, setHyping] = useState(false);
  const intervalRef = useRef(null);

  // Simulate progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const duration = currentTrack.duration || 240;
          if (prev >= duration) {
            if (isLooping) return 0;
            return prev;
          }
          return prev + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTrack, isLooping, setProgress]);

  const handleHype = async () => {
    if (!currentTrack) return;
    setHyping(true);
    setIsHyped(true);

    const user = await base44.auth.me();
    await base44.entities.HypedTrack.create({
      track_id: currentTrack.id,
      user_email: user?.email || 'anonymous'
    });

    setTimeout(() => setHyping(false), 400);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          {/* Waveform */}
          <div className="pt-2">
            <WaveformVisualizer
              progress={progress}
              duration={currentTrack.duration || 240}
              onSeek={setProgress}
              isPlaying={isPlaying}
            />
          </div>

          <div className="h-16 flex items-center gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 w-64 shrink-0">
              <div className="w-10 h-10 rounded-md overflow-hidden holographic shrink-0 border border-border/30">
                {currentTrack.cover_url ? (
                  <img src={currentTrack.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Zap className="w-4 h-4 text-neon-cyan/40" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 mx-auto">
              <Button variant="ghost" size="icon" onClick={skipPrev}
                className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:glow-cyan"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipNext}
                className="w-8 h-8 text-muted-foreground hover:text-foreground">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleLoop}
                className={`w-8 h-8 ${isLooping ? 'text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}>
                <Repeat className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Time + Actions */}
            <div className="flex items-center gap-3 w-64 justify-end shrink-0">
              <span className="font-mono text-xs text-muted-foreground hidden sm:block">
                {formatTime(progress)} / {formatTime(currentTrack.duration || 240)}
              </span>

              {/* Hype button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleHype}
                className={`w-8 h-8 ${isHyped ? 'text-neon-magenta' : 'text-muted-foreground hover:text-neon-magenta'} ${hyping ? 'hype-flash' : ''}`}
              >
                <Zap className="w-4 h-4" fill={isHyped ? 'currentColor' : 'none'} />
              </Button>

              {/* Queue toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleQueue}
                className={`w-8 h-8 ${showQueue ? 'text-neon-cyan' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ListMusic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQueue && <UpNextQueue />}
      </AnimatePresence>
    </>
  );
}