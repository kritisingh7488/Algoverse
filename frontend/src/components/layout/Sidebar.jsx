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
  BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Roadmap', path: '/roadmap', icon: BookOpen },
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
        { name: 'Community & Contests', path: '/community', icon: Users },
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
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white/70 backdrop-blur-xl border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto shadow-[2px_0_15px_rgba(0,0,0,0.01)]`}
      >
        <div className="px-4 py-6 space-y-8">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[11px] font-bold font-poppins uppercase tracking-wider text-gray-400 mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                          isActive
                            ? 'text-primary font-semibold bg-primary/10'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Promo/Status Banner inside Sidebar */}
        <div className="p-4 border-t border-gray-100/80">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-transparent border border-primary/10 text-center">
            <p className="text-[13px] font-semibold text-gray-900 font-poppins">Master Algorithms</p>
            <p className="text-[12px] text-gray-500 mt-1 font-inter">Interactive visual step-by-step engine</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
