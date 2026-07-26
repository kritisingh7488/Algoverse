import React from 'react';

export const PaperClip = ({ className = "w-6 h-10 text-secondary" }) => {
  return (
    <svg className={className} viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 8 12 L 8 28 A 4 4 0 0 0 16 28 L 16 8 A 6 6 0 0 0 4 8 L 4 30 A 8 8 0 0 0 20 30 L 20 14" />
    </svg>
  );
};

export const TapeAccent = ({ className = "w-16 h-5" }) => {
  return (
    <div className={`bg-white/40 dark:bg-black/40 border-y border-black/10 backdrop-blur-xs rotate-[-3deg] shadow-xs ${className}`} />
  );
};

export const PawPrint = ({ className = "w-5 h-5 text-primary/40" }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="7" cy="7" rx="2" ry="3" />
      <ellipse cx="12" cy="5" rx="2" ry="3" />
      <ellipse cx="17" cy="7" rx="2" ry="3" />
      <ellipse cx="4" cy="12" rx="1.8" ry="2.5" />
      <path d="M 12 11 Q 6 13 8 19 Q 12 22 16 19 Q 18 13 12 11 Z" />
    </svg>
  );
};

export const SparkleStar = ({ className = "w-4 h-4 text-warning" }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  );
};

export const HandDrawnArrow = ({ className = "w-8 h-8 text-primary" }) => {
  return (
    <svg className={className} viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M 5 20 Q 25 5 45 15" />
      <path d="M 35 10 L 45 15 L 40 25" />
    </svg>
  );
};
