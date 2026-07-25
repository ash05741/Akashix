import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { Characters } from './components/character';
import World from './pages/world';
import Overview from './components/overview'; // This imports the full metrics dashboard

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