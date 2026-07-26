import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BlueCat } from './BlueCat';
import { BlackCat } from './BlackCat';
import { OrangeCat } from './OrangeCat';
import { WhiteCat } from './WhiteCat';

export const MascotRole = ({ role = 'teacher', activity = 'reading', dialogue = null, className = 'w-20 h-20' }) => {
  const { theme } = useTheme();

  if (role === 'teacher') {
    if (theme === 'dark') {
      return <OrangeCat className={className} activity={activity} dialogue={dialogue} />;
    }
    return <BlueCat className={className} activity={activity} dialogue={dialogue} />;
  }

  // Companion role
  if (theme === 'dark') {
    return <WhiteCat className={className} activity={activity} dialogue={dialogue} />;
  }
  return <BlackCat className={className} activity={activity} dialogue={dialogue} />;
};

export default MascotRole;
