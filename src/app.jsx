import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import AppShell from './components/layout/AppShell';
import Explorer from './pages/Explorer';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import UserSearch from './pages/UserSearch';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './Components/ProtectedRoute'; // FIX: Add this import

const AuthenticatedApp = () => {
  const { loading } = useAuth();

  if (loading) return <div className="bg-black text-cyan-500 font-mono p-10">BOOTING_LOCAL_OS...</div>;

  return (
    <PlayerProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Explorer />} />
          <Route path="/user/:email" element={<PublicProfile />} />
          <Route path="/people" element={<UserSearch />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          
          {/* Admin Route */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </PlayerProvider>
  );
};

export default function App() {
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
export default app;