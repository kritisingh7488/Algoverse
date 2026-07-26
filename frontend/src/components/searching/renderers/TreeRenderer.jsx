import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ArrowLeft, ArrowRight } from 'lucide-react';

export const TreeRenderer = ({ currentArr, currentEvent, spec }) => {
  const { type, i, j, mid } = currentEvent;

  // Build binary tree structure from array elements
  const sorted = [...currentArr].sort((a, b) => a - b);
  
  const buildTree = (arr, depth = 0) => {
    if (arr.length === 0) return null;
    const m = Math.floor(arr.length / 2);
    return {
      val: arr[m],
      depth,
      left: buildTree(arr.slice(0, m), depth + 1),
      right: buildTree(arr.slice(m + 1), depth + 1)
    };
  };

  const root = buildTree(sorted);

  return (
    <div className="w-full max-w-3xl py-4 space-y-6 font-mono flex flex-col items-center">
      
      {/* Tree Architecture Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-primary" /> {spec?.name || 'Binary Search Tree'} Topology:
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-primary font-bold">
          Height: {Math.ceil(Math.log2(sorted.length + 1))} Levels
        </span>
      </div>

      {/* Hierarchical Tree Nodes Rendering */}
      <div className="flex flex-col items-center space-y-6 w-full py-4">
        
        {/* Level 0: Root */}
        {root && (
          <div className="flex flex-col items-center space-y-4 w-full">
            
            {/* Root Node */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-textSecondary uppercase">ROOT</span>
              <TreeNode nodeVal={root.val} currentEvent={currentEvent} />
            </div>

            {/* Subtree Branches */}
            <div className="grid grid-cols-2 gap-12 w-full max-w-lg border-t-2 border-dashed border-borderTheme pt-4">
              
              {/* Left Subtree */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> LEFT (val &lt; root)
                </span>
                {root.left ? (
                  <TreeNode nodeVal={root.left.val} currentEvent={currentEvent} />
                ) : (
                  <span className="text-[10px] text-textSecondary italic">null</span>
                )}
              </div>

              {/* Right Subtree */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
                  RIGHT (val &gt; root) <ArrowRight className="w-3 h-3" />
                </span>
                {root.right ? (
                  <TreeNode nodeVal={root.right.val} currentEvent={currentEvent} />
                ) : (
                  <span className="text-[10px] text-textSecondary italic">null</span>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

const TreeNode = ({ nodeVal, currentEvent }) => {
  const { type, i, j, mid, value } = currentEvent;
  const isCurrentNode = value === nodeVal || mid === nodeVal;
  const isFound = type === 'found' && (value === nodeVal || mid === nodeVal);

  let style = 'bg-card border-borderTheme text-textPrimary';
  if (isCurrentNode) style = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
  if (type === 'move_left' && isCurrentNode) style = 'bg-primary text-white border-primary scale-110 shadow-md';
  if (type === 'move_right' && isCurrentNode) style = 'bg-secondary text-white border-secondary scale-110 shadow-md';
  if (isFound) style = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

  return (
    <motion.div
      layout
      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-soft ${style}`}
    >
      {nodeVal}
    </motion.div>
  );
};

export default TreeRenderer;
