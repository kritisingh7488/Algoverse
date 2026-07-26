import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeftRight, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sliders, Upload, Search } from 'lucide-react';
import { DsPlaybackBar } from './DsPlaybackBar';
import Button from '../common/Button';

export const DsCanvas = ({
  structureKey,
  setStructureKey,
  items,
  activeHighlight,
  pointers = {},
  spec,
  specs = {},
  onLoadPreset,
  onImportCSV,
  onClear,
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
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

  const isHeap = structureKey === 'minheap' || structureKey === 'maxheap' || structureKey === 'priorityqueue';

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

  // Binary Heap Tree coordinate generator
  const getHeapNodeCoords = (index, total) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelPos = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    
    const width = 600;
    const x = (width / (nodesInLevel + 1)) * (levelPos + 1);
    const y = 40 + level * 65;
    return { x, y };
  };

  return (
    <div
      ref={canvasRef}
      className={`bg-card rounded-card border-2 border-borderTheme p-5 shadow-medium flex flex-col justify-between relative transition-all duration-300 font-body ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-6 bg-card flex flex-col justify-between h-screen w-screen overflow-hidden' : 'min-h-[420px] overflow-hidden'
      }`}
    >
      
      {/* Canvas Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-heading font-bold text-textSecondary border-b-2 border-borderTheme pb-3 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'DATA STRUCTURE VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {items.length} ITEMS
          </span>
        </div>

        {/* Data Structure Quick Selector (Full Screen) */}
        {isFullscreen && setStructureKey && specs && (
          <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-2xl border border-borderTheme">
            <Search className="w-3.5 h-3.5 text-primary" />
            <select
              value={structureKey}
              onChange={(e) => setStructureKey(e.target.value)}
              className="bg-transparent font-heading font-bold text-xs text-textPrimary focus:outline-none cursor-pointer"
            >
              {Object.keys(specs).map((k) => (
                <option key={k} value={k} className="bg-card text-textPrimary">
                  {specs[k].name} ({specs[k].category})
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

      {/* FULL SCREEN INTERACTIVE CONTROLS OVERLAY */}
      {isFullscreen && (
        <div className="bg-surface p-3 rounded-2xl border-2 border-borderTheme my-2 shadow-soft space-y-3 shrink-0 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-textPrimary uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Full Screen Data Structure Controls & Presets
            </span>
            <button
              onClick={() => setShowFullControls(!showFullControls)}
              className="text-[10px] font-bold text-primary px-2 py-0.5 bg-card rounded-lg border border-borderTheme"
            >
              {showFullControls ? 'Hide Controls' : 'Show Controls'}
            </button>
          </div>

          {showFullControls && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-borderTheme">
              
              {/* Presets & Actions */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Load Presets</span>
                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  <Button variant="outline" size="sm" onClick={() => onLoadPreset && onLoadPreset('sorted')}>Sorted</Button>
                  <Button variant="outline" size="sm" onClick={() => onLoadPreset && onLoadPreset('reverse')}>Reverse</Button>
                  <Button variant="outline" size="sm" onClick={() => onLoadPreset && onLoadPreset('nearly')}>Nearly</Button>
                  <Button variant="outline" size="sm" onClick={() => onClear && onClear()}>Clear All</Button>
                </div>
              </div>

              {/* CSV Import */}
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

      {/* Canvas Node Viewport Container */}
      <div className="flex-1 overflow-auto py-6 px-4 flex items-center justify-center min-h-[260px] relative scrollbar-thin">
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

          {/* 2. STACK VERTICAL CONTAINER */}
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

          {/* 3. LINKED LISTS */}
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
                        <div className="flex gap-1 mb-1.5 h-5">
                          {isHead && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">HEAD</span>}
                          {isTail && !isHead && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30">TAIL</span>}
                          {isSlow && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">SLOW</span>}
                          {isFast && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-accent/30 text-textPrimary border border-accent/40">FAST</span>}
                        </div>

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

                      {idx < items.length - 1 && (
                        <div className="flex items-center text-primary mx-2">
                          {structureKey === 'doublylist' ? (
                            <ArrowLeftRight className="w-5 h-5" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )}
                        </div>
                      )}

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
                      <div className="flex gap-1 mb-1.5 h-5">
                        {isFront && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">FRONT</span>}
                        {isRear && !isFront && <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-warning/30 text-textPrimary border border-warning/40">REAR</span>}
                      </div>

                      <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm shadow-soft transition-all ${
                        isHighlighted
                          ? 'bg-accent text-textPrimary border-accent scale-110 shadow-medium ring-4 ring-accent/30'
                          : 'bg-card text-textPrimary border-borderTheme'
                      }`}>
                        <span>{val}</span>
                      </div>

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

      {/* EMBEDDED PLAYBACK BAR WHEN IN FULL SCREEN MODE */}
      {isFullscreen && (
        <div className="pt-3 border-t-2 border-borderTheme shrink-0">
          <DsPlaybackBar
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
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

export default DsCanvas;
