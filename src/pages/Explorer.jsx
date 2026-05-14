import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CategoryTabs from '../components/explorer/CategoryTabs';
import TrackRow from '../components/explorer/TrackRow';
import TrackComments from '../Components/social/TrackComments';
import { AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { api } from '@/api/api';

export default function Explorer() {
  const [category, setCategory] = useState('all');
  const [commentTrack, setCommentTrack] = useState(null);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => api.tracks.list(),
  });

  const handleCommentClick = (track) => {
    setCommentTrack(prev => prev?.id === track.id ? null : track);
  };

  // Group or flat list
  const renderTracks = () => {
    if (isLoading) {
      return (
        <div className="space-y-1">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse">
              <div className="w-10 h-10 rounded bg-muted/30 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted/30 rounded w-48" />
                <div className="h-2 bg-muted/20 rounded w-28" />
              </div>
              <div className="h-2 bg-muted/20 rounded w-10" />
            </div>
          ))}
        </div>
      );
    }

    if (tracks.length === 0) {
      return (
        <div className="text-center py-20">
          <Zap className="w-10 h-10 text-muted-foreground/10 mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm">No tracks yet</p>
        </div>
      );
    }

    if (category === 'all') {
      return (
        <div>
          {tracks.map((track, i) => (
            <div key={track.id}>
              <TrackRow
                track={track}
                index={i}
                allTracks={tracks}
                onCommentClick={handleCommentClick}
              />
              <AnimatePresence>
                {commentTrack?.id === track.id && (
                  <TrackComments track={track} onClose={() => setCommentTrack(null)} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      );
    }

    // Grouped views
    const grouped = {};
    tracks.forEach(t => {
      const key = category === 'albums' ? (t.album || '—') : (t.artist || '—');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });

    return (
      <div className="space-y-6">
        {Object.entries(grouped).map(([groupName, groupTracks]) => (
          <div key={groupName}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-2 px-3">
              <h3 className="text-sm font-semibold text-foreground/80">{groupName}</h3>
              <span className="font-mono text-[10px] text-muted-foreground/50">
                {groupTracks.length} track{groupTracks.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 h-px bg-border/20" />
            </div>
            {groupTracks.map((track, i) => (
              <div key={track.id}>
                <TrackRow
                  track={track}
                  index={i}
                  allTracks={groupTracks}
                  onCommentClick={handleCommentClick}
                />
                <AnimatePresence>
                  {commentTrack?.id === track.id && (
                    <TrackComments track={track} onClose={() => setCommentTrack(null)} />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-neon-cyan text-glow-cyan font-mono">FEED</h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          {'>'} {tracks.length} tracks in the network
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <CategoryTabs active={category} onChange={setCategory} />
      </div>

      {/* Divider */}
      <div className="h-px bg-border/20 mb-4" />

      {/* Track list */}
      {renderTracks()}
    </div>
  );
}