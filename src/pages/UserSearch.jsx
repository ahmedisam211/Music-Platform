import React, { useState, useEffect } from 'react';
import { api } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { Search, User, UserPlus, UserCheck, Music } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function UserSearch() {
  const location = useLocation();
  const initialQ = new URLSearchParams(location.search).get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.auth.me().then(setMe);
  }, []);

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.entities.User.list(),
  });

  const { data: allFollows = [] } = useQuery({
    queryKey: ['follows-all'],
    queryFn: () => api.entities.Follow.list(),
  });

  const { data: allTracks = [] } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => api.entities.Track.list(),
  });

  const filtered = allUsers.filter(u => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const getFollowerCount = (email) => allFollows.filter(f => f.following_email === email).length;
  const getTrackCount = (email) => allTracks.filter(t => t.uploaded_by_email === email).length;
  const isFollowing = (email) => me ? allFollows.some(f => f.follower_email === me.email && f.following_email === email) : false;

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 max-w-[900px] mx-auto">
      <div className="pt-4 mb-6">
        <h1 className="text-2xl font-bold text-neon-cyan text-glow-cyan font-mono">PEOPLE</h1>
        <p className="text-xs text-muted-foreground font-mono mt-1">{'>'} Find creators & users</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-muted/20 border-border/40 font-mono text-sm placeholder:text-muted-foreground/30 focus:border-neon-cyan/40"
        />
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.map((u, i) => {
          const isSelf = me?.email === u.email;
          const following = isFollowing(u.email);
          const followers = getFollowerCount(u.email);
          const trackCount = getTrackCount(u.email);

          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/20 bg-card hover:border-neon-cyan/20 transition-all group"
            >
              <Link
                to={`/user/${encodeURIComponent(u.email)}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="w-10 h-10 rounded-full bg-muted border border-border/30 flex items-center justify-center shrink-0 group-hover:border-neon-cyan/30 transition-colors">
                  <User className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-neon-cyan transition-colors">
                    {u.full_name || u.email.split('@')[0]}
                    {isSelf && (
                      <span className="ml-2 text-[10px] font-mono text-neon-green/60 border border-neon-green/20 px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground/50 font-mono truncate">{u.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/50">
                    <Music className="w-3 h-3" />
                    {trackCount}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/50">
                    <UserCheck className="w-3 h-3" />
                    {followers}
                  </span>
                </div>
              </Link>

              {!isSelf && me && (
                <div className={`shrink-0 text-[10px] font-mono px-2 py-1 rounded border transition-colors
                  ${following
                    ? 'border-neon-cyan/30 text-neon-cyan'
                    : 'border-border/30 text-muted-foreground'}`}
                >
                  {following ? (
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Following</span>
                  ) : (
                    <span className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> Follow</span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <User className="w-8 h-8 text-muted-foreground/10 mx-auto mb-3" />
            <p className="font-mono text-sm text-muted-foreground/50">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}