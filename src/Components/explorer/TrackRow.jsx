import React from 'react';
import { Play, Pause, Zap, User } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext'; // Fix path
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TrackRow({ track, index, allTracks, onCommentClick }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { user } = useAuth(); // Moved outside the return
  const isActive = currentTrack?.id === track.id;

  const formatTime = (s) => {
    if (!s) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${isActive ? 'border-neon-cyan/30 bg-neon-cyan/5' : 'border-transparent hover:border-border/40 hover:bg-muted/30'}`}
      onClick={() => playTrack(track, allTracks)}
    >
      <div className="relative w-10 h-10 rounded shrink-0 overflow-hidden bg-muted">
        {track.cover_url ? <img src={track.cover_url} className="w-full h-full object-cover" /> : <Zap className="w-4 h-4 m-auto text-muted-foreground/30" />}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100">
           {isActive && isPlaying ? <Pause className="w-4 h-4 text-neon-cyan" /> : <Play className="w-4 h-4 text-white" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-neon-cyan' : 'text-foreground'}`}>{track.title}</p>
        <p className="text-xs text-muted-foreground font-mono">{track.artist}</p>
      </div>

      {onCommentClick && user && (
        <button
          onClick={(e) => { e.stopPropagation(); onCommentClick(track); }}
          className="text-[10px] font-mono text-muted-foreground/30 hover:text-neon-cyan px-1"
        >
          CMMT
        </button>
      )}
      <span className="font-mono text-xs text-muted-foreground/50 w-10 text-right">{formatTime(track.duration)}</span>
    </motion.div>
  );
}