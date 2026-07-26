import React from 'react';

export const StickyNote = ({ children, color = "yellow", className = "", rotate = "-1deg" }) => {
  const bgStyles = {
    yellow: "bg-[#FEF9C3] dark:bg-[#3B331A] text-[#713F12] dark:text-[#FEF08A] border-[#FDE047] dark:border-[#854D0E]",
    pink: "bg-[#FCE7F3] dark:bg-[#3B1C2B] text-[#831843] dark:text-[#FBCFE8] border-[#F472B6] dark:border-[#9D174D]",
    blue: "bg-[#E0F2FE] dark:bg-[#1E293B] text-[#075985] dark:text-[#BAE6FD] border-[#38BDF8] dark:border-[#0284C7]",
    green: "bg-[#DCFCE7] dark:bg-[#143820] text-[#14532D] dark:text-[#BBF7D0] border-[#4ADE80] dark:border-[#15803D]"
  };

  return (
    <div
      style={{ transform: `rotate(${rotate})` }}
      className={`p-4 rounded-2xl border-2 shadow-soft font-body relative transition-transform hover:rotate-0 duration-200 ${bgStyles[color] || bgStyles.yellow} ${className}`}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 dark:bg-black/30 backdrop-blur-xs border-b border-black/10 rotate-1 shadow-xs" />
      {children}
    </div>
  );
};

export default StickyNote;
