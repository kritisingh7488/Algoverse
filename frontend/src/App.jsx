import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import useAuthStore from './store/authStore';

import AppLayout from './layouts/AppLayout';
import NotFound from './pages/NotFound';

// Temporary placeholder for dashboard using AppLayout
const Dashboard = () => (
  <AppLayout>
    <div className="py-8 space-y-6">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border border-primary/10">
        <h1 className="text-3xl font-bold font-poppins text-gray-900 tracking-tight mb-2">
          Welcome to AlgoVerse
        </h1>
        <p className="text-gray-600 text-[15px] font-inter max-w-2xl leading-relaxed">
          Application Shell initialized successfully! Explore algorithm labs, data structure playgrounds, and benchmark tools from the sidebar navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Sorting Lab', desc: 'Visualize Bubble, Quick, Merge, & Heap sort step-by-step', link: '/labs/sorting', color: 'from-purple-500/10 to-primary/10' },
          { title: 'Data Structures', desc: 'Interactive Canvas for Stacks, Queues, Trees & Graphs', link: '/playground', color: 'from-pink-500/10 to-accent/10' },
          { title: 'Benchmark Center', desc: 'Compare algorithms with execution time & memory charts', link: '/benchmarks', color: 'from-blue-500/10 to-indigo-500/10' }
        ].map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-gray-100/80 shadow-xs space-y-3`}>
            <h3 className="text-lg font-semibold font-poppins text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 font-inter">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

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
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verify-email/:token" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
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
