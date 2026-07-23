import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20 selection:text-primary">
      {/* Left Section - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-primary to-[#5A3EE5] overflow-hidden flex-col justify-center items-center text-white p-12">
        {/* Refined Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-[0.07] rounded-full blur-[100px] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-accent opacity-[0.15] rounded-full blur-[120px] mix-blend-overlay pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center max-w-[440px]"
        >
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <svg className="w-7 h-7 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-[42px] font-semibold font-poppins mb-5 tracking-tight leading-tight">
            AlgoVerse
          </h1>
          <p className="text-[16px] font-inter text-white/90 leading-relaxed mb-14">
            The Interactive Algorithm Laboratory for Learning, Visualizing, Benchmarking and Mastering Data Structures.
          </p>
          
          {/* Mock Illustration Area - Refined */}
          <div className="w-full aspect-[16/10] bg-white/10 rounded-2xl border border-white/[0.15] backdrop-blur-md p-6 flex flex-col justify-end shadow-[0_20px_40px_rgba(0,0,0,0.15)] relative overflow-hidden group">
             {/* Subtle grid pattern */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmurlI6Ii8+PC9zdmc+')] opacity-30" />
             
             <div className="flex gap-4 items-end h-40 mx-auto relative z-10 w-full justify-center">
               {[40, 75, 55, 100, 65].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ duration: 0.6, delay: i * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                   className={`w-10 sm:w-12 rounded-t-lg transition-all duration-300 ${
                     h === 100 
                      ? 'bg-gradient-to-t from-accent to-[#FFB3D9] shadow-[0_0_20px_rgba(255,138,194,0.4)] relative' 
                      : 'bg-white/80 border border-white border-b-0'
                   }`}
                 >
                   {h === 100 && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-primary px-2 py-1 rounded text-[11px] font-bold shadow-lg animate-[float_3s_ease-in-out_infinite]">
                       Target
                     </div>
                   )}
                 </motion.div>
               ))}
             </div>
          </div>
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
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>

          <div className="bg-card rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgb(0,0,0,0.02)] border border-gray-100/80 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-[26px] font-semibold text-textPrimary font-poppins mb-2 tracking-tight">{title}</h2>
              <p className="text-[14px] text-gray-500 font-inter">{subtitle}</p>
            </div>
            
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
