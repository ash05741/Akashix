import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { Characters } from './components/character';
import World from './pages/world';
import Overview from './components/Overview';
import HomeVariantB from './components/Home/Home';
import Workspaces from './pages/Workspaces';
import UserProfile from './pages/UserProfile';

// 1. IMPORT THE SETTINGS PAGE
// (Adjust this path to './pages/Settings' if you saved it in the pages folder instead)
import { Settings } from './components/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeVariantB />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Routes (Requires Login) */}
          <Route element={<ProtectedRoute />}>

            {/* The Interstitial Screen */}
            <Route path="/workspaces" element={<Workspaces />} />

            {/* The Layout (Sidebar) wraps everything inside it */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dashboard/characters" element={<Characters />} />
              <Route path="/dashboard/world" element={<World />} />

              {/* 2. ADD THE SETTINGS ROUTE HERE */}
              <Route path="/dashboard/settings" element={<Settings />} />

              {/* User Profile Network */}
              <Route path="/dashboard/user/:id" element={<UserProfile />} />
            </Route>

          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;