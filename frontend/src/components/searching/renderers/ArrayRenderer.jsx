import React from 'react';
import { motion } from 'framer-motion';

export const ArrayRenderer = ({ currentArr, currentEvent, viewMode = 'cells' }) => {
  const { type, i, j, mid } = currentEvent;
  const maxVal = Math.max(...currentArr, 1);

  const isLow = i >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? i : null;
  const isHigh = j >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? j : null;
  const isMid = mid >= 0 && (type === 'mid_calc' || type === 'interpolation_formula' || type === 'recursive_call' || type === 'found') ? mid : null;
  const isDiscarded = (idx) => isLow !== null && isHigh !== null && (idx < isLow || idx > isHigh);

  return (
    <div className="w-full flex justify-center items-center">
      
      {/* 1. ARRAY CELLS */}
      {(viewMode === 'cells' || !viewMode) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl py-4 font-mono">
          {currentArr.map((val, idx) => {
            const low = isLow === idx;
            const high = isHigh === idx;
            const midActive = isMid === idx || i === idx || j === idx;
            const foundActive = type === 'found' && (idx === mid || idx === i);
            const discarded = isDiscarded(idx);

            let cellStyle = 'bg-card text-textPrimary border-borderTheme';
            if (discarded) cellStyle = 'bg-surface text-textSecondary border-borderTheme opacity-30';
            if (midActive) cellStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
            if (foundActive) cellStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

            return (
              <motion.div key={idx} layout className="flex flex-col items-center">
                <div className={`w-13 h-14 rounded-2xl border-2 flex items-center justify-center font-bold text-sm shadow-soft transition-all ${cellStyle}`}>
                  {val}
                </div>
                <span className="text-[9px] text-textSecondary mt-1">[{idx}]</span>
                <div className="flex gap-1 mt-1 text-[9px] font-heading font-bold">
                  {low && <span className="text-primary">L</span>}
                  {midActive && <span className="text-warning">M</span>}
                  {high && <span className="text-secondary">H</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 2. VERTICAL BARS */}
      {viewMode === 'bars_vertical' && (
        <div className="h-56 flex items-end justify-center gap-1.5 w-full max-w-4xl px-2 font-mono">
          {currentArr.map((val, idx) => {
            const heightPercent = Math.max(10, Math.round((val / maxVal) * 100));
            const midActive = isMid === idx || i === idx || j === idx;
            const foundActive = type === 'found' && (idx === mid || idx === i);
            const discarded = isDiscarded(idx);

            let barBg = 'bg-primary';
            if (discarded) barBg = 'bg-surface opacity-30';
            if (midActive) barBg = 'bg-warning scale-105 shadow-md shadow-warning/30';
            if (foundActive) barBg = 'bg-success scale-110 shadow-md shadow-success/40';

            return (
              <motion.div
                key={idx}
                layout
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-xl transition-all duration-150 ${barBg} flex items-center justify-center text-[10px] font-bold text-white shadow-xs`}
              >
                {currentArr.length <= 25 && <span>{val}</span>}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 3. TIMELINE POINTER VIEW */}
      {viewMode === 'timeline' && (
        <div className="w-full max-w-3xl space-y-4 py-6 font-mono">
          <div className="flex items-center justify-between text-xs font-bold text-textSecondary px-2">
            <span>Low: [{isLow ?? 0}]</span>
            <span>Mid: [{isMid ?? '-'}]</span>
            <span>High: [{isHigh ?? currentArr.length - 1}]</span>
          </div>
          <div className="relative w-full h-8 bg-surface rounded-full border-2 border-borderTheme flex items-center px-2">
            <div
              style={{
                left: `${((isLow ?? 0) / currentArr.length) * 100}%`,
                width: `${(((isHigh ?? currentArr.length - 1) - (isLow ?? 0) + 1) / currentArr.length) * 100}%`
              }}
              className="absolute h-full bg-primary/20 rounded-full border-x-2 border-primary transition-all duration-300"
            />
            {isMid !== null && (
              <div
                style={{ left: `${(isMid / currentArr.length) * 100}%` }}
                className="absolute w-4 h-8 bg-warning rounded-full border-2 border-warning shadow-md scale-110"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ArrayRenderer;
