import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';

const NotFound = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-medium">
            <Compass className="w-10 h-10" />
          </div>

          <h1 className="text-5xl font-extrabold font-heading text-textPrimary tracking-tight">
            404
          </h1>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-heading text-textPrimary">
              Page Not Found
            </h2>
            <p className="text-textSecondary text-sm font-body">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" className="flex items-center justify-center gap-2 w-full">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NotFound;
