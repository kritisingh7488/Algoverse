import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  type = 'button',
  icon: Icon = null,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-soft shadow-primary/20',
    secondary: 'bg-secondary hover:bg-secondary-hover text-white shadow-soft shadow-secondary/20',
    accent: 'bg-accent hover:bg-accent/90 text-textPrimary shadow-soft',
    outline: 'bg-card border-2 border-borderTheme text-textPrimary hover:border-primary hover:bg-surface shadow-xs',
    ghost: 'bg-transparent text-textPrimary hover:bg-surface',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-soft',
    google: 'bg-card border-2 border-borderTheme text-textPrimary hover:border-primary hover:bg-surface shadow-xs',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { y: -2 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
