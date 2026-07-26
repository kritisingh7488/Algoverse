import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, onClick, accent = false, ...props }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, shadow: 'var(--shadow-medium)' } : {}}
      className={`notebook-card p-6 ${accent ? 'bg-cardAccent' : 'bg-card'} ${
        hover ? 'cursor-pointer hover:border-primary' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
