import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { PlayerProvider } from './context/PlayerContext';
import AppShell from './components/layout/AppShell';
import Explorer from './pages/Explorer';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import UserSearch from './pages/UserSearch';
import AdminPanel from './pages/AdminPanel';

const AuthenticatedApp = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-neon-cyan/40 tracking-widest">BOOTING LOCAL...</span>
        </div>
      </div>
    );
  }

  return (
    <PlayerProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Explorer />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          </Route>
          {/* Public Views */}
          <Route path="/user/:email" element={<PublicProfile />} />
          <Route path="/people" element={<UserSearch />} />
        </Route>
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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