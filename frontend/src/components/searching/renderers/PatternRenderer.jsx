import React from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, RefreshCw } from 'lucide-react';

export const PatternRenderer = ({ currentArr, currentEvent, target, spec }) => {
  const { type, i, j } = currentEvent;
  const targetPattern = String(target || 45);
  const isKMP = spec?.key === 'kmp';

  return (
    <div className="w-full max-w-3xl py-4 space-y-6 font-mono flex flex-col items-center">
      
      {/* Pattern Matching Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <Search className="w-4 h-4 text-primary" /> {spec?.name || 'Pattern Matching Engine'}:
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-accent font-bold">
          {isKMP ? 'LPS Shift Lookup' : 'Rolling Hash Window'}
        </span>
      </div>

      {/* Pattern vs Text Dual-Row Window */}
      <div className="w-full bg-surface p-6 rounded-3xl border-2 border-borderTheme space-y-6">
        
        {/* Pattern Row */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-textSecondary w-20 font-bold uppercase">PATTERN:</span>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-accent text-white font-bold rounded-2xl text-sm shadow-soft">
              "{targetPattern}"
            </div>
          </div>
        </div>

        {/* Text Sequence Grid */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-textSecondary w-20 font-bold uppercase">TEXT ARRAY:</span>
          <div className="flex flex-wrap gap-2">
            {currentArr.map((val, idx) => {
              const isMatchWindow = i === idx;
              const isFound = type === 'found' && i === idx;

              let style = 'bg-card border-borderTheme text-textPrimary';
              if (isMatchWindow) style = 'bg-warning text-textPrimary border-warning scale-110 shadow-md ring-4 ring-warning/30';
              if (isFound) style = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

              return (
                <div key={idx} className="flex flex-col items-center">
                  <motion.div
                    layout
                    className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-xs transition-all ${style}`}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[9px] text-textSecondary mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PatternRenderer;
