import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Target, Hash, GitBranch, Share2, Layers, Network, ArrowRight } from 'lucide-react';

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

  // Determine active viewType from Registry: 'array' | 'hashtable' | 'tree' | 'trie' | 'pattern' | 'graph'
  const viewType = spec?.viewType || 'array';

  const isLow = i >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? i : null;
  const isHigh = j >= 0 && (type === 'visit' || type === 'mid_calc' || type === 'discard_left' || type === 'discard_right') ? j : null;
  const isMid = mid >= 0 && (type === 'mid_calc' || type === 'interpolation_formula' || type === 'recursive_call' || type === 'found') ? mid : null;
  const isDiscarded = (idx) => isLow !== null && isHigh !== null && (idx < isLow || idx > isHigh);

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative min-h-[400px] overflow-hidden font-body">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>CANVAS: {spec?.name?.toUpperCase() || 'SEARCHING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px] uppercase text-primary font-bold">
            {viewType} VIEW
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
      <div className="flex-1 overflow-auto py-6 px-2 flex items-center justify-center min-h-[280px] scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-center"
        >

          {/* 1. ARRAY RENDERER (Linear, Binary, Jump, Interpolation, Exponential, Fibonacci, Ternary, Meta Binary) */}
          {viewType === 'array' && (
            <>
              {/* Array Cells */}
              {(viewMode === 'cells' || !viewMode) && (
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
                    if (foundActive) cellStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

                    return (
                      <motion.div key={idx} layout className="flex flex-col items-center">
                        <div className={`w-13 h-14 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-soft transition-all ${cellStyle}`}>
                          {val}
                        </div>
                        <span className="text-[9px] font-mono text-textSecondary mt-1">[{idx}]</span>
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

              {/* Vertical Bars */}
              {viewMode === 'bars_vertical' && (
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
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-150 ${barBg} flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-xs`}
                      >
                        {currentArr.length <= 25 && <span>{val}</span>}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* 2. HASH TABLE RENDERER (Hash Table Search, Cuckoo Hash) */}
          {viewType === 'hashtable' && (
            <div className="w-full max-w-3xl space-y-4 py-4">
              <div className="text-center font-mono text-xs text-textSecondary font-bold mb-2">
                Hash Table Bucket Slots (Modulo Mapping $target \pmod B$)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {currentArr.map((val, idx) => {
                  const isBucketProbed = i === idx || j === idx;
                  const isFound = type === 'found' && (i === idx || mid === idx);

                  let bucketStyle = 'bg-surface border-borderTheme text-textPrimary';
                  if (isBucketProbed) bucketStyle = 'bg-secondary text-white border-secondary scale-105 shadow-md ring-4 ring-secondary/30';
                  if (isFound) bucketStyle = 'bg-success text-white border-success scale-110 shadow-medium ring-4 ring-success/40';

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-[10px] font-mono font-bold text-textSecondary mb-1">
                        Slot [{idx}]
                      </div>
                      <div className={`w-full h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all ${bucketStyle}`}>
                        <Hash className="w-3.5 h-3.5 opacity-60 mb-0.5" />
                        <span className="text-xs">{val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. TREE RENDERER (BST, AVL, Red-Black Tree) */}
          {viewType === 'tree' && (
            <div className="w-full max-w-2xl py-4 flex flex-col items-center space-y-6">
              <div className="text-center font-mono text-xs text-textSecondary font-bold">
                Hierarchical Tree Traversal (Root $\rightarrow$ Left / Right)
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {currentArr.map((val, idx) => {
                  const isNodeActive = i === idx || j === idx || mid === idx;
                  const isFound = type === 'found' && (mid === idx || i === idx);

                  let nodeBg = 'bg-card border-borderTheme text-textPrimary';
                  if (isNodeActive) nodeBg = 'bg-warning text-textPrimary border-warning scale-110 shadow-medium ring-4 ring-warning/30';
                  if (type === 'move_left' && mid === idx) nodeBg = 'bg-primary text-white border-primary scale-110';
                  if (type === 'move_right' && mid === idx) nodeBg = 'bg-secondary text-white border-secondary scale-110';
                  if (isFound) nodeBg = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all ${nodeBg}`}>
                        {val}
                      </div>
                      <span className="text-[9px] font-mono text-textSecondary mt-1">Key {val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. TRIE RENDERER (Trie Word Search) */}
          {viewType === 'trie' && (
            <div className="w-full max-w-2xl py-4 flex flex-col items-center space-y-4">
              <div className="text-center font-mono text-xs text-textSecondary font-bold">
                Trie Prefix Tree Character Traversal
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-mono font-bold text-xs shadow-soft">
                  ROOT
                </div>
                <ArrowRight className="w-4 h-4 text-textSecondary" />
                {currentArr.map((val, idx) => {
                  const isCharActive = i === idx;
                  const isFound = type === 'found' && i === idx;

                  let trieBg = 'bg-card border-borderTheme text-textPrimary';
                  if (isCharActive) trieBg = 'bg-warning text-textPrimary border-warning scale-110 ring-4 ring-warning/30';
                  if (isFound) trieBg = 'bg-success text-white border-success scale-115 ring-4 ring-success/40';

                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-xs transition-all ${trieBg}`}>
                        {val}
                      </div>
                      {idx < currentArr.length - 1 && <ArrowRight className="w-4 h-4 text-textSecondary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. PATTERN RENDERER (KMP, Rabin-Karp) */}
          {viewType === 'pattern' && (
            <div className="w-full max-w-2xl py-4 space-y-4 font-mono">
              <div className="text-center text-xs text-textSecondary font-bold">
                Pattern vs Text Window Matching Engine
              </div>
              <div className="bg-surface p-4 rounded-2xl border-2 border-borderTheme space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-textSecondary w-16 font-bold">PATTERN:</span>
                  <span className="px-3 py-1 bg-accent text-white font-bold rounded-xl text-sm">{target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-textSecondary w-16 font-bold">TEXT:</span>
                  <div className="flex gap-1.5">
                    {currentArr.map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-9 h-10 rounded-xl border flex items-center justify-center font-bold text-xs ${
                          i === idx ? 'bg-warning text-textPrimary border-warning scale-110' : 'bg-card border-borderTheme text-textPrimary'
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. GRAPH RENDERER (BFS, DFS) */}
          {viewType === 'graph' && (
            <div className="w-full max-w-3xl py-4 flex flex-col items-center space-y-6">
              <div className="text-center font-mono text-xs text-textSecondary font-bold">
                Graph Network Node Traversal & Active {spec?.key === 'bfs' ? 'Queue' : 'Stack'} Container
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {currentArr.map((val, idx) => {
                  const isVisited = i === idx || j === idx;
                  const isFound = type === 'found' && i === idx;

                  let graphStyle = 'bg-card border-borderTheme text-textPrimary';
                  if (type === 'queue_push' || type === 'stack_push') {
                    if (i === idx) graphStyle = 'bg-info text-white border-info scale-110 shadow-md';
                  }
                  if (type === 'queue_pop' || type === 'stack_pop') {
                    if (i === idx) graphStyle = 'bg-warning text-textPrimary border-warning scale-110 shadow-md';
                  }
                  if (isFound) graphStyle = 'bg-success text-white border-success scale-115 shadow-medium ring-4 ring-success/40';

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-xs transition-all ${graphStyle}`}>
                        {val}
                      </div>
                      <span className="text-[9px] font-mono text-textSecondary mt-1">V[{idx}]</span>
                    </div>
                  );
                })}
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
