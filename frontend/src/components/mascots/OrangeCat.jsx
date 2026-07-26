import React from 'react';
import { motion } from 'framer-motion';

export const OrangeCat = ({ className = "w-20 h-20", activity = "reading", dialogue = null }) => {
  return (
    <div className="relative inline-flex flex-col items-center group">
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 px-3 py-1.5 rounded-2xl bg-card border-2 border-primary text-xs font-semibold font-body text-textPrimary shadow-soft max-w-[200px] text-center relative"
        >
          {dialogue}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b-2 border-r-2 border-primary rotate-45" />
        </motion.div>
      )}

      <motion.svg
        viewBox="0 0 100 100"
        className={className}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Cat Ears */}
        <polygon points="25,35 15,10 40,25" fill="#FF9F68" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="75,35 85,10 60,25" fill="#FF9F68" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="27,30 20,15 37,24" fill="#F472B6" />
        <polygon points="73,30 80,15 63,24" fill="#F472B6" />

        {/* Tail */}
        <motion.path
          d="M 20 75 Q 5 70 10 50"
          fill="none"
          stroke="#EA580C"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Cat Head & Body */}
        <circle cx="50" cy="45" r="30" fill="#FFB088" stroke="#EA580C" strokeWidth="3" />
        <ellipse cx="50" cy="75" rx="25" ry="18" fill="#FF9F68" stroke="#EA580C" strokeWidth="3" />

        {/* Eyes with Blinking */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.93, 0.96, 1] }}
        >
          <circle cx="38" cy="42" r="5" fill="#431407" />
          <circle cx="62" cy="42" r="5" fill="#431407" />
          <circle cx="40" cy="40" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="40" r="1.5" fill="#FFFFFF" />
        </motion.g>

        {/* Snout & Whiskers */}
        <polygon points="50,47 47,50 53,50" fill="#F472B6" />
        <path d="M 47 52 Q 50 55 53 52" fill="none" stroke="#431407" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="44" x2="32" y2="46" stroke="#431407" strokeWidth="1.5" />
        <line x1="18" y1="50" x2="31" y2="50" stroke="#431407" strokeWidth="1.5" />
        <line x1="80" y1="44" x2="68" y2="46" stroke="#431407" strokeWidth="1.5" />
        <line x1="82" y1="50" x2="69" y2="50" stroke="#431407" strokeWidth="1.5" />

        {/* Activity Overlay */}
        {activity === "reading" && (
          <g>
            <rect x="35" y="68" width="30" height="20" rx="3" fill="#C084FC" stroke="#7C3AED" strokeWidth="2" />
            <line x1="50" y1="68" x2="50" y2="88" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}
      </motion.svg>
    </div>
  );
};
