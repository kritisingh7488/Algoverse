import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Target, Sliders, Upload, ToggleLeft, ToggleRight, Search } from 'lucide-react';

import { ArrayRenderer } from './renderers/ArrayRenderer';
import { HashRenderer } from './renderers/HashRenderer';
import { TreeRenderer } from './renderers/TreeRenderer';
import { TrieRenderer } from './renderers/TrieRenderer';
import { PatternRenderer } from './renderers/PatternRenderer';
import { GraphRenderer } from './renderers/GraphRenderer';
import { SearchingPlaybackBar } from './SearchingPlaybackBar';
import Button from '../common/Button';

export const SearchingCanvas = ({
  array,
  events,
  stepIndex,
  target,
  setTarget,
  datasetSize,
  setDatasetSize,
  onGenerateDataset,
  autoSort,
  setAutoSort,
  showMid,
  setShowMid,
  onImportCSV,
  algoKey,
  setAlgoKey,
  algorithms = {},
  viewMode = 'cells',
  spec,
  isPlaying,
  setIsPlaying,
  onStepChange,
  speed,
  setSpeed,
  onRestart
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullControls, setShowFullControls] = useState(true);
  const [csvInput, setCsvInput] = useState('');
  const canvasRef = useRef(null);

  const currentEvent = events[stepIndex] || {};
  const { desc } = currentEvent;

  // Determine active viewType: 'array' | 'hashtable' | 'tree' | 'trie' | 'pattern' | 'graph'
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

  const handleImport = () => {
    if (!csvInput.trim() || !onImportCSV) return;
    const values = csvInput
      .split(',')
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x));
    if (values.length > 0) {
      onImportCSV(values);
      setCsvInput('');
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`bg-card rounded-card border-2 border-borderTheme p-5 shadow-medium flex flex-col justify-between relative transition-all duration-300 font-body ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-6 bg-card flex flex-col justify-between h-screen w-screen overflow-hidden' : 'min-h-[460px] overflow-hidden'
      }`}
    >
      
      {/* Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'SEARCHING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px] uppercase text-primary font-bold">
            {viewType} RENDERER
          </span>
        </div>

        {/* Target Badge & Input */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border-2 border-borderTheme font-mono text-xs text-textPrimary shadow-xs">
          <Target className="w-4 h-4 text-accent" />
          <span>Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget && setTarget(parseInt(e.target.value) || 0)}
            className="w-14 bg-card border border-borderTheme rounded-lg px-2 py-0.5 font-bold focus:outline-none focus:border-primary text-primary"
          />
        </div>

        {/* Algorithm Quick Selector (in Fullscreen or normal mode) */}
        {isFullscreen && setAlgoKey && algorithms && (
          <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-2xl border border-borderTheme">
            <Search className="w-3.5 h-3.5 text-primary" />
            <select
              value={algoKey}
              onChange={(e) => setAlgoKey(e.target.value)}
              className="bg-transparent font-heading font-bold text-xs text-textPrimary focus:outline-none cursor-pointer"
            >
              {Object.keys(algorithms).map((k) => (
                <option key={k} value={k} className="bg-card text-textPrimary">
                  {algorithms[k].name} ({algorithms[k].viewType})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center font-bold">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(1.8, prev + 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all ml-1 shadow-soft flex items-center gap-1 text-[11px] font-bold px-3"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      {/* FULL SCREEN CONTROL PANEL OVERLAY (DATASET FILTERS, PRESETS, CONFIG, CSV) */}
      {isFullscreen && (
        <div className="bg-surface p-3 rounded-2xl border-2 border-borderTheme my-2 shadow-soft space-y-3 shrink-0 text-xs font-mono">
          
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-textPrimary uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Full Screen Interactive Dataset Filters & Config
            </span>
            <button
              onClick={() => setShowFullControls(!showFullControls)}
              className="text-[10px] font-bold text-primary px-2 py-0.5 bg-card rounded-lg border border-borderTheme"
            >
              {showFullControls ? 'Hide Controls' : 'Show Controls'}
            </button>
          </div>

          {showFullControls && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-borderTheme">
              
              {/* 1. Dataset Size & Placement Presets */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Dataset Size & Placement Presets</span>
                <div className="flex gap-1">
                  {[10, 20, 50, 100, 250].map((s) => (
                    <button
                      key={s}
                      onClick={() => onGenerateDataset && onGenerateDataset('sorted', s)}
                      className={`flex-1 py-1 rounded-xl font-bold border transition-all ${
                        datasetSize === s ? 'bg-primary text-white border-primary' : 'bg-card text-textPrimary border-borderTheme'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('target_start')}>
                    Target at Start
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('target_mid')}>
                    Target at Mid
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('target_end')}>
                    Target at End
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('missing')}>
                    Missing Target
                  </Button>
                </div>
              </div>

              {/* 2. Special Config Toggles */}
              <div className="space-y-2 border-x border-borderTheme px-3">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Special Search Config</span>
                <div className="flex items-center justify-between text-xs text-textPrimary">
                  <span>Auto-Sort Before Search</span>
                  <button onClick={() => setAutoSort && setAutoSort(!autoSort)} className="text-primary">
                    {autoSort ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-textSecondary" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-textPrimary">
                  <span>Show Mid Calculation</span>
                  <button onClick={() => setShowMid && setShowMid(!showMid)} className="text-primary">
                    {showMid ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-textSecondary" />}
                  </button>
                </div>
              </div>

              {/* 3. Import Custom CSV */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase flex items-center gap-1">
                  <Upload className="w-3 h-3 text-primary" /> Import Custom CSV
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 12, 24, 36, 48"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-card border border-borderTheme text-xs font-bold text-textPrimary focus:outline-none focus:border-primary"
                  />
                  <Button variant="primary" size="sm" onClick={handleImport}>
                    Import
                  </Button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Main Viewport Mounting Dedicated Renderer */}
      <div className="flex-1 overflow-auto py-4 px-2 flex items-center justify-center scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-center"
        >

          {/* 1. ARRAY RENDERER */}
          {viewType === 'array' && (
            <ArrayRenderer
              currentArr={array}
              currentEvent={currentEvent}
              viewMode={viewMode}
            />
          )}

          {/* 2. HASH TABLE RENDERER */}
          {viewType === 'hashtable' && (
            <HashRenderer
              currentArr={array}
              currentEvent={currentEvent}
              target={target}
            />
          )}

          {/* 3. TREE RENDERER */}
          {viewType === 'tree' && (
            <TreeRenderer
              currentArr={array}
              currentEvent={currentEvent}
              spec={spec}
            />
          )}

          {/* 4. TRIE RENDERER */}
          {viewType === 'trie' && (
            <TrieRenderer
              currentArr={array}
              currentEvent={currentEvent}
              target={target}
            />
          )}

          {/* 5. PATTERN RENDERER */}
          {viewType === 'pattern' && (
            <PatternRenderer
              currentArr={array}
              currentEvent={currentEvent}
              target={target}
              spec={spec}
            />
          )}

          {/* 6. GRAPH RENDERER */}
          {viewType === 'graph' && (
            <GraphRenderer
              currentArr={array}
              currentEvent={currentEvent}
              spec={spec}
            />
          )}

        </div>
      </div>

      {/* Step Event Description Banner */}
      <div className="py-2 border-t-2 border-borderTheme text-center shrink-0">
        <p className="text-xs sm:text-sm font-mono font-bold text-textPrimary truncate px-4 py-1.5 rounded-2xl bg-surface border border-borderTheme inline-block max-w-full">
          {desc || 'Ready to execute C++ search algorithm.'}
        </p>
      </div>

      {/* EMBEDDED PLAYBACK BAR WHEN IN FULL SCREEN MODE */}
      {isFullscreen && (
        <div className="pt-3 border-t-2 border-borderTheme shrink-0">
          <SearchingPlaybackBar
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            stepIndex={stepIndex}
            totalSteps={events.length}
            onStepChange={onStepChange}
            speed={speed}
            setSpeed={setSpeed}
            onRestart={onRestart}
          />
        </div>
      )}

    </div>
  );
};

export default SearchingCanvas;
