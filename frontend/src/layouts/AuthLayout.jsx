import React from 'react';
import { motion } from 'framer-motion';
import MascotRole from '../components/mascots/MascotRole';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-background font-body text-textPrimary selection:bg-primary/20 selection:text-primary">
      {/* Left Section - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-cardAccent border-r-2 border-borderTheme overflow-hidden flex-col justify-center items-center p-12 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center max-w-[440px] space-y-6 flex flex-col items-center"
        >
          <MascotRole role="teacher" activity="reading" dialogue="Welcome to AlgoVerse!" className="w-32 h-32" />

          <h1 className="text-4xl font-heading font-bold text-textPrimary tracking-tight">
            AlgoVerse
          </h1>
          <p className="text-base font-body text-textSecondary leading-relaxed">
            The Handcrafted Interactive Algorithm Playground for Visualizing, Benchmarking, and Mastering Data Structures.
          </p>
        </motion.div>
      </div>

      {/* Right Section - Auth Card */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-card rounded-card shadow-medium border-2 border-borderTheme p-8 sm:p-10">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-heading font-bold text-textPrimary tracking-tight">{title}</h2>
              <p className="text-xs font-body text-textSecondary">{subtitle}</p>
            </div>
            
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
