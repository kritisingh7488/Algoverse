import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Target } from 'lucide-react';

import { ArrayRenderer } from './renderers/ArrayRenderer';
import { HashRenderer } from './renderers/HashRenderer';
import { TreeRenderer } from './renderers/TreeRenderer';
import { TrieRenderer } from './renderers/TrieRenderer';
import { PatternRenderer } from './renderers/PatternRenderer';
import { GraphRenderer } from './renderers/GraphRenderer';

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
  const currentArr = currentEvent.array || array;
  const { desc } = currentEvent;

  // Determine active viewType from Registry: 'array' | 'hashtable' | 'tree' | 'trie' | 'pattern' | 'graph'
  const viewType = spec?.viewType || 'array';

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative min-h-[420px] overflow-hidden font-body">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>CANVAS: {spec?.name?.toUpperCase() || 'SEARCHING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px] uppercase text-primary font-bold">
            {viewType} RENDERER
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

      {/* Main Viewport Mounting the Correct Dedicated Renderer */}
      <div className="flex-1 overflow-auto py-6 px-2 flex items-center justify-center min-h-[300px] scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-center"
        >

          {/* 1. ARRAY RENDERER */}
          {viewType === 'array' && (
            <ArrayRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              viewMode={viewMode}
            />
          )}

          {/* 2. HASH TABLE RENDERER */}
          {viewType === 'hashtable' && (
            <HashRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              target={target}
            />
          )}

          {/* 3. TREE RENDERER */}
          {viewType === 'tree' && (
            <TreeRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              spec={spec}
            />
          )}

          {/* 4. TRIE RENDERER */}
          {viewType === 'trie' && (
            <TrieRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              target={target}
            />
          )}

          {/* 5. PATTERN RENDERER */}
          {viewType === 'pattern' && (
            <PatternRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              target={target}
              spec={spec}
            />
          )}

          {/* 6. GRAPH RENDERER */}
          {viewType === 'graph' && (
            <GraphRenderer
              currentArr={currentArr}
              currentEvent={currentEvent}
              spec={spec}
            />
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
