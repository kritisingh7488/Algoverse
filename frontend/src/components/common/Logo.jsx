import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Logo = ({ className = '', showText = true }) => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Link to={isAuthenticated ? '/dashboard' : '/'} className={`flex items-center gap-2.5 group ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-primary/15 border-[1.5px] border-primary/30 flex items-center justify-center group-hover:scale-105 group-hover:border-primary transition-all duration-200">
        <span className="text-sm font-bold font-mono text-primary select-none">&lt;/&gt;</span>
      </div>
      {showText && (
        <span className="text-lg font-bold font-heading tracking-tight text-textPrimary">
          Algo<span className="text-primary">Verse</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
