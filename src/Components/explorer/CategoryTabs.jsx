import React from 'react';
import { LayoutList, Disc3, Users } from 'lucide-react';

const tabs = [
  { key: 'all', label: 'ALL TRACKS', icon: LayoutList, color: 'neon-cyan' },
  { key: 'albums', label: 'ALBUMS', icon: Disc3, color: 'neon-magenta' },
  { key: 'artists', label: 'ARTISTS', icon: Users, color: 'neon-green' },
];

const colorClasses = {
  'neon-cyan': {
    active: 'text-neon-cyan border-neon-cyan/50 bg-neon-cyan/5',
    glow: 'glow-cyan',
    hover: 'hover:text-neon-cyan hover:border-neon-cyan/30',
  },
  'neon-magenta': {
    active: 'text-neon-magenta border-neon-magenta/50 bg-neon-magenta/5',
    glow: 'glow-magenta',
    hover: 'hover:text-neon-magenta hover:border-neon-magenta/30',
  },
  'neon-green': {
    active: 'text-neon-green border-neon-green/50 bg-neon-green/5',
    glow: 'glow-green',
    hover: 'hover:text-neon-green hover:border-neon-green/30',
  },
};

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(({ key, label, icon: Icon, color }) => {
        const isActive = active === key;
        const cls = colorClasses[color];
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs tracking-widest transition-all duration-300
              ${isActive ? `${cls.active} ${cls.glow}` : `border-border/40 text-muted-foreground ${cls.hover}`}
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}