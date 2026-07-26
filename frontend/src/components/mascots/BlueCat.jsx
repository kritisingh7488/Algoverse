import React from 'react';
import { motion } from 'framer-motion';

export const BlueCat = ({ className = "w-20 h-20", activity = "reading", dialogue = null }) => {
  return (
    <div className="relative inline-flex flex-col items-center group">
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-primary text-xs font-semibold font-body text-textPrimary shadow-soft max-w-[200px] text-center relative"
        >
          {dialogue}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-primary rotate-45" />
        </motion.div>
      )}

      <motion.svg
        viewBox="0 0 100 100"
        className={className}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Cat Ears */}
        <polygon points="25,35 15,10 40,25" fill="#60A5FA" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="75,35 85,10 60,25" fill="#60A5FA" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="27,30 20,15 37,24" fill="#F472B6" />
        <polygon points="73,30 80,15 63,24" fill="#F472B6" />

        {/* Tail */}
        <motion.path
          d="M 20 75 Q 5 70 10 50"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          animate={{ rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Cat Head & Body */}
        <circle cx="50" cy="45" r="30" fill="#93C5FD" stroke="#3B82F6" strokeWidth="3" />
        <ellipse cx="50" cy="75" rx="25" ry="18" fill="#60A5FA" stroke="#3B82F6" strokeWidth="3" />

        {/* Eyes with Blinking */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.93, 0.96, 1] }}
        >
          <circle cx="38" cy="42" r="5" fill="#1E3A8A" />
          <circle cx="62" cy="42" r="5" fill="#1E3A8A" />
          <circle cx="40" cy="40" r="1.5" fill="#FFFFFF" />
          <circle cx="64" cy="40" r="1.5" fill="#FFFFFF" />
        </motion.g>

        {/* Cute Snout & Whiskers */}
        <polygon points="50,47 47,50 53,50" fill="#F472B6" />
        <path d="M 47 52 Q 50 55 53 52" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="44" x2="32" y2="46" stroke="#1E3A8A" strokeWidth="1.5" />
        <line x1="18" y1="50" x2="31" y2="50" stroke="#1E3A8A" strokeWidth="1.5" />
        <line x1="80" y1="44" x2="68" y2="46" stroke="#1E3A8A" strokeWidth="1.5" />
        <line x1="82" y1="50" x2="69" y2="50" stroke="#1E3A8A" strokeWidth="1.5" />

        {/* Cheeks */}
        <ellipse cx="32" cy="48" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
        <ellipse cx="68" cy="48" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />

        {/* Activity Overlay: Book / Pencil */}
        {activity === "reading" && (
          <g>
            <rect x="35" y="68" width="30" height="20" rx="3" fill="#F87171" stroke="#B91C1C" strokeWidth="2" />
            <line x1="50" y1="68" x2="50" y2="88" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}
        {activity === "coding" && (
          <g>
            <rect x="32" y="70" width="36" height="22" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <text x="36" y="84" fill="#38BDF8" fontSize="10" fontFamily="monospace">&gt;_</text>
          </g>
        )}
      </motion.svg>
    </div>
  );
};
