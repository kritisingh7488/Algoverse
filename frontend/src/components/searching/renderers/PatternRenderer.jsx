import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const PatternRenderer = ({ currentArr, currentEvent, target, spec, compact = false }) => {
  const { type, i } = currentEvent;
  const targetPattern = String(target || 45);
  const isKMP = spec?.key === 'kmp';

  return (
    <div className={`w-full font-mono flex flex-col items-center justify-center ${compact ? 'py-1 max-w-full' : 'max-w-3xl py-3 space-y-4'}`}>
      
      {!compact && (
        <div className="bg-surface px-5 py-2.5 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs shadow-xs">
          <span className="font-bold text-textPrimary flex items-center gap-1.5">
            <Search className="w-4 h-4 text-primary" /> {spec?.name || 'Pattern Search'} Engine
          </span>
          <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-accent font-bold">
            {isKMP ? 'LPS Shift Table' : 'Rolling Hash Window'}
          </span>
        </div>
      )}

      {/* Pattern vs Text Dual-Row Window */}
      <div className={`w-full bg-surface ${compact ? 'p-3 rounded-2xl space-y-2' : 'p-5 rounded-3xl space-y-4'} border-2 border-borderTheme shadow-soft`}>
        
        {/* Pattern Row */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-textSecondary font-bold uppercase w-16 shrink-0">PATTERN:</span>
          <span className="px-3 py-1 bg-accent text-white font-bold rounded-xl text-xs shadow-xs">
            "{targetPattern}"
          </span>
        </div>

        {/* Text Sequence Grid */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-textSecondary font-bold uppercase w-16 shrink-0">TEXT:</span>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {currentArr.map((val, idx) => {
              const isMatchWindow = i === idx;
              const isFound = type === 'found' && i === idx;

              let style = 'bg-card border-borderTheme text-textPrimary';
              if (isMatchWindow) style = 'bg-warning text-textPrimary border-warning font-bold scale-105 shadow-md';
              if (isFound) style = 'bg-success text-white border-success font-bold scale-110 shadow-medium';

              return (
                <div key={idx} className="flex flex-col items-center">
                  <motion.div
                    layout
                    className={`${compact ? 'w-8 h-8 text-[10px]' : 'w-10 h-11 text-xs'} rounded-xl border flex items-center justify-center font-bold transition-all ${style}`}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[8px] text-textSecondary mt-0.5 font-bold">[{idx}]</span>
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
