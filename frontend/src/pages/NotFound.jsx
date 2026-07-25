import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <AppLayout showSidebar={false}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md space-y-6"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
            <Compass className="w-12 h-12 animate-spin-slow" />
          </div>

          <h1 className="text-6xl font-extrabold font-poppins text-gray-900 tracking-tight">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-poppins text-gray-900">
              Algorithm Node Not Found
            </h2>
            <p className="text-gray-500 text-[15px] font-inter">
              The page or resource you are looking for has been moved, removed, or never existed in the universe.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" className="flex items-center justify-center gap-2">
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
