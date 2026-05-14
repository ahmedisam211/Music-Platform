import React, { useState } from 'react';
import { api } from '@/api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessageSquare, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackComments({ track, onClose }) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', track.id],
    queryFn: () => api.entities.Comment.filter({ track_id: track.id }, '-created_date', 100),
  });

  const addComment = useMutation({
    mutationFn: async (content) => {
      const user = await base44.auth.me();
      return api.entities.Comment.create({
        track_id: track.id,
        content,
        reaction_type: 'text',
        author_name: user?.full_name || 'Anonymous',
        author_email: user?.email || '',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', track.id] }),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    addComment.mutate(message.trim());
    setMessage('');
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-1 mx-3 mb-3 rounded-lg border border-border/30 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-mono text-xs text-neon-cyan tracking-wider">COMMENTS</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {track.title}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Comment input */}
      <div className="px-4 py-2 border-b border-border/20 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Add a comment..."
          className="bg-muted/20 border-border/30 text-sm placeholder:text-muted-foreground/30 focus:border-neon-cyan/30 h-8"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          disabled={!message.trim()}
          className="shrink-0 w-8 h-8 text-neon-cyan hover:bg-neon-cyan/10"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Comments list */}
      <div className="max-h-56 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <span className="font-mono text-xs text-muted-foreground/40">Loading...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-mono text-xs text-muted-foreground/40">No comments yet. Be the first.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            <AnimatePresence>
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 px-4 py-2.5"
                >
                  <div className="w-6 h-6 rounded-full bg-muted border border-border/30 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-neon-magenta/70">
                        {c.author_name || 'Anonymous'}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/30">
                        {timeAgo(c.created_date)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{c.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}