import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import AudioPlayer from '../player/AudioPlayer';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <Outlet />
      </main>
      <AudioPlayer />
    </div>
  );
}