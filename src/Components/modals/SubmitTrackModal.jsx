import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, CheckCircle2, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitTrackModal({ open, onClose }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [lines, setLines] = useState([]);

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('soundcloud.com')) return 'soundcloud';
    if (url.includes('spotify.com')) return 'spotify';
    return 'unknown';
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setStatus('submitting');
    setLines(['> Initializing secure connection...']);

    await new Promise(r => setTimeout(r, 600));
    setLines(prev => [...prev, '> Parsing URL payload...']);

    const platform = detectPlatform(url);
    await new Promise(r => setTimeout(r, 500));
    setLines(prev => [...prev, `> Platform detected: ${platform.toUpperCase()}`]);

    await new Promise(r => setTimeout(r, 700));
    setLines(prev => [...prev, '> Encrypting transmission...']);

    const user = await base44.auth.me();
    await base44.entities.TrackRequest.create({
      url: url.trim(),
      platform,
      status: 'pending',
      submitted_by: user?.email || 'anonymous'
    });

    await new Promise(r => setTimeout(r, 500));
    setLines(prev => [...prev, '> Transmitting to Admin node...']);

    await new Promise(r => setTimeout(r, 800));
    setLines(prev => [...prev, '> ✓ TRANSMISSION COMPLETE']);
    setStatus('success');
  };

  const handleClose = () => {
    setUrl('');
    setStatus('idle');
    setLines([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neon-green/20 p-0 max-w-lg overflow-hidden sm:rounded-lg">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neon-green/10 bg-neon-green/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
          </div>
          <span className="font-mono text-xs text-neon-green/70 ml-2">request_terminal v2.0</span>
        </div>

        <div className="p-6 space-y-4">
          {/* Terminal output */}
          <div className="bg-[#050505] rounded-lg p-4 min-h-[160px] border border-neon-green/10">
            <AnimatePresence>
              {status === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-mono text-xs text-neon-green/50 mb-2">
                    {'>'} VXBE Track Request Terminal
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {'>'} Paste a track URL to submit for review
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {'>'} Supported: YouTube, SoundCloud, Spotify
                  </p>
                  <span className="inline-block w-2 h-4 bg-neon-green/60 animate-pulse mt-2" />
                </motion.div>
              )}
            </AnimatePresence>

            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`font-mono text-xs ${
                  line.includes('✓') ? 'text-neon-green text-glow-green' : 'text-neon-green/70'
                }`}
              >
                {line}
              </motion.p>
            ))}

            {status === 'submitting' && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-3 h-3 text-neon-green animate-spin" />
                <span className="font-mono text-xs text-neon-green/50">Processing...</span>
              </div>
            )}
          </div>

          {/* Input area */}
          {status === 'idle' && (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green/40" />
                <Input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 bg-[#050505] border-neon-green/20 font-mono text-sm text-neon-green placeholder:text-neon-green/20 focus:border-neon-green/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!url.trim()}
                className="bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-mono"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3"
            >
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              <span className="font-mono text-sm text-neon-green text-glow-green">
                Track submitted for admin review
              </span>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, CheckCircle2, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitTrackModal({ open, onClose }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [lines, setLines] = useState([]);

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('soundcloud.com')) return 'soundcloud';
    if (url.includes('spotify.com')) return 'spotify';
    return 'unknown';
  };

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setStatus('submitting');
    setLines(['> Initializing secure connection...']);

    await new Promise(r => setTimeout(r, 600));
    setLines(prev => [...prev, '> Parsing URL payload...']);

    const platform = detectPlatform(url);
    await new Promise(r => setTimeout(r, 500));
    setLines(prev => [...prev, `> Platform detected: ${platform.toUpperCase()}`]);

    await new Promise(r => setTimeout(r, 700));
    setLines(prev => [...prev, '> Encrypting transmission...']);

    const user = await base44.auth.me();
    await base44.entities.TrackRequest.create({
      url: url.trim(),
      platform,
      status: 'pending',
      submitted_by: user?.email || 'anonymous'
    });

    await new Promise(r => setTimeout(r, 500));
    setLines(prev => [...prev, '> Transmitting to Admin node...']);

    await new Promise(r => setTimeout(r, 800));
    setLines(prev => [...prev, '> ✓ TRANSMISSION COMPLETE']);
    setStatus('success');
  };

  const handleClose = () => {
    setUrl('');
    setStatus('idle');
    setLines([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border border-neon-green/20 p-0 max-w-lg overflow-hidden sm:rounded-lg">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neon-green/10 bg-neon-green/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
          </div>
          <span className="font-mono text-xs text-neon-green/70 ml-2">request_terminal v2.0</span>
        </div>

        <div className="p-6 space-y-4">
          {/* Terminal output */}
          <div className="bg-[#050505] rounded-lg p-4 min-h-[160px] border border-neon-green/10">
            <AnimatePresence>
              {status === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-mono text-xs text-neon-green/50 mb-2">
                    {'>'} VXBE Track Request Terminal
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {'>'} Paste a track URL to submit for review
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {'>'} Supported: YouTube, SoundCloud, Spotify
                  </p>
                  <span className="inline-block w-2 h-4 bg-neon-green/60 animate-pulse mt-2" />
                </motion.div>
              )}
            </AnimatePresence>

            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`font-mono text-xs ${
                  line.includes('✓') ? 'text-neon-green text-glow-green' : 'text-neon-green/70'
                }`}
              >
                {line}
              </motion.p>
            ))}

            {status === 'submitting' && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-3 h-3 text-neon-green animate-spin" />
                <span className="font-mono text-xs text-neon-green/50">Processing...</span>
              </div>
            )}
          </div>

          {/* Input area */}
          {status === 'idle' && (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green/40" />
                <Input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 bg-[#050505] border-neon-green/20 font-mono text-sm text-neon-green placeholder:text-neon-green/20 focus:border-neon-green/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!url.trim()}
                className="bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 font-mono"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3"
            >
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              <span className="font-mono text-sm text-neon-green text-glow-green">
                Track submitted for admin review
              </span>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}