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
import BenchmarkCenter from './pages/BenchmarkCenter';
import CodePlayground from './pages/CodePlayground';
import Community from './pages/Community';
import Contests from './pages/Contests';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Roadmap from './pages/Roadmap';
import SortingLab from './pages/labs/SortingLab';
import SearchingLab from './pages/labs/SearchingLab';
import TreeLab from './pages/labs/TreeLab';
import GraphLab from './pages/labs/GraphLab';
import DPStudio from './pages/labs/DPStudio';
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
          path="/benchmarks" 
          element={
            <ProtectedRoute>
              <BenchmarkCenter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/code-playground" 
          element={
            <ProtectedRoute>
              <CodePlayground />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contests" 
          element={
            <ProtectedRoute>
              <Contests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/roadmap" 
          element={
            <ProtectedRoute>
              <Roadmap />
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
        <Route 
          path="/labs/graph" 
          element={
            <ProtectedRoute>
              <GraphLab />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/labs/dp" 
          element={
            <ProtectedRoute>
              <DPStudio />
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
