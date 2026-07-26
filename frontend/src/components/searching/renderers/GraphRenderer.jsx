import React from 'react';
import { motion } from 'framer-motion';
import { Network, Layers } from 'lucide-react';

export const GraphRenderer = ({ currentArr, currentEvent, spec }) => {
  const { type, i, j } = currentEvent;
  const isBFS = spec?.key === 'bfs';

  return (
    <div className="w-full max-w-4xl py-4 space-y-6 font-mono flex flex-col items-center">
      
      {/* Graph Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <Network className="w-4 h-4 text-primary" /> {spec?.name || 'Graph Search Engine'}:
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-primary font-bold">
          Active Container: {isBFS ? 'FIFO Queue' : 'LIFO Stack'}
        </span>
      </div>

      {/* Graph Vertices Network Layout */}
      <div className="w-full bg-surface p-6 rounded-3xl border-2 border-borderTheme space-y-6 flex flex-col items-center">
        
        <div className="text-xs font-bold text-textSecondary uppercase">
          Graph Network Node Vertices (V = 0 ... N-1)
        </div>

        <div className="flex flex-wrap justify-center gap-4 py-2">
          {currentArr.map((val, idx) => {
            const isVisited = i === idx || j === idx;
            const isFound = type === 'found' && i === idx;
            const isPush = (type === 'queue_push' || type === 'stack_push') && i === idx;
            const isPop = (type === 'queue_pop' || type === 'stack_pop') && i === idx;

            let nodeStyle = 'bg-card border-borderTheme text-textPrimary';
            if (isPush) nodeStyle = 'bg-info text-white border-info scale-110 shadow-md ring-4 ring-info/30';
            if (isPop) nodeStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-md ring-4 ring-warning/30';
            if (isFound) nodeStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

            return (
              <div key={idx} className="flex flex-col items-center">
                <motion.div
                  layout
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold text-sm transition-all shadow-soft ${nodeStyle}`}
                >
                  {val}
                </motion.div>
                <span className="text-[9px] text-textSecondary mt-1">Vertex [{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Active Queue / Stack Container Indicator */}
        <div className="w-full pt-4 border-t-2 border-borderTheme flex items-center justify-between px-4 text-xs">
          <span className="font-bold text-textSecondary flex items-center gap-2">
            <Layers className="w-4 h-4 text-secondary" /> {isBFS ? 'BFS Queue State:' : 'DFS Call Stack State:'}
          </span>
          <span className="px-3 py-1 bg-card rounded-xl border border-borderTheme font-bold text-textPrimary">
            Operation: <strong className="text-primary">{type}</strong> (Target node index [{i >= 0 ? i : '-'}])
          </span>
        </div>

      </div>

    </div>
  );
};

export default GraphRenderer;
