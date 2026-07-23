import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { Characters } from './components/character';
import World from './pages/world';

// A simple overview to replace your old "Welcome back Asmit" page
const Overview = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-zinc-100">Overview</h1>
    <div className="p-6 border border-zinc-800 rounded-xl bg-[#121212]">
      <p className="text-zinc-400">Welcome to your workspace. Start building your world.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Routes (Requires Login) */}
          <Route element={<ProtectedRoute />}>
            {/* The Layout (Sidebar) wraps everything inside it */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dashboard/characters" element={<Characters />} />
              <Route path="/dashboard/world" element={<World />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;