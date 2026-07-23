import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'relative w-full flex justify-center items-center py-2.5 px-4 text-[14px] font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-[#6c4be0] focus-visible:ring-primary shadow-[0_2px_4px_rgba(124,92,252,0.15)] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]',
    outline: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-200 shadow-sm hover:shadow-md',
    google: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-200 shadow-sm hover:shadow transition-all'
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${currentVariant} ${disabled || isLoading ? 'opacity-60 cursor-not-allowed saturate-50' : ''} ${className}`}
    >
      <div className="flex items-center justify-center relative z-10 w-full gap-2">
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span className={`${isLoading ? 'opacity-90' : ''} truncate`}>{children}</span>
      </div>
    </motion.button>
  );
};

export default Button;
