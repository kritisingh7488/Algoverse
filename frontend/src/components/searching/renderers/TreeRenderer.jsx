import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

export const TreeRenderer = ({ currentArr, currentEvent, spec }) => {
  const { type, i, j, mid, value } = currentEvent;
  const isRedBlack = spec?.key === 'redblack';

  // Build binary search tree structure recursively from array elements
  const sorted = [...currentArr].sort((a, b) => a - b);
  
  const buildTree = (arr, depth = 0) => {
    if (arr.length === 0) return null;
    const m = Math.floor(arr.length / 2);
    return {
      val: arr[m],
      depth,
      isRed: isRedBlack ? depth % 2 === 1 : false,
      left: buildTree(arr.slice(0, m), depth + 1),
      right: buildTree(arr.slice(m + 1), depth + 1)
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
        ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
        : 'bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-slate-700';
    }

    if (isCurrentNode) nodeStyle = 'bg-amber-400 text-slate-950 border-amber-500 scale-110 shadow-lg ring-4 ring-amber-300/60 font-black';
    if (type === 'move_left' && isCurrentNode) nodeStyle = 'bg-blue-600 text-white border-blue-700 scale-110 shadow-lg ring-4 ring-blue-300/60 font-black';
    if (type === 'move_right' && isCurrentNode) nodeStyle = 'bg-purple-600 text-white border-purple-700 scale-110 shadow-lg ring-4 ring-purple-300/60 font-black';
    if (isFound) nodeStyle = 'bg-emerald-500 text-white border-emerald-600 scale-115 shadow-xl ring-4 ring-emerald-300/60 font-black animate-bounce';

    return (
      <div className="flex flex-col items-center relative">
        
        {/* Node Circle */}
        <motion.div
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold text-xs transition-all shadow-medium shrink-0 z-10 ${nodeStyle}`}
        >
          <span>{nodeVal}</span>
          {isRedBlack && (
            <span className="text-[8px] opacity-80 uppercase tracking-tighter">
              {node.isRed ? 'RED' : 'BLK'}
            </span>
          )}
        </motion.div>

        {/* Children Subtrees with SVG Connector Lines */}
        {(node.left || node.right) && (
          <div className="relative pt-8 mt-2 flex justify-center gap-8 sm:gap-16 w-full">
            
            {/* High Contrast SVG Connecting Lines */}
            <svg className="absolute top-0 left-0 w-full h-8 pointer-events-none stroke-borderTheme stroke-[2.5px] opacity-70">
              {node.left && <line x1="50%" y1="0" x2="25%" y2="100%" strokeDasharray="4 4" />}
              {node.right && <line x1="50%" y1="0" x2="75%" y2="100%" strokeDasharray="4 4" />}
            </svg>

            {/* Left Child */}
            <div className="flex flex-col items-center">
              {node.left ? (
                <RenderTreeNode node={node.left} />
              ) : (
                <span className="text-[9px] font-mono text-textSecondary italic opacity-40 font-bold bg-surface px-2 py-0.5 rounded-full border border-borderTheme">
                  nil
                </span>
              )}
            </div>

            {/* Right Child */}
            <div className="flex flex-col items-center">
              {node.right ? (
                <RenderTreeNode node={node.right} />
              ) : (
                <span className="text-[9px] font-mono text-textSecondary italic opacity-40 font-bold bg-surface px-2 py-0.5 rounded-full border border-borderTheme">
                  nil
                </span>
              )}
            </div>

          </div>
        )}

      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl py-3 font-mono flex flex-col items-center overflow-x-auto scrollbar-thin px-4">
      
      {/* Tree Architecture Summary Badge */}
      <div className="bg-surface px-5 py-2.5 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-lg text-xs mb-4 shadow-xs">
        <span className="font-bold text-textPrimary flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" /> {spec?.name || 'Binary Tree'} Topology
        </span>
        <div className="flex items-center gap-2">
          {isRedBlack && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/30 text-[10px] font-bold">
              Red-Black Properties
            </span>
          )}
          <span className="px-3 py-0.5 rounded-xl bg-card border border-borderTheme text-primary font-bold text-[10px]">
            {sorted.length} Total Nodes
          </span>
        </div>
      </div>

      {/* Multi-Level Hierarchical Tree Layout */}
      <div className="w-full flex justify-center py-4 min-w-max">
        {rootNode && <RenderTreeNode node={rootNode} />}
      </div>

    </div>
  );
};

export default TreeRenderer;
