import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, BarChart2, Sliders, Upload, Search, GitBranch, Hash, Layers } from 'lucide-react';
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
  viewMode,
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
  const currentArr = currentEvent.array && currentEvent.array.length > 0 ? currentEvent.array : array;

  const maxVal = Math.max(...currentArr, 1);
  const minVal = Math.min(...currentArr, 0);

  const allowedModes = spec?.allowedViewModes || [
    { key: 'bars_vertical', label: 'Vertical Bars' },
    { key: 'cells', label: 'Array Cells' }
  ];

  const activeViewMode = viewMode || spec?.defaultViewMode || 'bars_vertical';

  const isComparing = (idx) => (type === 'compare' || type === 'split') && (idx === i || idx === j);
  const isSwapping = (idx) => (type === 'swap' || type === 'overwrite' || type === 'merge' || type === 'heap_swap') && (idx === i || idx === j);
  const isPivot = (idx) => (type === 'pivot_select' || type === 'partition') && idx === i;

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

  // Build Binary Max Heap tree structure for Heap Sort
  const buildHeapTree = (arr, index = 0, depth = 0) => {
    if (index >= arr.length) return null;
    return {
      val: arr[index],
      idx: index,
      depth,
      left: buildHeapTree(arr, 2 * index + 1, depth + 1),
      right: buildHeapTree(arr, 2 * index + 2, depth + 1)
    };
  };

  const heapRoot = activeViewMode === 'heap_tree' ? buildHeapTree(currentArr) : null;

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
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'SORTING VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px] uppercase text-primary font-bold">
            {activeViewMode} MODE
          </span>
        </div>

        {/* Algorithm Selector (Full Screen) */}
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
              <Sliders className="w-3.5 h-3.5 text-primary" /> Full Screen Sorting Controls
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
              
              {/* Allowed View Modes for Active Algorithm */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">{spec?.name} View Mode</span>
                <div className="flex gap-1">
                  {allowedModes.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setViewMode && setViewMode(m.key)}
                      className={`flex-1 py-1 rounded-xl font-bold border transition-all ${
                        activeViewMode === m.key ? 'bg-primary text-white border-primary' : 'bg-card text-textPrimary border-borderTheme'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dataset Size & Pattern Filters */}
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
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset('nearly')}>Nearly</Button>
                  <Button variant="outline" size="sm" onClick={() => onGenerateDataset('duplicates')}>Duplicates</Button>
                </div>
              </div>

              {/* Custom CSV Import */}
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
          {activeViewMode === 'bars_vertical' && (
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

          {/* 2. ARRAY CELLS MODE */}
          {activeViewMode === 'cells' && (
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

          {/* 3. MERGE TREE / RECURSION TREE MODE (Merge Sort) */}
          {activeViewMode === 'merge_tree' && (
            <div className="w-full max-w-3xl py-4 space-y-4 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Merge Sort Divide & Conquer Recursion Tree
              </div>
              <div className="flex flex-col items-center space-y-4 w-full">
                <div className="flex gap-1 p-2 bg-card rounded-2xl border-2 border-borderTheme">
                  {currentArr.map((v, idx) => (
                    <span key={idx} className="w-8 h-8 rounded-lg bg-surface border flex items-center justify-center text-xs font-bold">{v}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-6 w-full max-w-xl border-t-2 border-dashed border-borderTheme pt-3">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-primary font-bold mb-1">Left Half [0 .. mid]</span>
                    <div className="flex gap-1 p-2 bg-surface rounded-xl border">
                      {currentArr.slice(0, Math.ceil(currentArr.length / 2)).map((v, idx) => (
                        <span key={idx} className="w-7 h-7 rounded-md bg-card border flex items-center justify-center text-xs font-bold">{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-secondary font-bold mb-1">Right Half [mid+1 .. end]</span>
                    <div className="flex gap-1 p-2 bg-surface rounded-xl border">
                      {currentArr.slice(Math.ceil(currentArr.length / 2)).map((v, idx) => (
                        <span key={idx} className="w-7 h-7 rounded-md bg-card border flex items-center justify-center text-xs font-bold">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PARTITION VIEW MODE (Quick Sort) */}
          {activeViewMode === 'partition' && (
            <div className="w-full max-w-3xl py-4 space-y-4 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <Sliders className="w-4 h-4" /> QuickSort Pivot Partition Subarrays View
              </div>
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="p-3 bg-surface rounded-2xl border-2 border-borderTheme flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-info font-bold">Left Subarray (&lt; Pivot)</span>
                  <div className="flex gap-1">
                    {currentArr.filter(x => x < (currentArr[i] || 50)).map((v, idx) => (
                      <span key={idx} className="w-8 h-8 rounded-lg bg-card border border-info font-bold text-xs flex items-center justify-center">{v}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-warning/20 border-2 border-warning rounded-2xl flex flex-col items-center space-y-1 scale-110 shadow-md">
                  <span className="text-[10px] text-textPrimary font-black">PIVOT</span>
                  <span className="w-10 h-10 rounded-xl bg-warning text-textPrimary font-black text-sm flex items-center justify-center">{currentArr[i] || 50}</span>
                </div>
                <div className="p-3 bg-surface rounded-2xl border-2 border-borderTheme flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-secondary font-bold">Right Subarray (&gt;= Pivot)</span>
                  <div className="flex gap-1">
                    {currentArr.filter(x => x >= (currentArr[i] || 50) && x !== currentArr[i]).map((v, idx) => (
                      <span key={idx} className="w-8 h-8 rounded-lg bg-card border border-secondary font-bold text-xs flex items-center justify-center">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. BINARY HEAP TREE MODE (Heap Sort) */}
          {activeViewMode === 'heap_tree' && (
            <div className="w-full max-w-3xl py-2 font-mono flex flex-col items-center overflow-x-auto scrollbar-thin px-2">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2 mb-3">
                <GitBranch className="w-4 h-4" /> Binary Max Heap Tree Topology
              </div>
              <div className="w-full flex justify-center py-2 min-w-max">
                {heapRoot && <RenderHeapNode node={heapRoot} currentEvent={currentEvent} />}
              </div>
            </div>
          )}

          {/* 6. GAP VIEW MODE (Shell Sort) */}
          {activeViewMode === 'gap_view' && (
            <div className="w-full max-w-3xl py-4 space-y-4 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <Layers className="w-4 h-4" /> Shell Sort Gapped Interleaved Sub-Arrays View
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {currentArr.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-xs ${
                      i === idx || j === idx ? 'bg-warning text-textPrimary border-warning scale-110' : 'bg-card border-borderTheme text-textPrimary'
                    }`}>
                      {val}
                    </div>
                    <span className="text-[9px] text-textSecondary mt-0.5 font-bold">[{idx}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. BUCKETS MODE (Bucket Sort) */}
          {activeViewMode === 'buckets' && (
            <div className="w-full max-w-3xl py-4 space-y-4 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <Hash className="w-4 h-4" /> Bucket Sort Items Scatter & Gather View
              </div>
              <div className="grid grid-cols-5 gap-3 w-full">
                {[0, 1, 2, 3, 4].map((bIdx) => {
                  const bItems = currentArr.filter(x => Math.floor(x / 20) === bIdx);
                  return (
                    <div key={bIdx} className="bg-surface p-3 rounded-2xl border-2 border-borderTheme flex flex-col items-center space-y-2">
                      <span className="text-[10px] font-bold text-textSecondary">Bucket [{bIdx}]</span>
                      <div className="flex flex-col gap-1 w-full">
                        {bItems.map((val, idx) => (
                          <span key={idx} className="py-1 rounded-lg bg-card border border-borderTheme text-center text-xs font-bold">{val}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 8. DIGIT BUCKETS MODE (Radix Sort) */}
          {activeViewMode === 'digit_buckets' && (
            <div className="w-full max-w-4xl py-3 space-y-3 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <Hash className="w-4 h-4" /> Radix Sort 10-Digit Buckets (0 - 9)
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full">
                {Array.from({ length: 10 }, (_, d) => {
                  const dItems = currentArr.filter(x => x % 10 === d);
                  return (
                    <div key={d} className="bg-surface p-2 rounded-xl border-2 border-borderTheme flex flex-col items-center space-y-1">
                      <span className="text-[10px] font-bold text-primary">[{d}]</span>
                      <div className="flex flex-col gap-1 w-full">
                        {dItems.map((val, idx) => (
                          <span key={idx} className="py-0.5 rounded-md bg-card border text-center text-[10px] font-bold">{val}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 9. FREQUENCY ARRAY MODE (Counting Sort) */}
          {activeViewMode === 'freq_array' && (
            <div className="w-full max-w-3xl py-4 space-y-4 font-mono flex flex-col items-center">
              <div className="bg-surface px-4 py-2 rounded-2xl border-2 border-borderTheme text-xs font-bold text-primary flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Counting Sort Key Frequencies Count Array
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {currentArr.slice(0, 10).map((val, idx) => (
                  <div key={idx} className="bg-surface p-2.5 rounded-2xl border-2 border-borderTheme flex flex-col items-center">
                    <span className="text-[10px] text-textSecondary font-bold">Key {val}</span>
                    <span className="w-10 h-10 rounded-xl bg-card border border-primary text-primary font-bold text-xs flex items-center justify-center mt-1">
                      Count: 1
                    </span>
                  </div>
                ))}
              </div>
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

// Heap Tree Node Helper Component
const RenderHeapNode = ({ node, currentEvent }) => {
  if (!node) return null;
  const { type, i, j } = currentEvent;
  const isCurrent = i === node.idx || j === node.idx;
  const isSwap = (type === 'heap_swap' || type === 'swap') && (i === node.idx || j === node.idx);

  let style = 'bg-card border-borderTheme text-textPrimary';
  if (isSwap) style = 'bg-accent text-white border-accent scale-110 shadow-md';
  else if (isCurrent) style = 'bg-warning text-textPrimary border-warning scale-110 shadow-md';

  return (
    <div className="flex flex-col items-center relative">
      <motion.div
        layout
        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-soft z-10 transition-all ${style}`}
      >
        {node.val}
      </motion.div>
      {(node.left || node.right) && (
        <div className="relative pt-6 mt-1 flex justify-center gap-6 w-full">
          <svg className="absolute top-0 left-0 w-full h-6 pointer-events-none stroke-borderTheme stroke-2">
            {node.left && <line x1="50%" y1="0" x2="25%" y2="100%" strokeDasharray="3 3" />}
            {node.right && <line x1="50%" y1="0" x2="75%" y2="100%" strokeDasharray="3 3" />}
          </svg>
          <div className="flex flex-col items-center">
            {node.left && <RenderHeapNode node={node.left} currentEvent={currentEvent} />}
          </div>
          <div className="flex flex-col items-center">
            {node.right && <RenderHeapNode node={node.right} currentEvent={currentEvent} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingCanvas;
