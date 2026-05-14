import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { motion } from 'framer-motion';
import { X, GripVertical, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpNextQueue() {
  const { queue, toggleQueue, playTrack } = usePlayer();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed top-16 right-0 bottom-[88px] w-80 z-40 glass border-l border-border/50 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-mono text-sm text-neon-cyan tracking-wider">UP NEXT</h3>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={toggleQueue}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Zap className="w-8 h-8 mb-3 opacity-20" />
            <p className="font-mono text-xs">Queue empty</p>
          </div>
        ) : (
          queue.map((track, i) => (
            <div
              key={track.id || i}
              onClick={() => playTrack(track)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors"
            >
              <GripVertical className="w-3 h-3 text-muted-foreground/30" />
              <div className="w-8 h-8 rounded bg-muted overflow-hidden shrink-0">
                {track.cover_url ? (
                  <img src={track.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate group-hover:text-neon-cyan transition-colors">{track.title}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{track.artist}</p>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                {Math.floor((track.duration || 0) / 60)}:{((track.duration || 0) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}