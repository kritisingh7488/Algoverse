import React from 'react';
import { motion } from 'framer-motion';
import { Hash, ArrowDown } from 'lucide-react';

export const HashRenderer = ({ currentArr, currentEvent, target, compact = false }) => {
  const { type, i, j, mid } = currentEvent;
  const numBuckets = compact ? 5 : 7;
  const targetVal = target || 45;
  const targetBucket = targetVal % numBuckets;

  // Group elements into Hash Table Bucket slots
  const bucketMap = {};
  for (let b = 0; b < numBuckets; b++) bucketMap[b] = [];
  currentArr.forEach((val) => {
    const b = val % numBuckets;
    if (bucketMap[b]) bucketMap[b].push(val);
  });

  return (
    <div className={`w-full font-mono flex flex-col items-center justify-center ${compact ? 'py-1 max-w-full' : 'max-w-4xl py-3 space-y-4'}`}>
      
      {/* Header */}
      {!compact && (
        <div className="bg-surface px-5 py-2.5 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-xl text-xs shadow-xs">
          <span className="font-bold text-textPrimary flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-primary" /> Modulo Hash Function:
          </span>
          <span className="font-bold text-primary font-mono text-sm">
            h(x) = x % {numBuckets}
          </span>
          <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-accent font-bold">
            Target Bucket: [{targetBucket}]
          </span>
        </div>
      )}

      {/* Hash Bucket Slots Table & Collision Chains */}
      <div className={`grid ${compact ? 'grid-cols-5 gap-1.5 w-full' : 'grid-cols-7 gap-3 w-full'}`}>
        {Array.from({ length: numBuckets }, (_, bucketIdx) => {
          const isTargetBucket = targetBucket === bucketIdx;
          const isProbed = i === bucketIdx || j === bucketIdx || mid === bucketIdx;
          const isFound = type === 'found' && (i === bucketIdx || mid === bucketIdx || isTargetBucket);

          let bucketCardStyle = 'bg-surface border-borderTheme text-textPrimary';
          if (isTargetBucket) bucketCardStyle = 'bg-primary/10 border-primary text-primary font-bold';
          if (isProbed) bucketCardStyle = 'bg-warning/20 border-warning text-textPrimary scale-105 shadow-md ring-2 ring-warning/30';
          if (isFound) bucketCardStyle = 'bg-success/20 border-success text-success scale-110 shadow-medium ring-2 ring-success/40';

          const chainItems = bucketMap[bucketIdx] || [];

          return (
            <div key={bucketIdx} className="flex flex-col items-center space-y-1">
              
              {/* Bucket Header Box */}
              <div className={`w-full ${compact ? 'py-1 px-1 rounded-xl border text-[9px]' : 'py-2 px-1 rounded-2xl border-2 text-xs'} flex flex-col items-center justify-center transition-all ${bucketCardStyle}`}>
                <span className="font-bold opacity-75 truncate">[{bucketIdx}]</span>
                <span className="font-bold text-[9px] text-textSecondary">{chainItems.length} Keys</span>
              </div>

              {/* Collision Chain Nodes */}
              <div className="flex flex-col items-center space-y-1 w-full">
                {chainItems.map((keyVal, itemIdx) => {
                  const isItemActive = isProbed && keyVal === targetVal;
                  const isItemFound = type === 'found' && keyVal === targetVal;

                  let itemStyle = 'bg-card border-borderTheme text-textPrimary';
                  if (isItemActive) itemStyle = 'bg-warning text-textPrimary border-warning font-bold scale-105';
                  if (isItemFound) itemStyle = 'bg-success text-white border-success font-bold scale-110 shadow-sm';

                  return (
                    <React.Fragment key={itemIdx}>
                      <ArrowDown className="w-2.5 h-2.5 text-textSecondary opacity-40" />
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`w-full ${compact ? 'py-0.5 text-[9px] rounded-lg' : 'py-1.5 text-xs rounded-xl'} border text-center font-bold transition-all shadow-xs ${itemStyle}`}
                      >
                        {keyVal}
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default HashRenderer;
