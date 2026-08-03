import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  Code2, 
  Compass, 
  BarChart3, 
  Trophy, 
  ChevronDown 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-card/90 border-b-[1.5px] border-borderTheme shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Brand & Sidebar Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface focus:outline-none transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Logo />
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-1.5 rounded-xl text-sm font-heading font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10 border border-primary/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Theme Toggle & Profile */}
          <div className="flex items-center gap-2">
            
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface focus:outline-none transition-colors border border-borderTheme"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline-block text-sm font-heading font-bold text-textPrimary max-w-[100px] truncate">
                      {user?.fullName || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                  </button>

                  {/* Profile Menu Popover */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className="absolute right-0 mt-1.5 w-52 bg-card rounded-xl shadow-large border-[1.5px] border-borderTheme py-1.5 z-50 overflow-hidden font-body"
                      >
                        <div className="px-3 py-2.5 border-b border-borderTheme">
                          <p className="text-sm font-heading font-bold text-textPrimary truncate">{user?.fullName}</p>
                          <p className="text-xs text-textSecondary truncate">{user?.email}</p>
                        </div>
                        <div className="py-0.5">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-textPrimary hover:bg-surface transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-textSecondary" />
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-textPrimary hover:bg-surface transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5 text-textSecondary" />
                            Settings
                          </Link>
                        </div>
                        <div className="pt-0.5 border-t border-borderTheme">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors text-left font-bold"
                          >
                            <LogOut className="w-3.5 h-3.5 text-danger" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-sm font-heading font-bold text-textPrimary hover:bg-surface transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 rounded-xl text-sm font-heading font-bold text-white bg-primary hover:bg-primary-hover shadow-soft transition-all"
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
