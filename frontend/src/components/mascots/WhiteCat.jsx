import React from 'react';
import { motion } from 'framer-motion';

export const WhiteCat = ({ className = "w-20 h-20", activity = "star", dialogue = null }) => {
  return (
    <div className="relative inline-flex flex-col items-center group">
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 px-3 py-1.5 rounded-2xl bg-card border-2 border-secondary text-xs font-semibold font-body text-textPrimary shadow-soft max-w-[200px] text-center relative"
        >
          {dialogue}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b-2 border-r-2 border-secondary rotate-45" />
        </motion.div>
      )}

      <motion.svg
        viewBox="0 0 100 100"
        className={className}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      >
        {/* Cat Ears */}
        <polygon points="25,35 15,10 40,25" fill="#FFF8F5" stroke="#CBD5E1" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="75,35 85,10 60,25" fill="#FFF8F5" stroke="#CBD5E1" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="27,30 20,15 37,24" fill="#F472B6" />
        <polygon points="73,30 80,15 63,24" fill="#F472B6" />

        {/* Tail */}
        <motion.path
          d="M 80 75 Q 95 65 90 45"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />

        {/* Cat Head & Body */}
        <circle cx="50" cy="45" r="30" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
        <ellipse cx="50" cy="75" rx="25" ry="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="3" />

        {/* Eyes with Blinking */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.88, 0.92, 0.96, 1] }}
        >
          <circle cx="38" cy="42" r="6" fill="#38BDF8" />
          <circle cx="62" cy="42" r="6" fill="#38BDF8" />
          <ellipse cx="38" cy="42" rx="2" ry="5" fill="#0F172A" />
          <ellipse cx="62" cy="42" rx="2" ry="5" fill="#0F172A" />
          <circle cx="40" cy="39" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="39" r="1.5" fill="#FFFFFF" />
        </motion.g>

        {/* Nose & Whiskers */}
        <polygon points="50,47 47,50 53,50" fill="#F472B6" />
        <path d="M 47 52 Q 50 55 53 52" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="44" x2="31" y2="46" stroke="#94A3B8" strokeWidth="1.2" />
        <line x1="16" y1="50" x2="30" y2="50" stroke="#94A3B8" strokeWidth="1.2" />
        <line x1="82" y1="44" x2="69" y2="46" stroke="#94A3B8" strokeWidth="1.2" />
        <line x1="84" y1="50" x2="70" y2="50" stroke="#94A3B8" strokeWidth="1.2" />

        {/* Activity Star */}
        {activity === "star" && (
          <polygon points="50,65 53,73 61,73 54,78 57,86 50,81 43,86 46,78 39,73 47,73" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
        )}
      </motion.svg>
    </div>
  );
};
