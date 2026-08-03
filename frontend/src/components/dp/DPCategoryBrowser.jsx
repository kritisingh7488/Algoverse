import React from 'react';
import Card from '../common/Card';
import { ChevronRight, Folder, Hash, Grid, Type, Briefcase, List, SplitSquareVertical, Network, Map, Binary } from 'lucide-react';

const categoryIcons = {
  "1d-dp": Hash,
  "2d-dp": Grid,
  "string-dp": Type,
  "knapsack-dp": Briefcase,
  "lis-family": List,
  "interval-dp": SplitSquareVertical,
  "tree-dp": Network,
  "graph-dp": Map,
  "bitmask-dp": Binary
};

const DPCategoryBrowser = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <Card className="p-4 space-y-4 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="space-y-1">
        <h3 className="text-sm font-heading font-bold text-textSecondary uppercase tracking-wider px-2">
          DP Categories
        </h3>
        <p className="text-xs text-textSecondary px-2">
          Select a category to view problems.
        </p>
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || Folder;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm' 
                  : 'hover:bg-surface border border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-primary text-white' : 'bg-surface text-textSecondary'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className={`block text-sm font-heading font-bold ${isActive ? 'text-primary' : 'text-textPrimary'}`}>
                    {category.name}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {category.problems.length} problems
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default DPCategoryBrowser;
