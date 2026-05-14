import React, { useMemo, useRef } from 'react';

export default function WaveformVisualizer({ progress, duration, onSeek, isPlaying }) {
  const barCount = 80;
  const containerRef = useRef(null);

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return (seed - Math.floor(seed)) * 0.7 + 0.3;
    });
  }, []);

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, pct * duration)));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-6 flex items-end gap-[2px] cursor-pointer group"
      onClick={handleClick}
    >
      {bars.map((height, i) => {
        const pct = (i / barCount) * 100;
        const isActive = pct <= progressPercent;
        const isNear = Math.abs(pct - progressPercent) < 2;

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-150"
            style={{
              height: `${height * 100}%`,
              minHeight: '2px',
              backgroundColor: isActive
                ? isNear
                  ? '#FF00E5'
                  : '#00F0FF'
                : '#1a1a1a',
              boxShadow: isActive && isPlaying
                ? isNear
                  ? '0 0 6px rgba(255,0,229,0.6)'
                  : '0 0 4px rgba(0,240,255,0.3)'
                : 'none',
              opacity: isActive ? 1 : 0.4,
              transform: isPlaying && isActive && isNear ? 'scaleY(1.2)' : 'scaleY(1)'
            }}
          />
        );
      })}
    </div>
  );
}