import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Zap, Mail, UserPlus, UserCheck, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import DMChat from '../Components/social/DMChat';
import TrackRow from '../components/explorer/TrackRow';
import { AnimatePresence } from 'framer-motion';

export default function PublicProfile() {
  const { email: encodedEmail } = useParams();
  const email = decodeURIComponent(encodedEmail || '');
  const [me, setMe] = useState(null);
  const [showDM, setShowDM] = useState(false);
  const { playTrack } = usePlayer();
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setMe);
  }, []);

  // Get all users to find this one
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });
  const profileUser = allUsers.find(u => u.email === email);

  // Tracks uploaded by this user
  const { data: tracks = [] } = useQuery({
    queryKey: ['tracks', 'by', email],
    queryFn: () => base44.entities.Track.filter({ uploaded_by_email: email }, '-created_date', 50),
    enabled: !!email,
  });

  // Hyped tracks
  const { data: hypedTracks = [] } = useQuery({
    queryKey: ['hyped', email],
    queryFn: async () => {
      const hyped = await base44.entities.HypedTrack.filter({ user_email: email });
      if (!hyped.length) return [];
      const all = await base44.entities.Track.list();
      const ids = new Set(hyped.map(h => h.track_id));
      return all.filter(t => ids.has(t.id));
    },
    enabled: !!email,
  });

  // Followers / following counts
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', email],
    queryFn: () => base44.entities.Follow.filter({ following_email: email }),
    enabled: !!email,
  });
  const { data: following = [] } = useQuery({
    queryKey: ['following', email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: email }),
    enabled: !!email,
  });

  // Am I following?
  const isFollowing = me ? followers.some(f => f.follower_email === me.email) : false;
  const isSelf = me?.email === email;

  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        const record = followers.find(f => f.follower_email === me.email);
        if (record) await base44.entities.Follow.delete(record.id);
      } else {
        await base44.entities.Follow.create({
          follower_email: me.email,
          following_email: email,
          follower_name: me.full_name || '',
          following_name: profileUser?.full_name || email,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', email] });
    },
  });

  const [activeTab, setActiveTab] = useState('tracks');

  const displayName = profileUser?.full_name || email.split('@')[0];

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 max-w-[1000px] mx-auto">
      {/* Banner */}
      <div className="h-28 rounded-2xl bg-gradient-to-r from-neon-cyan/10 via-neon-magenta/5 to-neon-green/10 border border-border/20 mb-0 relative overflow-hidden scanlines" />

      {/* Profile row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-8 px-2 mb-6">
        <div className="w-16 h-16 rounded-xl bg-card border-2 border-neon-cyan/30 flex items-center justify-center glow-cyan shrink-0">
          <User className="w-7 h-7 text-neon-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{displayName}</h1>
          <p className="font-mono text-xs text-muted-foreground/60">{email}</p>
        </div>
        {!isSelf && me && (
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => followMutation.mutate()}
              className={isFollowing
                ? 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 font-mono text-xs gap-1.5'
                : 'border-border/40 text-muted-foreground hover:text-foreground font-mono text-xs gap-1.5'}
            >
              {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDM(true)}
              className="border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10 font-mono text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Message
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-6 px-2 mb-6">
        {[
          { label: 'Tracks', value: tracks.length },
          { label: 'Followers', value: followers.length },
          { label: 'Following', value: following.length },
          { label: 'Hyped', value: hypedTracks.length },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-bold font-mono text-neon-cyan">{value}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border/20">
        {[
          { key: 'tracks', label: 'Tracks', icon: Music },
          { key: 'hyped', label: 'Hyped', icon: Zap },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono border-b-2 -mb-px transition-colors
              ${activeTab === key
                ? 'border-neon-cyan text-neon-cyan'
                : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tracks' && (
        tracks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-mono text-sm">
            No tracks uploaded yet
          </div>
        ) : (
          <div>
            {tracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} allTracks={tracks} />
            ))}
          </div>
        )
      )}
      {activeTab === 'hyped' && (
        hypedTracks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-mono text-sm">
            No hyped tracks yet
          </div>
        ) : (
          <div>
            {hypedTracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} allTracks={hypedTracks} />
            ))}
          </div>
        )
      )}

      {/* DM */}
      <AnimatePresence>
        {showDM && (
          <DMChat
            recipientEmail={email}
            recipientName={displayName}
            onClose={() => setShowDM(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}