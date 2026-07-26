import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Code2, 
  Compass, 
  BarChart3, 
  Trophy, 
  ChevronDown 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Playground', path: '/playground', icon: Code2 },
    { name: 'Benchmarks', path: '/benchmarks', icon: BarChart3 },
    { name: 'Contests', path: '/contests', icon: Trophy },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-card/90 border-b-2 border-borderTheme shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-surface focus:outline-none transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-textPrimary">
                Algo<span className="text-primary">Verse</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-2xl text-[14px] font-heading font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? 'text-primary font-bold' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 border border-primary/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, Search, Notifications & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Theme Switcher Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-surface focus:outline-none transition-colors border border-borderTheme"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline-block text-[14px] font-heading font-bold text-textPrimary max-w-[120px] truncate">
                      {user?.fullName || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-textSecondary" />
                  </button>

                  {/* Profile Menu Popover */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-large border-2 border-borderTheme py-2 z-50 overflow-hidden font-body"
                      >
                        <div className="px-4 py-3 border-b border-borderTheme">
                          <p className="text-[14px] font-heading font-bold text-textPrimary truncate">{user?.fullName}</p>
                          <p className="text-[12px] text-textSecondary truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[14px] text-textPrimary hover:bg-surface transition-colors"
                          >
                            <User className="w-4 h-4 text-textSecondary" />
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[14px] text-textPrimary hover:bg-surface transition-colors"
                          >
                            <Settings className="w-4 h-4 text-textSecondary" />
                            Settings
                          </Link>
                        </div>
                        <div className="pt-1 border-t border-borderTheme">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-[14px] text-danger hover:bg-danger/10 transition-colors text-left font-bold"
                          >
                            <LogOut className="w-4 h-4 text-danger" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-[14px] font-heading font-bold text-textPrimary hover:bg-surface transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-2xl text-[14px] font-heading font-bold text-white bg-primary hover:bg-primary-hover shadow-soft transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
