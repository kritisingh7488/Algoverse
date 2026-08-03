import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe } from 'lucide-react';
import Logo from '../common/Logo';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-borderTheme mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Logo />
            <p className="text-xs text-textSecondary font-body leading-relaxed">
              An Interactive Algorithm Laboratory for Learning, Visualizing, Benchmarking, and Mastering Data Structures.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-surface transition-colors"
                aria-label="GitHub Repository"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-textPrimary font-heading uppercase tracking-wider mb-3">
              Algorithm Labs
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/playground" className="text-textSecondary hover:text-primary transition-colors">Data Structures</Link></li>
              <li><Link to="/labs/sorting" className="text-textSecondary hover:text-primary transition-colors">Sorting Visualizer</Link></li>
              <li><Link to="/labs/searching" className="text-textSecondary hover:text-primary transition-colors">Searching Algorithms</Link></li>
              <li><Link to="/labs/tree" className="text-textSecondary hover:text-primary transition-colors">Trees & Binary Search</Link></li>
              <li><Link to="/labs/graph" className="text-textSecondary hover:text-primary transition-colors">Graph Traversal</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-textPrimary font-heading uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/benchmarks" className="text-textSecondary hover:text-primary transition-colors">Benchmark Center</Link></li>
              <li><Link to="/code-playground" className="text-textSecondary hover:text-primary transition-colors">Code Editor</Link></li>
              <li><Link to="/community" className="text-textSecondary hover:text-primary transition-colors">Community</Link></li>
              <li><Link to="/contests" className="text-textSecondary hover:text-primary transition-colors">Contests</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-textPrimary font-heading uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/roadmap" className="text-textSecondary hover:text-primary transition-colors">Learning Roadmap</Link></li>
              <li><Link to="/labs/dp" className="text-textSecondary hover:text-primary transition-colors">DP Studio</Link></li>
              <li><span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-surface text-textSecondary font-mono border border-borderTheme">v1.0.0</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-borderTheme flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-textSecondary">
          <p>© {new Date().getFullYear()} AlgoVerse. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-accent fill-accent" /> for CS students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
