import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';

export const TrieRenderer = ({ currentArr, currentEvent, target, compact = false }) => {
  const { type, i } = currentEvent;
  const targetStr = String(target || 45);
  const chars = targetStr.split('');

  return (
    <div className={`w-full font-mono flex flex-col items-center justify-center ${compact ? 'py-1 max-w-full' : 'max-w-3xl py-3 space-y-4'}`}>
      
      {!compact && (
        <div className="bg-surface px-5 py-2.5 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs shadow-xs">
          <span className="font-bold text-textPrimary flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" /> Trie Word Search Prefix Tree:
          </span>
          <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-primary font-bold">
            Target Word: "{targetStr}"
          </span>
        </div>
      )}

      {/* Prefix Tree Nodes Traversal Path */}
      <div className={`flex items-center justify-center gap-2 bg-surface ${compact ? 'p-3 rounded-2xl' : 'p-5 rounded-3xl'} border-2 border-borderTheme overflow-x-auto w-full shadow-soft`}>
        
        {/* Root Node */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`${compact ? 'w-9 h-9 text-[10px]' : 'w-12 h-12 text-xs'} rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-soft`}>
            ROOT
          </div>
          <span className="text-[8px] text-textSecondary font-bold mt-1">L0</span>
        </div>

        {/* Character Nodes */}
        {chars.map((charVal, idx) => {
          const isCharActive = i === idx;
          const isFound = type === 'found' && i === idx;

          let charNodeStyle = 'bg-card border-borderTheme text-textPrimary';
          if (isCharActive) charNodeStyle = 'bg-warning text-textPrimary border-warning font-bold scale-105 shadow-md';
          if (isFound) charNodeStyle = 'bg-success text-white border-success font-bold scale-110 shadow-medium';

          return (
            <React.Fragment key={idx}>
              <ArrowRight className="w-3.5 h-3.5 text-textSecondary opacity-50 shrink-0" />
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  layout
                  className={`${compact ? 'w-9 h-9 text-[11px]' : 'w-12 h-12 text-xs'} rounded-xl border-2 flex items-center justify-center font-bold shadow-soft transition-all ${charNodeStyle}`}
                >
                  '{charVal}'
                </motion.div>
                <span className="text-[8px] text-textSecondary font-bold mt-1">Char [{idx}]</span>
              </div>
            </React.Fragment>
          );
        })}

      </div>

    </div>
  );
};

export default TrieRenderer;
