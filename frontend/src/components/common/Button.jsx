import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  icon: Icon = null,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-soft shadow-primary/20',
    secondary: 'bg-secondary hover:bg-secondary-hover text-white shadow-soft shadow-secondary/20',
    accent: 'bg-accent hover:bg-accent/90 text-textPrimary shadow-soft',
    outline: 'bg-card border-2 border-borderTheme text-textPrimary hover:border-primary hover:bg-surface shadow-xs',
    ghost: 'bg-transparent text-textPrimary hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-soft',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
