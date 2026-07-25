import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Playground from './pages/Playground';
import SortingLab from './pages/labs/SortingLab';
import SearchingLab from './pages/labs/SearchingLab';
import TreeLab from './pages/labs/TreeLab';
import NotFound from './pages/NotFound';
import useAuthStore from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Only Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verify-email/:token" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        
        {/* Protected Dashboard & Playground Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playground" 
          element={
            <ProtectedRoute>
              <Playground />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labs/sorting" 
          element={
            <ProtectedRoute>
              <SortingLab />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labs/searching" 
          element={
            <ProtectedRoute>
              <SearchingLab />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labs/tree" 
          element={
            <ProtectedRoute>
              <TreeLab />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
