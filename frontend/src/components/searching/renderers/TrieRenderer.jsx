import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TrieRenderer = ({ currentArr, currentEvent, target }) => {
  const { type, i } = currentEvent;
  const targetStr = String(target);

  return (
    <div className="w-full max-w-3xl py-4 space-y-6 font-mono flex flex-col items-center">
      
      {/* Trie Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" /> Trie Word Search Prefix Tree:
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-primary font-bold">
          Target Word: "{targetStr}"
        </span>
      </div>

      {/* Prefix Tree Nodes Traversal Path */}
      <div className="flex items-center gap-3 py-6 bg-surface p-6 rounded-3xl border-2 border-borderTheme overflow-x-auto max-w-full">
        
        {/* Root Node */}
        <div className="flex flex-col items-center">
          <div className="w-13 h-13 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-soft">
            ROOT
          </div>
          <span className="text-[9px] text-textSecondary mt-1">Level 0</span>
        </div>

        {/* Character Nodes */}
        {currentArr.map((val, idx) => {
          const isCharActive = i === idx;
          const isFound = type === 'found' && i === idx;

          let charNodeStyle = 'bg-card border-borderTheme text-textPrimary';
          if (isCharActive) charNodeStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
          if (isFound) charNodeStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

          return (
            <React.Fragment key={idx}>
              <ArrowRight className="w-4 h-4 text-textSecondary opacity-60" />
              <div className="flex flex-col items-center">
                <motion.div
                  layout
                  className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center font-bold text-sm shadow-soft transition-all ${charNodeStyle}`}
                >
                  '{val}'
                </motion.div>
                <span className="text-[9px] text-textSecondary mt-1">Char [{idx}]</span>
              </div>
            </React.Fragment>
          );
        })}

      </div>

    </div>
  );
};

export default TrieRenderer;
