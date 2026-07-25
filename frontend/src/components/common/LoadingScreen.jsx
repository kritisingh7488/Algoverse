import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading AlgoVerse...' }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl -z-10 animate-ping" />
        </div>

        <h2 className="text-xl font-bold font-poppins text-gray-900 tracking-tight">
          Algo<span className="text-primary">Verse</span>
        </h2>

        <p className="text-[14px] text-gray-500 font-inter">{message}</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
