import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { PlayerProvider } from './context/PlayerContext';
import AppShell from './components/layout/AppShell';
import Explorer from './pages/Explorer';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import UserSearch from './pages/UserSearch';
import AdminPanel from './pages/AdminPanel';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-neon-cyan/40 tracking-widest">BOOT</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <PlayerProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Explorer />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/:email" element={<PublicProfile />} />
          <Route path="/people" element={<UserSearch />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </PlayerProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;