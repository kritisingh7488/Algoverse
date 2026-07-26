import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Sliders, Upload, Search, Shuffle, Trash2 } from 'lucide-react';
import TreePlaybackBar from './TreePlaybackBar';
import Button from '../common/Button';

export const TreeCanvas = ({
  treeType,
  setTreeType,
  nodes = [],
  activeHighlight,
  traversalSequence = [],
  spec,
  specs = {},
  onTraverse,
  onRandomize,
  onClear,
  onImportCSV,
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
          <span className="text-sm font-bold text-textPrimary">{spec?.name?.toUpperCase() || 'TREE VISUALIZER'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-surface border border-borderTheme font-mono text-[10px]">
            {nodes.length} NODES
          </span>
        </div>

        {/* Tree Quick Selector (Full Screen) */}
        {isFullscreen && setTreeType && specs && (
          <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-2xl border border-borderTheme">
            <Search className="w-3.5 h-3.5 text-primary" />
            <select
              value={treeType}
              onChange={(e) => setTreeType(e.target.value)}
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
              <Sliders className="w-3.5 h-3.5 text-primary" /> Full Screen Tree Controls & Traversals
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
              
              {/* Traversals */}
              <div className="space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Traversals</span>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <Button variant="outline" size="sm" onClick={() => onTraverse && onTraverse('inorder')}>In-Order</Button>
                  <Button variant="outline" size="sm" onClick={() => onTraverse && onTraverse('preorder')}>Pre-Order</Button>
                  <Button variant="outline" size="sm" onClick={() => onTraverse && onTraverse('postorder')}>Post-Order</Button>
                  <Button variant="outline" size="sm" onClick={() => onTraverse && onTraverse('levelorder')}>Level-Order</Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 border-x border-borderTheme px-3">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">Actions</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onRandomize} className="flex-1">
                    <Shuffle className="w-3 h-3 mr-1" /> Random
                  </Button>
                  <Button variant="danger" size="sm" onClick={onClear} className="flex-1">
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </Button>
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
                    placeholder="e.g. 50, 25, 75, 15"
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

      {/* Main Node Tree Viewport */}
      <div className="flex-1 overflow-auto py-6 px-4 flex items-center justify-center min-h-[280px] relative scrollbar-thin">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 w-full flex justify-center items-center relative h-[260px]"
        >
          {/* SVG Parent-Child Branch Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-borderTheme stroke-2">
            {nodes.map((node) => {
              if (!node.parent) return null;
              const parentNode = nodes.find((n) => n.id === node.parent);
              if (!parentNode) return null;

              return (
                <line
                  key={`edge-${node.id}`}
                  x1={parentNode.x || 250}
                  y1={parentNode.y || 50}
                  x2={node.x || 250}
                  y2={node.y || 120}
                  strokeWidth="2.5"
                  strokeDasharray={activeHighlight === node.id ? "4 4" : "none"}
                />
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHighlighted = activeHighlight === node.id;
            const isRedBlack = treeType === 'redblack';
            const isRed = isRedBlack && (node.color === 'red' || node.id % 2 === 0);

            let nodeBg = 'bg-card border-primary text-primary';
            if (isHighlighted) nodeBg = 'bg-warning text-textPrimary border-warning scale-115 ring-4 ring-warning/30 z-20';
            else if (isRedBlack) nodeBg = isRed ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-900 text-white border-slate-950';

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ left: `${(node.x || 250) - 20}px`, top: `${(node.y || 50) - 20}px` }}
                className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-medium transition-all duration-300 ${nodeBg}`}
              >
                {node.val}
              </motion.div>
            );
          })}

          {nodes.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-heading font-bold text-textSecondary">Tree is currently empty</p>
              <p className="text-xs font-body text-textSecondary">Use the node insertion bar below to add elements or load a preset.</p>
            </div>
          )}
        </div>
      </div>

      {/* Traversal Sequence Banner */}
      <div className="py-2 border-t-2 border-borderTheme flex items-center gap-2 overflow-x-auto text-xs font-mono shrink-0">
        <span className="text-textSecondary font-bold shrink-0">Traversal Output:</span>
        {traversalSequence.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded-lg bg-primary text-white font-bold shrink-0">
            {v}
          </span>
        ))}
        {traversalSequence.length === 0 && <span className="text-textSecondary italic">Execute a traversal to inspect output sequence</span>}
      </div>

      {/* EMBEDDED PLAYBACK BAR WHEN IN FULL SCREEN MODE */}
      {isFullscreen && (
        <div className="pt-3 border-t-2 border-borderTheme shrink-0">
          <TreePlaybackBar
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

export default TreeCanvas;
