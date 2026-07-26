import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Target, GitCommit, Layers, Database, Share2, Network } from 'lucide-react';

export const SearchingCanvas = ({
  array,
  events,
  stepIndex,
  target,
  viewMode = 'cells',
  spec
}) => {
  const [zoom, setZoom] = useState(1);

  const currentEvent = events[stepIndex] || {};
  const { type, i, j, mid, desc } = currentEvent;
  const currentArr = currentEvent.array || array;

  const maxVal = Math.max(...currentArr, 1);

  const isLow = i >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? i : null;
  const isHigh = j >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? j : null;
  const isMid = mid >= 0 && (type === 'mid_calc' || type === 'interpolation_formula' || type === 'recursive_call' || type === 'found') ? mid : null;
  const isDiscarded = (idx) => isLow !== null && isHigh !== null && (idx < isLow || idx > isHigh);

  // Auto-adapt visualizer mode if spec suggests specialized view
  const activeView = spec?.defaultViewMode || viewMode;

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative min-h-[380px] overflow-hidden font-body">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>CANVAS: {spec?.name?.toUpperCase() || 'SEARCHING VISUALIZER'}</span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {spec?.category?.toUpperCase()}
          </span>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border-2 border-borderTheme font-mono text-xs text-textPrimary">
          <Target className="w-3.5 h-3.5 text-accent" />
          <span>Target: <strong className="text-primary">{target}</strong></span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 overflow-auto py-6 px-2 flex items-center justify-center min-h-[260px] scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-end"
        >

          {/* 1. ARRAY CELLS MODE */}
          {activeView === 'cells' && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl py-4">
              {currentArr.map((val, idx) => {
                const low = isLow === idx;
                const high = isHigh === idx;
                const midActive = isMid === idx || i === idx || j === idx;
                const foundActive = type === 'found' && (idx === mid || idx === i);
                const discarded = isDiscarded(idx);

                let cellStyle = 'bg-card text-textPrimary border-borderTheme';
                if (discarded) cellStyle = 'bg-surface text-textSecondary border-borderTheme opacity-30';
                if (midActive) cellStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
                if (type === 'hash_bucket' && idx === i) cellStyle = 'bg-secondary text-white border-secondary scale-110 shadow-md';
                if (type === 'queue_push' && idx === i) cellStyle = 'bg-info text-white border-info scale-110 shadow-md';
                if (type === 'queue_pop' && idx === i) cellStyle = 'bg-accent text-white border-accent scale-110 shadow-md';
                if (type === 'stack_push' && idx === i) cellStyle = 'bg-primary text-white border-primary scale-110 shadow-md';
                if (foundActive) cellStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-13 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-soft transition-all ${cellStyle}`}>
                      {val}
                    </div>
                    <span className="text-[9px] font-mono text-textSecondary mt-1">[{idx}]</span>
                    
                    {/* Pointer Tags */}
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

          {/* 2. VERTICAL BARS MODE */}
          {activeView === 'bars_vertical' && (
            <div className="h-56 flex items-end justify-center gap-1.5 w-full max-w-4xl px-2">
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
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-150 ${barBg} flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs`}
                  >
                    {currentArr.length <= 25 && <span>{val}</span>}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 3. HORIZONTAL BARS MODE */}
          {activeView === 'bars_horizontal' && (
            <div className="w-full max-w-3xl space-y-2 py-4">
              {currentArr.map((val, idx) => {
                const widthPercent = Math.max(10, Math.round((val / maxVal) * 100));
                const midActive = isMid === idx || i === idx || j === idx;
                const foundActive = type === 'found' && (idx === mid || idx === i);
                const discarded = isDiscarded(idx);

                let barBg = 'bg-primary';
                if (discarded) barBg = 'bg-surface opacity-30';
                if (midActive) barBg = 'bg-warning shadow-md';
                if (foundActive) barBg = 'bg-success shadow-md';

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-textSecondary w-8">[{idx}]</span>
                    <div className="flex-1 bg-surface rounded-r-xl overflow-hidden h-6 border border-borderTheme">
                      <div
                        style={{ width: `${widthPercent}%` }}
                        className={`h-full ${barBg} flex items-center justify-end px-2 text-xs font-mono font-bold text-white transition-all`}
                      >
                        {val}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. TIMELINE POINTER VIEW */}
          {activeView === 'timeline' && (
            <div className="w-full max-w-3xl space-y-4 py-6">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-textSecondary px-2">
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
      </div>

      {/* Step Event Message */}
      <div className="pt-3 border-t-2 border-borderTheme text-center">
        <p className="text-xs font-mono font-bold text-textPrimary truncate">
          {desc || 'Ready to execute C++ search algorithm.'}
        </p>
      </div>

    </div>
  );
};

export default SearchingCanvas;
