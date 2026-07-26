import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, BarChart2, Sliders, Upload, Search } from 'lucide-react';
import { SortingPlaybackBar } from './SortingPlaybackBar';
import Button from '../common/Button';

export const SortingCanvas = ({
  array,
  events,
  stepIndex,
  datasetSize,
  setDatasetSize,
  onGenerateDataset,
  pivotStrategy,
  setPivotStrategy,
  onImportCSV,
  algoKey,
  setAlgoKey,
  algorithms = {},
  viewMode = 'bars_vertical', // 'bars_vertical' | 'bars_horizontal' | 'cells' | 'heatmap' | 'scatter'
  setViewMode,
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
  const { type, i, j, desc } = currentEvent;
  const currentArr = currentEvent.array || array;

  const maxVal = Math.max(...currentArr, 1);
  const minVal = Math.min(...currentArr, 0);

  const isComparing = (idx) => (type === 'compare' || type === 'split') && (idx === i || idx === j);
  const isSwapping = (idx) => (type === 'swap' || type === 'overwrite' || type === 'merge' || type === 'heap_swap') && (idx === i || idx === j);
  const isPivot = (idx) => (type === 'pivot_select' || type === 'partition') && idx === i;

  const getHeatmapColor = (val) => {
    const norm = (val - minVal) / Math.max(1, maxVal - minVal);
    const hue = (1 - norm) * 240;
    return `hsl(${hue}, 85%, 55%)`;
  };

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
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-6 bg-card flex flex-col justify-between h-screen w-screen overflow-hidden' : 'min-h-[440px] overflow-hidden'
      }`}
    >
      
      {/* Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'SORTING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {currentArr.length} ELEMENTS
          </span>
        </div>

        {/* Algorithm Quick Selector (in Fullscreen) */}
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
                  {algorithms[k].name} ({algorithms[k].avg})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-info" /> Compare</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Swap/Write</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Pivot</span>
        </div>

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

      {/* FULL SCREEN INTERACTIVE CONTROLS OVERLAY */}
      {isFullscreen && (
        <div className="bg-surface p-3 rounded-2xl border-2 border-borderTheme my-2 shadow-soft space-y-3 shrink-0 text-xs font-mono">
          
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-textPrimary uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Full Screen Sorting Controls & View Modes
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
              
              {/* 1. View Mode & Size */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Visualizer View Mode</span>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {[
                    { key: 'bars_vertical', label: 'Vertical' },
                    { key: 'bars_horizontal', label: 'Horizontal' },
                    { key: 'cells', label: 'Cells' },
                    { key: 'heatmap', label: 'Heatmap' },
                    { key: 'scatter', label: 'Scatter' }
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setViewMode && setViewMode(m.key)}
                      className={`py-1 rounded-xl font-bold border transition-all ${
                        viewMode === m.key ? 'bg-primary text-white border-primary' : 'bg-card text-textPrimary border-borderTheme'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Dataset Size & Input Pattern Filters */}
              <div className="space-y-2 border-x border-borderTheme px-3">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Dataset Size & Input Pattern</span>
                <div className="flex gap-1">
                  {[10, 20, 50, 100, 250].map((s) => (
                    <button
                      key={s}
                      onClick={() => onGenerateDataset && onGenerateDataset('random', s)}
                      className={`flex-1 py-1 rounded-xl font-bold border transition-all ${
                        datasetSize === s ? 'bg-primary text-white border-primary' : 'bg-card text-textPrimary border-borderTheme'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('random')}>Random</Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('reverse')}>Reverse</Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('nearly')}>Nearly</Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset && onGenerateDataset('duplicates')}>Duplicates</Button>
                </div>
              </div>

              {/* 3. CSV Import */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase flex items-center gap-1">
                  <Upload className="w-3 h-3 text-primary" /> Custom CSV Import
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 45, 12, 89, 34"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-card border border-borderTheme text-xs font-bold text-textPrimary focus:outline-none focus:border-primary"
                  />
                  <Button variant="primary" size="sm" onClick={handleImport}>Import</Button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Main Visualization Viewport */}
      <div className="flex-1 overflow-auto py-4 px-2 flex items-center justify-center scrollbar-thin">
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
            <div className="w-full max-w-2xl space-y-1.5 px-4 max-h-[260px] overflow-y-auto">
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
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl py-4 font-mono">
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
                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-sm shadow-soft transition-all ${
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
                    <span className="text-[9px] text-textSecondary mt-1 font-bold">[{idx}]</span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 4. HEATMAP MODE */}
          {viewMode === 'heatmap' && (
            <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl py-4 font-mono">
              {currentArr.map((val, idx) => {
                const color = getHeatmapColor(val);
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);

                return (
                  <motion.div
                    key={idx}
                    layout
                    style={{ backgroundColor: color }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs transition-all ${
                      swapping ? 'scale-125 ring-4 ring-accent z-10' : comparing ? 'scale-110 ring-2 ring-white z-10' : ''
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 5. SCATTER PLOT MODE */}
          {viewMode === 'scatter' && (
            <div className="h-56 relative w-full max-w-3xl border-b-2 border-l-2 border-borderTheme p-4">
              {currentArr.map((val, idx) => {
                const xPercent = (idx / Math.max(1, currentArr.length - 1)) * 90 + 5;
                const yPercent = (val / maxVal) * 85 + 5;
                const comparing = isComparing(idx);
                const swapping = isSwapping(idx);

                let dotBg = 'bg-primary';
                if (comparing) dotBg = 'bg-info scale-150 ring-4 ring-info/30';
                if (swapping) dotBg = 'bg-accent scale-150 ring-4 ring-accent/30';

                return (
                  <motion.div
                    key={idx}
                    layout
                    style={{ left: `${xPercent}%`, bottom: `${yPercent}%` }}
                    className={`absolute w-4 h-4 rounded-full ${dotBg} transition-all duration-150 shadow-soft`}
                    title={`Index ${idx}: ${val}`}
                  />
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Step Event Description Bar */}
      <div className="py-2 border-t-2 border-borderTheme text-center shrink-0">
        <p className="text-xs sm:text-sm font-mono font-bold text-textPrimary truncate px-4 py-1.5 rounded-2xl bg-surface border border-borderTheme inline-block max-w-full">
          {desc || 'Ready to execute C++ sorting algorithm.'}
        </p>
      </div>

      {/* EMBEDDED PLAYBACK BAR WHEN IN FULL SCREEN MODE */}
      {isFullscreen && (
        <div className="pt-3 border-t-2 border-borderTheme shrink-0">
          <SortingPlaybackBar
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

export default SortingCanvas;
