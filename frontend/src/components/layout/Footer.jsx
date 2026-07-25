import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Heart, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center shadow-md shadow-primary/20">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold font-poppins text-gray-900">
                Algo<span className="text-primary">Verse</span>
              </span>
            </div>
            <p className="text-[13px] text-gray-500 font-inter leading-relaxed">
              An Interactive Algorithm Laboratory for Learning, Visualizing, Benchmarking, and Mastering Data Structures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="GitHub Repository"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 font-poppins uppercase tracking-wider mb-4">
              Algorithm Labs
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link to="/playground" className="text-gray-500 hover:text-primary transition-colors">Data Structures</Link></li>
              <li><Link to="/labs/sorting" className="text-gray-500 hover:text-primary transition-colors">Sorting Visualizer</Link></li>
              <li><Link to="/labs/searching" className="text-gray-500 hover:text-primary transition-colors">Searching Algorithms</Link></li>
              <li><Link to="/labs/tree" className="text-gray-500 hover:text-primary transition-colors">Trees & Binary Search</Link></li>
              <li><Link to="/labs/graph" className="text-gray-500 hover:text-primary transition-colors">Graph Traversal</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 font-poppins uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link to="/benchmarks" className="text-gray-500 hover:text-primary transition-colors">Benchmark Center</Link></li>
              <li><Link to="/code-playground" className="text-gray-500 hover:text-primary transition-colors">Code Editor</Link></li>
              <li><Link to="/community" className="text-gray-500 hover:text-primary transition-colors">Community Discussions</Link></li>
              <li><Link to="/contests" className="text-gray-500 hover:text-primary transition-colors">Weekly Contests</Link></li>
            </ul>
          </div>

          {/* Legal / Meta */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 font-poppins uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-mono">v1.0.0</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
          <p>© {new Date().getFullYear()} AlgoVerse. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> for CS students and developers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
