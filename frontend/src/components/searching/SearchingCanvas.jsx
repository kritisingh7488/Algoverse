import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Target } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);

  const currentEvent = events[stepIndex] || {};
  const currentArr = currentEvent.array || array;
  const { desc } = currentEvent;

  // Determine active viewType from Registry: 'array' | 'hashtable' | 'tree' | 'trie' | 'pattern' | 'graph'
  const viewType = spec?.viewType || 'array';

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;
    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={canvasRef}
      className={`bg-card rounded-card border-2 border-borderTheme p-6 shadow-medium flex flex-col justify-between relative transition-all duration-300 font-body ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-8 overflow-auto bg-card' : 'min-h-[440px] overflow-hidden'
      }`}
    >
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'SEARCHING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px] uppercase text-primary font-bold">
            {viewType} RENDERER
          </span>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface border-2 border-borderTheme font-mono text-xs text-textPrimary shadow-xs">
          <Target className="w-4 h-4 text-accent" />
          <span>Target: <strong className="text-primary text-sm">{target}</strong></span>
        </div>

        {/* Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center font-bold">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(1.6, prev + 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all ml-1 shadow-soft flex items-center gap-1 text-[11px] font-bold px-2.5"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Mounting Dedicated Renderer */}
      <div className={`flex-1 overflow-auto py-6 px-2 flex items-center justify-center scrollbar-thin ${isFullscreen ? 'min-h-[70vh]' : 'min-h-[320px]'}`}>
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
        <p className="text-xs sm:text-sm font-mono font-bold text-textPrimary truncate px-4 py-1.5 rounded-2xl bg-surface border border-borderTheme inline-block max-w-full">
          {desc || 'Ready to execute C++ search algorithm.'}
        </p>
      </div>

    </div>
  );
};

export default SearchingCanvas;
