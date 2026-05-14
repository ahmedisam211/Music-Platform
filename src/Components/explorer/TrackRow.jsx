import React from 'react';
import { Play, Pause, Zap, User } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TrackRow({ track, index, allTracks, onCommentClick }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === track.id;

  const formatTime = (s) => {
    if (!s) return '0:00';
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    playTrack(track, allTracks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer
        ${isActive
          ? 'border-neon-cyan/30 bg-neon-cyan/5'
          : 'border-transparent hover:border-border/40 hover:bg-muted/30'
        }`}
      onClick={handlePlay}
    >
      {/* Cover + Play */}
      <div className="relative w-10 h-10 rounded shrink-0 overflow-hidden bg-muted">
        {track.cover_url ? (
          <img src={track.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Zap className="w-3.5 h-3.5 text-muted-foreground/30" />
          </div>
        )}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isActive && isPlaying
            ? <Pause className="w-4 h-4 text-neon-cyan" />
            : <Play className="w-4 h-4 text-white ml-0.5" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className={`text-sm font-medium truncate ${isActive ? 'text-neon-cyan' : 'group-hover:text-foreground text-foreground/90'}`}>
            {track.title}
          </span>
          {track.album && (
            <span className="text-xs text-muted-foreground/50 truncate hidden sm:block">— {track.album}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground font-mono">{track.artist}</span>
          {track.genre && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground/50 font-mono hidden sm:block">
              {track.genre}
            </span>
          )}
        </div>
      </div>

      {/* Uploader */}
      {track.uploaded_by_name && (
        <Link
          to={`/user/${encodeURIComponent(track.uploaded_by_email || '')}`}
          onClick={(e) => e.stopPropagation()}
          className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-neon-magenta transition-colors shrink-0"
        >
          <User className="w-3 h-3" />
          <span className="font-mono">{track.uploaded_by_name}</span>
        </Link>
      )}

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        {track.hype_count > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-mono text-neon-magenta/50">
            <Zap className="w-3 h-3" />
            {track.hype_count}
          </span>
        )}
        {track.play_count > 0 && (
          <span className="text-[11px] font-mono text-muted-foreground/40">
            {track.play_count >= 1000 ? `${(track.play_count / 1000).toFixed(1)}k` : track.play_count} plays
          </span>
        )}
      </div>

      {/* Duration */}
      <span className="font-mono text-xs text-muted-foreground/50 shrink-0 w-10 text-right">
        {formatTime(track.duration)}
      </span>

      {/* Comment button */}
      {onCommentClick && (
        <button
          onClick={(e) => { e.stopPropagation(); onCommentClick(track); }}
          className="text-[10px] font-mono text-muted-foreground/30 hover:text-neon-cyan transition-colors shrink-0 px-1"
        >
          CMMT
        </button>
      )}
    </motion.div>
  );
}