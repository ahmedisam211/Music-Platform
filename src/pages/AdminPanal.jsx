import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Pencil, Trash2, Check, X, Plus, Upload, Search, ChevronDown, ChevronUp, Zap, Users, Music, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

function EditTrackRow({ track, onSave, onDelete, onCancel, isNew }) {
  const [form, setForm] = useState({
    title: track.title || '',
    artist: track.artist || '',
    album: track.album || '',
    genre: track.genre || '',
    duration: track.duration || '',
    cover_url: track.cover_url || '',
    audio_url: track.audio_url || '',
    uploaded_by_name: track.uploaded_by_name || '',
    uploaded_by_email: track.uploaded_by_email || '',
    hype_count: track.hype_count || 0,
    play_count: track.play_count || 0,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-neon-cyan/30 rounded-xl bg-neon-cyan/5 p-4 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="Title *" value={form.title} onChange={v => set('title', v)} />
        <Field label="Artist *" value={form.artist} onChange={v => set('artist', v)} />
        <Field label="Album" value={form.album} onChange={v => set('album', v)} />
        <Field label="Genre" value={form.genre} onChange={v => set('genre', v)} />
        <Field label="Duration (sec)" value={form.duration} onChange={v => set('duration', Number(v))} type="number" />
        <Field label="Uploader Name" value={form.uploaded_by_name} onChange={v => set('uploaded_by_name', v)} />
        <Field label="Uploader Email" value={form.uploaded_by_email} onChange={v => set('uploaded_by_email', v)} />
        <Field label="Hype Count" value={form.hype_count} onChange={v => set('hype_count', Number(v))} type="number" />
        <Field label="Play Count" value={form.play_count} onChange={v => set('play_count', Number(v))} type="number" />
      </div>
      <Field label="Cover Image URL" value={form.cover_url} onChange={v => set('cover_url', v)} full />
      <Field label="Audio URL" value={form.audio_url} onChange={v => set('audio_url', v)} full />

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => onSave(form)}
          className="bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 font-mono text-xs gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          {isNew ? 'Create' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="font-mono text-xs text-muted-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

function Field({ label, value, onChange, type = 'text', full }) {
  return (
    <div className={full ? 'col-span-full' : ''}>
      <label className="block font-mono text-[10px] text-muted-foreground/60 mb-1 tracking-wider">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 bg-muted/20 border-border/40 font-mono text-xs focus:border-neon-cyan/40"
      />
    </div>
  );
}

export default function AdminPanel() {
  const [me, setMe] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tracks');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => { setMe(u); setAuthLoading(false); });
  }, []);

  const { data: tracks = [], isLoading: tracksLoading } = useQuery({
    queryKey: ['tracks-admin'],
    queryFn: () => base44.entities.Track.list('-created_date', 200),
    enabled: me?.role === 'admin',
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['track-requests'],
    queryFn: () => base44.entities.TrackRequest.list('-created_date', 100),
    enabled: me?.role === 'admin',
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-admin'],
    queryFn: () => base44.entities.User.list(),
    enabled: me?.role === 'admin',
  });

  const updateTrack = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Track.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tracks-admin'] }); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setEditingId(null); },
  });

  const createTrack = useMutation({
    mutationFn: (data) => base44.entities.Track.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tracks-admin'] }); queryClient.invalidateQueries({ queryKey: ['tracks'] }); setShowNewForm(false); },
  });

  const deleteTrack = useMutation({
    mutationFn: (id) => base44.entities.Track.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tracks-admin'] }); queryClient.invalidateQueries({ queryKey: ['tracks'] }); },
  });

  const updateRequest = useMutation({
    mutationFn: ({ id, status }) => base44.entities.TrackRequest.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['track-requests'] }),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (me?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-neon-magenta/20 mx-auto mb-4" />
          <p className="font-mono text-neon-magenta text-sm">ACCESS DENIED</p>
          <p className="font-mono text-xs text-muted-foreground mt-2">Admin privileges required</p>
        </div>
      </div>
    );
  }

  const filteredTracks = tracks.filter(t =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.artist?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="pt-4 mb-6 flex items-center gap-3">
        <Shield className="w-5 h-5 text-neon-green" />
        <div>
          <h1 className="text-xl font-bold font-mono text-neon-green text-glow-green">ADMIN PANEL</h1>
          <p className="font-mono text-[10px] text-muted-foreground/60">Full system control</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Tracks', value: tracks.length, icon: Music, color: 'text-neon-cyan' },
          { label: 'Users', value: users.length, icon: Users, color: 'text-neon-magenta' },
          { label: 'Pending', value: pendingRequests.length, icon: FileText, color: 'text-neon-green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border/30 rounded-xl p-4 flex items-center gap-3">
            <Icon className={`w-5 h-5 ${color} opacity-60`} />
            <div>
              <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
              <p className="font-mono text-[10px] text-muted-foreground/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/20 mb-5">
        {[
          { key: 'tracks', label: 'Tracks' },
          { key: 'requests', label: `Requests${pendingRequests.length ? ` (${pendingRequests.length})` : ''}` },
          { key: 'users', label: 'Users' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 font-mono text-xs border-b-2 -mb-px transition-colors
              ${activeTab === key ? 'border-neon-green text-neon-green' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TRACKS TAB */}
      {activeTab === 'tracks' && (
        <div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
              <Input
                placeholder="Search tracks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-8 bg-muted/20 border-border/40 font-mono text-xs"
              />
            </div>
            <Button
              size="sm"
              onClick={() => { setShowNewForm(true); setEditingId(null); }}
              className="bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-mono text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Track
            </Button>
          </div>

          {/* New track form */}
          <AnimatePresence>
            {showNewForm && (
              <div className="mb-3">
                <EditTrackRow
                  track={{}}
                  isNew
                  onSave={(data) => createTrack.mutate(data)}
                  onCancel={() => setShowNewForm(false)}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Track list */}
          <div className="space-y-1">
            {tracksLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted/20 animate-pulse" />
              ))
            ) : filteredTracks.map(track => (
              <div key={track.id}>
                {editingId === track.id ? (
                  <div className="mb-1">
                    <EditTrackRow
                      track={track}
                      onSave={(data) => updateTrack.mutate({ id: track.id, data })}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-border/30 hover:bg-muted/20 group transition-all">
                    <div className="w-8 h-8 rounded bg-muted shrink-0 overflow-hidden">
                      {track.cover_url
                        ? <img src={track.cover_url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Zap className="w-3 h-3 text-muted-foreground/20" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{track.artist}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground/40 hidden sm:block">{track.genre || '—'}</span>
                    <span className="font-mono text-[10px] text-neon-magenta/40 hidden sm:block">
                      {track.hype_count || 0} hype
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-neon-cyan hover:bg-neon-cyan/10"
                        onClick={() => { setEditingId(track.id); setShowNewForm(false); }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:bg-destructive/10"
                        onClick={() => { if (confirm(`Delete "${track.title}"?`)) deleteTrack.mutate(track.id); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-2">
          {requests.length === 0 ? (
            <p className="text-center py-12 font-mono text-sm text-muted-foreground/50">No requests yet</p>
          ) : requests.map(req => (
            <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/20 bg-card">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-neon-cyan/80 truncate">{req.url}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                    req.platform === 'youtube' ? 'border-red-500/30 text-red-400' :
                    req.platform === 'spotify' ? 'border-neon-green/30 text-neon-green' :
                    'border-orange-500/30 text-orange-400'
                  }`}>{req.platform?.toUpperCase()}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                    req.status === 'pending' ? 'border-yellow-500/30 text-yellow-400' :
                    req.status === 'approved' ? 'border-neon-green/30 text-neon-green' :
                    'border-destructive/30 text-destructive'
                  }`}>{req.status?.toUpperCase()}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/40">{req.submitted_by}</span>
                </div>
              </div>
              {req.status === 'pending' && (
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-neon-green hover:bg-neon-green/10 font-mono text-xs"
                    onClick={() => updateRequest.mutate({ id: req.id, status: 'approved' })}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-destructive hover:bg-destructive/10 font-mono text-xs"
                    onClick={() => updateRequest.mutate({ id: req.id, status: 'rejected' })}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-1">
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-border/30 hover:bg-muted/20 transition-all">
              <div className="w-8 h-8 rounded-full bg-muted border border-border/30 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{u.full_name || '—'}</p>
                <p className="text-xs text-muted-foreground/60 font-mono truncate">{u.email}</p>
              </div>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded border shrink-0 ${
                u.role === 'admin' ? 'border-neon-green/30 text-neon-green' : 'border-border/30 text-muted-foreground/50'
              }`}>
                {u.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}