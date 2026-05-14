import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

// My profile just redirects to public profile view with my own email
export default function UserProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.email) {
        navigate(`/user/${encodeURIComponent(user.email)}`, { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
    </div>
  );
}