import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, BarChart2 } from 'lucide-react';

export const SortingCanvas = ({
  array,
  events,
  stepIndex,
  viewMode = 'bars_vertical', // 'bars_vertical' | 'bars_horizontal' | 'cells' | 'heatmap'
  spec
}) => {
  const [zoom, setZoom] = useState(1);

  const currentEvent = events[stepIndex] || {};
  const { type, i, j, value, desc } = currentEvent;
  const currentArr = currentEvent.array || array;

  const maxVal = Math.max(...currentArr, 1);
  const minVal = Math.min(...currentArr, 0);

  const isComparing = (idx) => (type === 'compare' || type === 'split') && (idx === i || idx === j);
  const isSwapping = (idx) => (type === 'swap' || type === 'overwrite' || type === 'merge' || type === 'heap_swap') && (idx === i || idx === j);
  const isPivot = (idx) => (type === 'pivot_select' || type === 'partition') && idx === i;

  // Heatmap color generator
  const getHeatmapColor = (val) => {
    const norm = (val - minVal) / Math.max(1, maxVal - minVal);
    const hue = (1 - norm) * 240; // Blue (cool) to Red (hot)
    return `hsl(${hue}, 85%, 55%)`;
  };

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative min-h-[380px] overflow-hidden font-body">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>CANVAS: {spec?.name?.toUpperCase() || 'SORTING VISUALIZER'}</span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {currentArr.length} ELEMENTS
          </span>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-info" /> Compare</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Swap/Write</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Pivot</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Sorted</span>
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

      {/* Main Visualization Viewport */}
      <div className="flex-1 overflow-auto py-6 px-2 flex items-center justify-center min-h-[260px] scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-end"
        >

          {/* 1. VERTICAL BARS MODE */}
          {viewMode === 'bars_vertical' && (
            <div className="h-56 flex items-end justify-center gap-1.5 w-full max-w-4xl px-2">
              {currentArr.map((val, idx) => {
                const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);
                const pivot = isPivot(idx);

                let barBg = 'bg-primary';
                if (comparing) barBg = 'bg-info shadow-md shadow-info/30 scale-105';
                if (swapping) barBg = 'bg-accent shadow-md shadow-accent/30 scale-105';
                if (pivot) barBg = 'bg-warning shadow-md shadow-warning/30 scale-105';

                return (
                  <motion.div
                    key={idx}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-150 ${barBg} flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs group relative`}
                  >
                    {currentArr.length <= 30 && <span className="opacity-90">{val}</span>}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 2. HORIZONTAL BARS MODE */}
          {viewMode === 'bars_horizontal' && (
            <div className="w-full max-w-2xl space-y-1.5 px-4 max-h-[240px] overflow-y-auto">
              {currentArr.map((val, idx) => {
                const widthPercent = Math.max(10, Math.round((val / maxVal) * 100));
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);
                const pivot = isPivot(idx);

                let barBg = 'bg-primary';
                if (comparing) barBg = 'bg-info';
                if (swapping) barBg = 'bg-accent';
                if (pivot) barBg = 'bg-warning';

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono w-6 text-textSecondary text-right">[{idx}]</span>
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-6 rounded-xl ${barBg} text-white font-mono font-bold text-xs flex items-center px-3 justify-between shadow-xs`}
                    >
                      <span>{val}</span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. ARRAY CELLS MODE */}
          {viewMode === 'cells' && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl py-4">
              {currentArr.map((val, idx) => {
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);
                const pivot = isPivot(idx);

                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-soft transition-all ${
                      swapping
                        ? 'bg-accent text-textPrimary border-accent scale-110 shadow-medium ring-4 ring-accent/30'
                        : comparing
                        ? 'bg-info text-white border-info scale-105'
                        : pivot
                        ? 'bg-warning text-textPrimary border-warning scale-105'
                        : 'bg-card text-textPrimary border-borderTheme'
                    }`}>
                      {val}
                    </div>
                    <span className="text-[9px] font-mono text-textSecondary mt-1">[{idx}]</span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 4. HEATMAP MODE */}
          {viewMode === 'heatmap' && (
            <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl py-4">
              {currentArr.map((val, idx) => {
                const color = getHeatmapColor(val);
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);

                return (
                  <motion.div
                    key={idx}
                    layout
                    style={{ backgroundColor: color }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs transition-all ${
                      swapping ? 'scale-125 ring-4 ring-accent z-10' : comparing ? 'scale-110 ring-2 ring-white z-10' : ''
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Step Event Description Bar */}
      <div className="pt-3 border-t-2 border-borderTheme text-center">
        <p className="text-xs font-mono font-bold text-textPrimary truncate">
          {desc || 'Ready to execute C++ sorting algorithm.'}
        </p>
      </div>

    </div>
  );
};

export default SortingCanvas;
