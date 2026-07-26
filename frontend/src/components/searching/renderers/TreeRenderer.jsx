import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

export const TreeRenderer = ({ currentArr, currentEvent, spec }) => {
  const { type, i, j, mid, value } = currentEvent;
  const isRedBlack = spec?.key === 'redblack';

  // Build binary search tree structure recursively from array elements
  const sorted = [...currentArr].sort((a, b) => a - b);
  
  const buildTree = (arr, depth = 0, isRed = false) => {
    if (arr.length === 0) return null;
    const m = Math.floor(arr.length / 2);
    return {
      val: arr[m],
      depth,
      isRed: isRedBlack ? depth % 2 === 1 : false,
      left: buildTree(arr.slice(0, m), depth + 1, !isRed),
      right: buildTree(arr.slice(m + 1), depth + 1, !isRed)
    };
  };

  const rootNode = buildTree(sorted);

  // Recursive Tree Node Component
  const RenderTreeNode = ({ node }) => {
    if (!node) return null;

    const nodeVal = node.val;
    const isCurrentNode = value === nodeVal || mid === nodeVal || i === nodeVal || j === nodeVal;
    const isFound = type === 'found' && (value === nodeVal || mid === nodeVal);

    let nodeStyle = 'bg-card border-borderTheme text-textPrimary';
    if (isRedBlack) {
      nodeStyle = node.isRed
        ? 'bg-danger text-white border-danger shadow-soft'
        : 'bg-gray-900 text-white border-black shadow-soft';
    }

    if (isCurrentNode) nodeStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
    if (type === 'move_left' && isCurrentNode) nodeStyle = 'bg-primary text-white border-primary scale-110 shadow-md';
    if (type === 'move_right' && isCurrentNode) nodeStyle = 'bg-secondary text-white border-secondary scale-110 shadow-md';
    if (isFound) nodeStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

    return (
      <div className="flex flex-col items-center relative">
        
        {/* Node Circle */}
        <motion.div
          layout
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shadow-soft shrink-0 z-10 ${nodeStyle}`}
        >
          {nodeVal}
        </motion.div>

        {/* Children Subtrees with Connector Lines */}
        {(node.left || node.right) && (
          <div className="relative pt-6 mt-1 flex justify-center gap-6 sm:gap-12 w-full">
            
            {/* SVG Connecting Branch Lines */}
            <svg className="absolute top-0 left-0 w-full h-6 pointer-events-none stroke-borderTheme stroke-2">
              {node.left && <line x1="50%" y1="0" x2="25%" y2="100%" strokeDasharray="3 3" />}
              {node.right && <line x1="50%" y1="0" x2="75%" y2="100%" strokeDasharray="3 3" />}
            </svg>

            {/* Left Child */}
            <div className="flex flex-col items-center">
              {node.left ? (
                <RenderTreeNode node={node.left} />
              ) : (
                <span className="text-[8px] text-textSecondary italic opacity-40 font-mono">null</span>
              )}
            </div>

            {/* Right Child */}
            <div className="flex flex-col items-center">
              {node.right ? (
                <RenderTreeNode node={node.right} />
              ) : (
                <span className="text-[8px] text-textSecondary italic opacity-40 font-mono">null</span>
              )}
            </div>

          </div>
        )}

      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl py-2 font-mono flex flex-col items-center overflow-x-auto scrollbar-thin px-2">
      
      {/* Tree Header Badge */}
      <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-md text-xs mb-4">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-primary" /> {spec?.name || 'Binary Tree'} Layout
        </span>
        <span className="px-2.5 py-0.5 rounded-xl bg-card border border-borderTheme text-primary font-bold text-[10px]">
          {sorted.length} Nodes
        </span>
      </div>

      {/* Recursive Multi-Level Tree View */}
      <div className="w-full flex justify-center py-2 min-w-max">
        {rootNode && <RenderTreeNode node={rootNode} />}
      </div>

    </div>
  );
};

export default TreeRenderer;
