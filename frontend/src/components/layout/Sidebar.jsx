import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Layers, 
  ArrowUpDown, 
  Search, 
  GitFork, 
  Network, 
  Cpu, 
  Award, 
  Code, 
  Users, 
  ChevronRight,
  BookOpen,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Learning Roadmap', path: '/roadmap', icon: BookOpen },
      ]
    },
    {
      title: 'Algorithm Labs',
      items: [
        { name: 'Data Structures', path: '/playground', icon: Layers },
        { name: 'Sorting Lab', path: '/labs/sorting', icon: ArrowUpDown },
        { name: 'Searching Lab', path: '/labs/searching', icon: Search },
        { name: 'Tree Lab', path: '/labs/tree', icon: GitFork },
        { name: 'Graph Lab', path: '/labs/graph', icon: Network },
        { name: 'DP Studio', path: '/labs/dp', icon: Cpu },
      ]
    },
    {
      title: 'Practice & Compare',
      items: [
        { name: 'Benchmark Center', path: '/benchmarks', icon: Award },
        { name: 'Code Playground', path: '/code-playground', icon: Code },
        { name: 'Community & Quizzes', path: '/community', icon: Users },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Collapsible Navigation Sidebar */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 bg-card/90 backdrop-blur-xl border-r-[1.5px] border-borderTheme transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'w-16' : 'w-56'
        } flex flex-col overflow-y-auto overflow-x-hidden shadow-soft`}
      >
        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-end px-2.5 py-2.5 border-b border-borderTheme">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-surface hover:bg-card border border-borderTheme text-textSecondary hover:text-textPrimary transition-all shadow-xs"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="px-2.5 py-3 space-y-4 flex-1">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <h3 className="px-2.5 text-[10px] font-heading font-bold uppercase tracking-wider text-textSecondary mb-1.5 truncate">
                  {group.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      title={isCollapsed ? item.name : ''}
                      className={({ isActive }) =>
                        `relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-2.5'} py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-200 group ${
                          isActive
                            ? 'text-primary font-bold bg-primary/15 border border-primary/20 shadow-xs'
                            : 'text-textSecondary hover:text-textPrimary hover:bg-surface'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0 transition-colors" />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </div>
                      {!isCollapsed && location.pathname === item.path && (
                        <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
