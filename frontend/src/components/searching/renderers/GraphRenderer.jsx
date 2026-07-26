import React from 'react';
import { motion } from 'framer-motion';
import { Network, Layers, ArrowRight, CornerDownRight } from 'lucide-react';

export const GraphRenderer = ({ currentArr, currentEvent, spec }) => {
  const { type, i, j } = currentEvent;
  const isBFS = spec?.key === 'bfs';

  return (
    <div className="w-full max-w-4xl py-3 space-y-6 font-mono flex flex-col items-center">
      
      {/* Graph Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs shadow-xs">
        <span className="font-bold text-textPrimary flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" /> {spec?.name || 'Graph Search Engine'} Topology
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-primary font-bold">
          Container: {isBFS ? 'FIFO Queue' : 'LIFO Stack'}
        </span>
      </div>

      {/* Graph Vertices Network Layout */}
      <div className="w-full bg-surface p-6 rounded-3xl border-2 border-borderTheme space-y-6 flex flex-col items-center shadow-soft">
        
        <div className="text-xs font-bold text-textSecondary uppercase tracking-wider">
          Graph Vertices (V = 0 ... N-1)
        </div>

        <div className="flex flex-wrap justify-center gap-4 py-2">
          {currentArr.map((val, idx) => {
            const isVisited = i === idx || j === idx;
            const isFound = type === 'found' && i === idx;
            const isPush = (type === 'queue_push' || type === 'stack_push') && i === idx;
            const isPop = (type === 'queue_pop' || type === 'stack_pop') && i === idx;

            let nodeStyle = 'bg-card border-borderTheme text-textPrimary';
            if (isPush) nodeStyle = 'bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-4 ring-sky-300/60 font-black';
            if (isPop) nodeStyle = 'bg-amber-400 text-slate-950 border-amber-500 scale-110 shadow-lg ring-4 ring-amber-300/60 font-black';
            if (isFound) nodeStyle = 'bg-emerald-500 text-white border-emerald-600 scale-115 shadow-xl ring-4 ring-emerald-300/60 font-black animate-bounce';

            return (
              <div key={idx} className="flex flex-col items-center">
                <motion.div
                  layout
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold text-sm transition-all shadow-soft ${nodeStyle}`}
                >
                  {val}
                </motion.div>
                <span className="text-[9px] text-textSecondary mt-1 font-bold">Vertex [{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Active Queue / Stack Data Structure Container Visualizer */}
        <div className="w-full pt-4 border-t-2 border-borderTheme flex flex-col sm:flex-row items-center justify-between gap-3 px-4 text-xs bg-card p-4 rounded-2xl border">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-secondary" />
            <span className="font-bold text-textPrimary">{isBFS ? 'BFS Queue Operations:' : 'DFS Call Stack Operations:'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-textSecondary font-bold">Event Type:</span>
            <span className="px-3 py-1 bg-surface rounded-xl border border-borderTheme font-bold text-primary text-xs uppercase">
              {type || 'idle'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default GraphRenderer;
