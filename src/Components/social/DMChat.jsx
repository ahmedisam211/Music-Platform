import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Send, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DMChat({ recipientEmail, recipientName, onClose }) {
  const [message, setMessage] = useState('');
  const [myEmail, setMyEmail] = useState('');
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  const conversationId = [myEmail, recipientEmail].sort().join('::');

  useEffect(() => {
    base44.auth.me().then(u => setMyEmail(u?.email || ''));
  }, []);

  const { data: messages = [] } = useQuery({
    queryKey: ['dm', conversationId],
    queryFn: () => conversationId && myEmail
      ? base44.entities.Message.filter({ conversation_id: conversationId }, 'created_date', 100)
      : [],
    enabled: !!myEmail,
    refetchInterval: 3000,
  });

  const sendMessage = useMutation({
    mutationFn: (content) => base44.entities.Message.create({
      sender_email: myEmail,
      receiver_email: recipientEmail,
      content,
      conversation_id: conversationId,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dm', conversationId] }),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage.mutate(message.trim());
    setMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 w-80 z-50 glass rounded-xl border border-neon-cyan/20 overflow-hidden flex flex-col"
      style={{ height: '400px' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3 text-neon-green" />
          <span className="font-mono text-xs text-neon-cyan tracking-wider">ENCRYPTED MSG</span>
        </div>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
        <p className="text-xs font-medium">{recipientName}</p>
        <p className="text-[10px] font-mono text-muted-foreground">{recipientEmail}</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMine = msg.sender_email === myEmail;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-lg text-xs ${
                isMine
                  ? 'bg-neon-cyan/10 border border-neon-cyan/20 text-foreground'
                  : 'bg-muted border border-border/30 text-foreground'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type encrypted msg..."
          className="bg-muted/30 border-border/30 font-mono text-xs placeholder:text-muted-foreground/30"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSend}
          className="shrink-0 text-neon-cyan hover:bg-neon-cyan/10"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}