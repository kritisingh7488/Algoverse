import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeftRight, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export const DsCanvas = ({
  structureKey,
  items,
  activeHighlight,
  pointers = {},
  spec
}) => {
  const [zoom, setZoom] = useState(1);

  const isHeap = structureKey === 'minheap' || structureKey === 'maxheap' || structureKey === 'priorityqueue';

  // Binary Heap Tree coordinate generator
  const getHeapNodeCoords = (index, total) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelPos = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    
    // Calculate SVG coordinates
    const width = 600;
    const x = (width / (nodesInLevel + 1)) * (levelPos + 1);
    const y = 40 + level * 65;
    return { x, y };
  };

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative min-h-[380px] overflow-hidden">
      
      {/* Canvas Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>CANVAS: {spec.name.toUpperCase()}</span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {items.length} ITEMS
          </span>
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

      {/* Canvas Node Viewport Container */}
      <div className="flex-1 overflow-auto py-8 px-4 flex items-center justify-center min-h-[260px] relative scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center"
        >

          {/* 1. HEAP / PRIORITY QUEUE TREE VISUALIZATION */}
          {isHeap && items.length > 0 && (
            <div className="flex flex-col items-center gap-6 w-full">
              {/* SVG Tree Connectors */}
              <div className="relative w-[600px] h-[220px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {items.map((_, i) => {
                    if (i === 0) return null;
                    const parentIdx = Math.floor((i - 1) / 2);
                    const parentCoords = getHeapNodeCoords(parentIdx, items.length);
                    const childCoords = getHeapNodeCoords(i, items.length);
                    return (
                      <line
                        key={`line-${i}`}
                        x1={parentCoords.x}
                        y1={parentCoords.y}
                        x2={childCoords.x}
                        y2={childCoords.y}
                        stroke="var(--color-border)"
                        strokeWidth="3"
                        strokeDasharray={activeHighlight === i ? "4 4" : "none"}
                      />
                    );
                  })}
                </svg>

                {/* Tree Nodes */}
                {items.map((val, idx) => {
                  const coords = getHeapNodeCoords(idx, items.length);
                  const isHighlighted = activeHighlight === idx;
                  const isRoot = idx === 0;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      style={{ left: `${coords.x - 24}px`, top: `${coords.y - 24}px` }}
                      className={`absolute w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xs shadow-soft border-2 transition-all ${
                        isHighlighted
                          ? 'bg-accent text-textPrimary border-accent scale-110 shadow-medium ring-4 ring-accent/30'
                          : isRoot
                          ? 'bg-primary text-white border-primary/40'
                          : 'bg-surface text-textPrimary border-borderTheme'
                      }`}
                    >
                      <span>{val}</span>
                      <span className="text-[9px] opacity-70">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Array Representation Bar Below Tree */}
              <div className="flex items-center gap-1 bg-surface p-3 rounded-2xl border-2 border-borderTheme overflow-x-auto">
                <span className="text-[10px] font-heading font-bold text-textSecondary uppercase mr-2">Flat Array:</span>
                {items.map((val, idx) => (
                  <div
                    key={`flat-${idx}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                      activeHighlight === idx ? 'bg-accent text-textPrimary border-accent' : 'bg-card border-borderTheme text-textPrimary'
                    }`}
                  >
                    <span className="text-[9px] opacity-60 mr-1">[{idx}]</span>
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. STACK VERTICAL / HORIZONTAL CONTAINER */}
          {structureKey === 'stack' && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-48 min-h-[220px] max-h-[280px] overflow-y-auto border-x-4 border-b-4 border-primary/40 rounded-b-3xl bg-surface p-3 flex flex-col-reverse items-center gap-2 shadow-inner">
                <AnimatePresence>
                  {items.map((val, idx) => {
                    const isTop = idx === items.length - 1;
                    const isHighlighted = activeHighlight === idx;

                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        className={`w-full py-2.5 rounded-2xl border-2 font-mono font-bold text-sm flex items-center justify-between px-4 shadow-soft ${
                          isHighlighted
                            ? 'bg-accent text-textPrimary border-accent ring-4 ring-accent/30'
                            : isTop
                            ? 'bg-primary text-white border-primary'
                            : 'bg-card text-textPrimary border-borderTheme'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-60">[{idx}]</span>
                          <span>{val}</span>
                        </div>
                        {isTop && (
                          <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                            TOP ↑
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              <span className="text-xs font-heading font-bold text-textSecondary mt-2">STACK BOTTOM</span>
            </div>
          )}

          {/* 3. LINKED LISTS (SINGLY, DOUBLY, CIRCULAR) */}
          {(structureKey === 'singlylist' || structureKey === 'doublylist' || structureKey === 'circularlist') && (
            <div className="flex items-center gap-3 overflow-x-auto py-4 px-2">
              <AnimatePresence>
                {items.map((val, idx) => {
                  const isHead = idx === 0;
                  const isTail = idx === items.length - 1;
                  const isHighlighted = activeHighlight === idx;
                  const isSlow = pointers.slow === idx;
                  const isFast = pointers.fast === idx;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center"
                    >
                      <div className="flex flex-col items-center">
                        {/* Pointer Badges */}
                        <div className="flex gap-1 mb-1.5 h-5">
                          {isHead && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">HEAD</span>}
                          {isTail && !isHead && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30">TAIL</span>}
                          {isSlow && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">SLOW</span>}
                          {isFast && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-accent/30 text-textPrimary border border-accent/40">FAST</span>}
                        </div>

                        {/* Node Card */}
                        <div className={`px-4 py-3 rounded-2xl border-2 font-mono font-bold text-sm flex items-center gap-3 shadow-soft transition-all ${
                          isHighlighted
                            ? 'bg-accent text-textPrimary border-accent scale-110 shadow-medium ring-4 ring-accent/30'
                            : 'bg-card text-textPrimary border-borderTheme'
                        }`}>
                          <span>{val}</span>
                          <span className="text-[10px] font-mono border-l-2 border-borderTheme pl-2 text-textSecondary">
                            {structureKey === 'doublylist' ? '← ptr →' : 'next →'}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-textSecondary mt-1">[{idx}]</span>
                      </div>

                      {/* Connection Pointer Arrow */}
                      {idx < items.length - 1 && (
                        <div className="flex items-center text-primary mx-2">
                          {structureKey === 'doublylist' ? (
                            <ArrowLeftRight className="w-5 h-5" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )}
                        </div>
                      )}

                      {/* Tail Pointer Connection */}
                      {idx === items.length - 1 && (
                        <div className="flex items-center ml-2">
                          {structureKey === 'circularlist' ? (
                            <span className="text-[11px] font-heading font-bold text-primary px-2 py-1 bg-primary/10 rounded-xl border border-primary/30 flex items-center gap-1">
                              <RotateCcw className="w-3 h-3" /> ↺ HEAD
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-textSecondary font-bold">→ NULL</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* 4. DYNAMIC ARRAY, QUEUE, CIRCULAR QUEUE, DEQUE */}
          {(structureKey === 'array' || structureKey === 'queue' || structureKey === 'cqueue' || structureKey === 'deque') && (
            <div className="flex items-center gap-3 overflow-x-auto py-4 px-2">
              <AnimatePresence>
                {items.map((val, idx) => {
                  const isFront = (structureKey === 'queue' || structureKey === 'deque' || structureKey === 'cqueue') && idx === 0;
                  const isRear = (structureKey === 'queue' || structureKey === 'deque' || structureKey === 'cqueue') && idx === items.length - 1;
                  const isHighlighted = activeHighlight === idx;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      {/* Pointers */}
                      <div className="flex gap-1 mb-1.5 h-5">
                        {isFront && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">FRONT</span>}
                        {isRear && !isFront && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-warning/30 text-textPrimary border border-warning/40">REAR</span>}
                      </div>

                      {/* Memory Cell */}
                      <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm shadow-soft transition-all ${
                        isHighlighted
                          ? 'bg-accent text-textPrimary border-accent scale-110 shadow-medium ring-4 ring-accent/30'
                          : 'bg-card text-textPrimary border-borderTheme'
                      }`}>
                        <span>{val}</span>
                      </div>

                      {/* Index & Hex Address Label */}
                      <div className="flex flex-col items-center mt-1">
                        <span className="text-[10px] font-mono font-bold text-textPrimary">[{idx}]</span>
                        <span className="text-[8px] font-mono text-textSecondary">0x{(1000 + idx * 4).toString(16).toUpperCase()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-heading font-bold text-textSecondary">Structure is currently empty</p>
              <p className="text-xs font-body text-textSecondary">Use the action panel below to insert elements or load presets.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default DsCanvas;
