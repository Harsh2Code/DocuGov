import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import DocumentsPage from './pages/DocumentsPage';
import SharedDocument from './pages/SharedDocument';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vault" element={
          isAuthenticated ? <DocumentsPage /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/shared/:id" element={<SharedDocument />} />
        <Route path="/profile" element={
          isAuthenticated ? <Profile /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;