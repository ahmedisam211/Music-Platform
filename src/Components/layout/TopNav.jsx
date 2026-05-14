import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Terminal, User, Zap, Users, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SubmitTrackModal from '../modals/SubmitTrackModal';

export default function TopNav() {
  const [showSubmit, setShowSubmit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/people?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center glow-cyan">
              <Zap className="w-3.5 h-3.5 text-neon-cyan" />
            </div>
            <span className="font-mono font-bold text-base tracking-wider text-neon-cyan text-glow-cyan hidden sm:block">
              VXBE
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Search tracks, people..."
              className="pl-9 bg-muted/30 border-border/40 font-mono text-xs placeholder:text-muted-foreground/30 focus:border-neon-cyan/40 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link to="/people">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-neon-cyan">
                <Users className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              onClick={() => setShowSubmit(true)}
              variant="outline"
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/50 font-mono text-xs gap-1.5 h-8 hidden sm:flex"
            >
              <Terminal className="w-3 h-3" />
              SUBMIT
            </Button>
            <Button
              onClick={() => setShowSubmit(true)}
              variant="outline"
              size="icon"
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 sm:hidden w-8 h-8"
            >
              <Terminal className="w-3.5 h-3.5" />
            </Button>

            <Link to="/admin">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-neon-green">
                <Shield className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 flex items-center justify-center hover:glow-magenta transition-all cursor-pointer">
                <User className="w-3.5 h-3.5 text-neon-magenta" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <SubmitTrackModal open={showSubmit} onClose={() => setShowSubmit(false)} />
    </>
  );
}