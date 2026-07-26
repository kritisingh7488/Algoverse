import React from 'react';
import { motion } from 'framer-motion';
import { Hash, ArrowDown } from 'lucide-react';

export const HashRenderer = ({ currentArr, currentEvent, target }) => {
  const { type, i, j, mid } = currentEvent;
  const numBuckets = 7;
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
    <div className="w-full max-w-4xl py-4 space-y-6 font-mono flex flex-col items-center">
      
      {/* Modulo Calculation Display Header */}
      <div className="bg-surface px-5 py-3 rounded-2xl border-2 border-borderTheme flex items-center justify-between w-full max-w-2xl text-xs">
        <span className="font-bold text-textSecondary flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-primary" /> Modulo Hash Function:
        </span>
        <span className="font-bold text-primary font-mono text-sm">
          h(x) = x % {numBuckets}
        </span>
        <span className="px-3 py-1 rounded-xl bg-card border border-borderTheme text-accent font-bold">
          Target Bucket: Slot [{targetBucket}]
        </span>
      </div>

      {/* Hash Bucket Slots Table & Collision Chains */}
      <div className="grid grid-cols-7 gap-3 w-full">
        {Array.from({ length: numBuckets }, (_, bucketIdx) => {
          const isTargetBucket = targetBucket === bucketIdx;
          const isProbed = i === bucketIdx || j === bucketIdx || mid === bucketIdx;
          const isFound = type === 'found' && (i === bucketIdx || mid === bucketIdx || isTargetBucket);

          let bucketCardStyle = 'bg-surface border-borderTheme text-textPrimary';
          if (isTargetBucket) bucketCardStyle = 'bg-primary/10 border-primary text-primary';
          if (isProbed) bucketCardStyle = 'bg-warning/20 border-warning text-textPrimary scale-105 shadow-md ring-4 ring-warning/30';
          if (isFound) bucketCardStyle = 'bg-success/20 border-success text-success scale-110 shadow-medium ring-4 ring-success/40';

          const chainItems = bucketMap[bucketIdx] || [];

          return (
            <div key={bucketIdx} className="flex flex-col items-center space-y-2">
              
              {/* Bucket Header Box */}
              <div className={`w-full py-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${bucketCardStyle}`}>
                <span className="text-[10px] font-bold opacity-70">BUCKET [{bucketIdx}]</span>
                <span className="text-xs font-bold mt-0.5">{chainItems.length} Key(s)</span>
              </div>

              {/* Collision Chain Nodes */}
              <div className="flex flex-col items-center space-y-1.5 w-full">
                {chainItems.map((keyVal, itemIdx) => {
                  const isItemActive = isProbed && keyVal === targetVal;
                  const isItemFound = type === 'found' && keyVal === targetVal;

                  let itemStyle = 'bg-card border-borderTheme text-textPrimary';
                  if (isItemActive) itemStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-md';
                  if (isItemFound) itemStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

                  return (
                    <React.Fragment key={itemIdx}>
                      <ArrowDown className="w-3 h-3 text-textSecondary opacity-50" />
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`w-full py-2 rounded-xl border-2 text-center text-xs font-bold transition-all shadow-xs ${itemStyle}`}
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
