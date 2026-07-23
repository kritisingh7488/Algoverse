import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Section - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary to-secondary overflow-hidden flex-col justify-center items-center text-white p-12">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-accent opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-lg"
        >
          <h1 className="text-5xl font-bold font-poppins mb-6">AlgoVerse</h1>
          <p className="text-xl font-inter opacity-90 leading-relaxed mb-12">
            The Interactive Algorithm Laboratory for Learning, Visualizing, Benchmarking and Mastering Data Structures & Algorithms.
          </p>
          
          {/* Mock Illustration Area */}
          <div className="w-full aspect-video bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm p-4 flex items-center justify-center shadow-2xl">
             <div className="flex gap-4 items-end h-32">
               {[40, 70, 50, 90, 60].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
                   className="w-12 bg-white/80 rounded-t-md"
                 ></motion.div>
               ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right Section - Auth Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-textPrimary font-poppins mb-2">{title}</h2>
            <p className="text-gray-500 font-inter">{subtitle}</p>
          </div>
          
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
