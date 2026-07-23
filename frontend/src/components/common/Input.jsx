import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <label 
          htmlFor={id} 
          className={`block text-[13px] font-medium transition-colors duration-200 ${
            error ? 'text-danger' : isFocused ? 'text-primary' : 'text-gray-700'
          }`}
        >
          {label} {required && <span className="text-danger ml-0.5">*</span>}
        </label>
        {error && (
          <span className="text-[12px] text-danger font-medium animate-[slideUp_0.2s_ease-out]">
            {error}
          </span>
        )}
      </div>
      
      <div className="relative group">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`appearance-none block w-full px-3.5 py-2.5 bg-white border ${
            error 
              ? 'border-danger/60 focus:ring-[3px] focus:ring-danger/10 focus:border-danger' 
              : 'border-gray-200 focus:ring-[3px] focus:ring-primary/10 focus:border-primary hover:border-gray-300'
          } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none transition-all duration-200 text-[14px] text-gray-900`}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
