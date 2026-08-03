import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Target, Sliders, Upload, ToggleLeft, ToggleRight, Search, Activity } from 'lucide-react';

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
  const { desc, type: evType, left, right, mid, found } = currentEvent;

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

          {isFullscreen && (
            <button
              onClick={() => setShowFullControls(!showFullControls)}
              className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all ml-1 shadow-xs text-[11px] font-bold px-3 flex items-center gap-1"
              title={showFullControls ? 'Hide Studio Panel' : 'Show Studio Panel'}
            >
              <span>{showFullControls ? 'Hide Panel' : 'Show Panel'}</span>
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 w-full overflow-hidden flex ${isFullscreen ? 'flex-row' : 'flex-col'} relative`}>
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
        {/* RIGHT-HAND STUDIO SIDE PANEL FOR FULL SCREEN MODE */}
        {isFullscreen && showFullControls && (
          <div className="w-80 lg:w-96 bg-surface/90 border-l border-borderTheme p-4 overflow-y-auto space-y-4 shadow-xl shrink-0 flex flex-col justify-between text-xs">
            <div className="space-y-4">
              {/* Card 1: Dataset Size & Placement Presets */}
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-3">
                <span className="font-heading font-bold text-textPrimary text-xs uppercase block">Dataset Size & Placement</span>
                <div className="flex gap-1">
                  {[10, 20, 50, 100, 250].map((s) => (
                    <button
                      key={s}
                      onClick={() => onGenerateDataset && onGenerateDataset('sorted', s)}
                      className={`flex-1 py-1 rounded-xl font-bold border transition-all ${
                        datasetSize === s ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
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

              {/* Card 2: Special Config Toggles */}
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-3">
                <span className="font-heading font-bold text-textPrimary text-xs uppercase block">Search Config</span>
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

              {/* Card 3: Custom CSV Import */}
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase flex items-center gap-1">
                  <Upload className="w-3 h-3 text-primary" /> Import Custom CSV
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 12, 24, 36, 48"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-surface border border-borderTheme text-xs font-bold text-textPrimary focus:outline-none focus:border-primary"
                  />
                  <Button variant="primary" size="sm" onClick={handleImport}>
                    Import
                  </Button>
                </div>
              </div>
            </div>

            {/* Embedded Playback Bar at bottom of side panel */}
            <div className="pt-3 border-t border-borderTheme">
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
          </div>
        )}
      </div>

      {/* Step Event Description Banner */}
      <div className="w-full flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 my-2 rounded-lg shadow-xs shrink-0">
        <Activity className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span className="text-xs font-mono font-bold text-foreground break-words whitespace-normal flex-1">
          Output: {desc || 'Ready to execute C++ search algorithm.'}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {events && events.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-[10px] border border-primary/30">
              STEP {(stepIndex || 0) + 1} / {events.length}
            </span>
          )}
        </div>
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
