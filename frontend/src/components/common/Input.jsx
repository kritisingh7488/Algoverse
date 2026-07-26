import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  mono = false,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-textSecondary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-textSecondary pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-input bg-surface border-2 border-borderTheme text-sm text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
            Icon ? 'pl-10' : ''
          } ${mono ? 'font-mono' : 'font-body'} ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-body text-danger font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
