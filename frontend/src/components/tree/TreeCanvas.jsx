import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Sliders, Upload, Search, Shuffle, Trash2, Activity } from 'lucide-react';
import TreePlaybackBar from './TreePlaybackBar';
import Button from '../common/Button';
import { isTraversalSupported, isAlgorithmSupported, isOperationSupported, TYPE_SPECIFIC_CONTROLS } from './treeFilters';

export const TreeCanvas = ({
  treeType,
  setTreeType,
  nodes = [],
  edges = [],
  activeHighlight,
  traversalSequence = [],
  desc = '',
  spec,
  specs = {},
  onTraverse,
  onRandomize,
  onClear,
  onImportCSV,
  onInsert,
  onDelete,
  onSearch,
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
  onStepChange,
  speed,
  setSpeed,
  onRestart,
  lastOpName = 'READY',
  inputType = 'Integer',
  setInputType,
  supportedInputTypes = ['Integer'],
  onPreset,
  onAlgorithm,
  onCustomOp,
  autoConvert,
  setAutoConvert,
  algParam = '',
  setAlgParam
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullControls, setShowFullControls] = useState(true);
  const [csvInput, setCsvInput] = useState('');
  const [opInput, setOpInput] = useState('');
  // Draggable node positions (overrides C++ layout when user drags)
  const [draggablePositions, setDraggablePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  // Reset drag positions when nodes array changes significantly
  useEffect(() => {
    setDraggablePositions({});
  }, [nodes.length]);

  // Pointer-capture based node drag — works correctly with SVG viewBox transforms
  const handleNodePointerDown = (e, nodeId) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingNode(nodeId);
  };

  const handleNodePointerMove = (e, nodeId) => {
    if (draggingNode !== nodeId || !svgRef.current) return;
    e.stopPropagation();
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setDraggablePositions((prev) => ({ ...prev, [nodeId]: { x: svgP.x, y: svgP.y } }));
  };

  const handleNodePointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDraggingNode(null);
  };

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;
    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleImport = () => {
    if (!csvInput.trim() || !onImportCSV) return;
    const isNum = inputType === 'Integer';
    const values = csvInput.split(',')
      .map(x => isNum ? parseInt(x.trim(), 10) : x.trim())
      .filter(x => isNum ? !Number.isNaN(x) : x.length > 0);
    if (values.length > 0) { onImportCSV(values); setCsvInput(''); }
  };

  const handleFsInsert = () => {
    if (!opInput.trim() || !onInsert) return;
    onInsert(opInput.trim());
    setOpInput('');
  };

  const handleFsDelete = () => {
    if (!opInput.trim() || !onDelete) return;
    onDelete(opInput.trim());
    setOpInput('');
  };

  const handleFsSearch = () => {
    if (!opInput.trim() || !onSearch) return;
    onSearch(opInput.trim());
  };

  // Compute bounding box for auto-fit with sensible minimum viewport so small trees aren't giant
  const rawMinX = nodes.length > 0 ? Math.min(...nodes.map(n => n.x)) : 200;
  const rawMaxX = nodes.length > 0 ? Math.max(...nodes.map(n => n.x)) : 600;
  const rawMinY = nodes.length > 0 ? Math.min(...nodes.map(n => n.y)) : 0;
  const rawMaxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) : 200;

  const centerX = (rawMinX + rawMaxX) / 2;
  const centerY = (rawMinY + rawMaxY) / 2;
  const spanX = Math.max(rawMaxX - rawMinX + 140, 580);
  const spanY = Math.max(rawMaxY - rawMinY + 140, 360);
  
  const minX = centerX - spanX / 2;
  const minY = centerY - spanY / 2;

  return (
    <div
      ref={canvasRef}
      className={`bg-card rounded-card border-2 border-borderTheme p-5 shadow-medium flex flex-col justify-between relative transition-all duration-300 font-body ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-6 bg-card flex flex-col justify-between h-screen w-screen overflow-hidden' : 'min-h-[480px] overflow-hidden'
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
          {desc && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] max-w-xs truncate">
              {desc}
            </span>
          )}
        </div>

        {isFullscreen && (
          <div className="flex items-center gap-2">
            {setTreeType && specs && (
              <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-2xl border border-borderTheme">
                <Search className="w-3.5 h-3.5 text-primary" />
                <select value={treeType} onChange={(e) => setTreeType(e.target.value)}
                  className="bg-transparent font-heading font-bold text-xs text-textPrimary focus:outline-none cursor-pointer">
                  {Object.keys(specs).map((k) => (
                    <option key={k} value={k} className="bg-card text-textPrimary">{specs[k].name}</option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={() => setShowFullControls(!showFullControls)}
              className={`px-3 py-1 rounded-2xl text-[11px] font-bold font-mono transition-all border flex items-center gap-1 ${
                showFullControls
                  ? 'bg-primary/20 text-primary border-primary'
                  : 'bg-surface text-textSecondary border-borderTheme hover:border-primary'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showFullControls ? 'Hide Panel' : 'Show Studio Panel'}</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center font-bold">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
            className="p-1.5 rounded-xl bg-surface border border-borderTheme hover:bg-card text-textPrimary transition-all shadow-xs" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          {setAutoConvert && (
            <button
              onClick={() => setAutoConvert(!autoConvert)}
              className={`p-1.5 rounded-xl border transition-all ml-1 shadow-soft flex items-center gap-1 text-[11px] font-bold px-2.5 ${
                autoConvert
                  ? 'bg-primary/20 text-primary border-primary font-bold'
                  : 'bg-surface text-textSecondary border-borderTheme hover:border-primary'
              }`}
              title="Automatically rebuild and convert tree when switching tree types"
            >
              <span>Auto-Convert: {autoConvert ? 'ON' : 'OFF'}</span>
            </button>
          )}
          <button onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all ml-1 shadow-soft flex items-center gap-1 text-[11px] font-bold px-3"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen View'}>
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      {/* Live Output Line Bar */}
      <div className="w-full flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 my-2 rounded-lg shadow-xs z-10">
        <Activity className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span className="text-xs font-mono font-bold text-foreground break-words whitespace-normal flex-1">
          Output: {desc || 'Select any operation, traversal, or algorithm to see native C++ step-by-step execution.'}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {totalSteps > 0 && (
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-[10px] border border-primary/30">
              STEP {(stepIndex || 0) + 1} / {totalSteps}
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-surface border border-borderTheme text-textSecondary font-bold text-[10px]">
            {nodes.length} NODES
          </span>
        </div>
      </div>

      {/* Horizontal Flex Container in Full Screen mode for Main Canvas + Right Side Panel */}
      <div className={`flex-1 w-full overflow-hidden flex ${isFullscreen ? 'flex-row' : 'flex-col'} relative`}>
        {/* LEFT COLUMN: Main SVG Tree Viewport + Traversal Banner + Playback Bar */}
        <div className="flex-1 h-full flex flex-col overflow-hidden relative">
          {/* Main SVG Tree Viewport */}
          <div className="flex-1 w-full overflow-hidden py-3 flex items-center justify-center min-h-[340px] relative">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
            >
              {nodes.length > 0 ? (
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox={`${minX} ${minY} ${spanX} ${spanY}`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    minHeight: isFullscreen ? '70vh' : '340px',
                    maxHeight: isFullscreen ? '82vh' : '460px'
                  }}
                  className="w-full h-full overflow-visible"
                >
                  {/* Edges */}
                  {edges && edges.length > 0 ? (
                    edges.map((ed, idx) => {
                      const source = nodes.find(n => n.id === ed.from);
                      const target = nodes.find(n => n.id === ed.to);
                      if (!source || !target) return null;
                      const isHighlightEdge = ed.highlight || activeHighlight === ed.to;
                      const sx = draggablePositions[ed.from]?.x ?? source.x;
                      const sy = draggablePositions[ed.from]?.y ?? source.y;
                      const tx = draggablePositions[ed.to]?.x ?? target.x;
                      const ty = draggablePositions[ed.to]?.y ?? target.y;
                      return (
                        <line key={`ed-${idx}-${ed.from}-${ed.to}`}
                          x1={sx} y1={sy} x2={tx} y2={ty}
                          stroke={isHighlightEdge ? 'var(--color-warning, #f59e0b)' : 'var(--color-borderTheme, #e5e7eb)'}
                          strokeWidth={isHighlightEdge ? 3 : 2}
                          strokeDasharray={isHighlightEdge ? '6 3' : 'none'}
                        />
                      );
                    })
                  ) : (
                    nodes.map((node) => {
                      if (node.pid < 0) return null;
                      const parent = nodes.find(n => n.id === node.pid);
                      if (!parent) return null;
                      const isHighlightEdge = activeHighlight === node.id;
                      const px = draggablePositions[node.pid]?.x ?? parent.x;
                      const py = draggablePositions[node.pid]?.y ?? parent.y;
                      const nx = draggablePositions[node.id]?.x ?? node.x;
                      const ny = draggablePositions[node.id]?.y ?? node.y;
                      return (
                        <line key={`e-${node.id}`}
                          x1={px} y1={py} x2={nx} y2={ny}
                          stroke={isHighlightEdge ? 'var(--color-warning, #f59e0b)' : 'var(--color-borderTheme, #e5e7eb)'}
                          strokeWidth={isHighlightEdge ? 3 : 2}
                          strokeDasharray={isHighlightEdge ? '6 3' : 'none'}
                        />
                      );
                    })
                  )}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const isHL = activeHighlight === node.id;
                    const isRB = treeType === 'redblack';
                    const isRed = isRB && node.clr === 'red';
                    const isDragging = draggingNode === node.id;
                    // Use user-dragged position if available, otherwise C++ layout
                    const nodeX = draggablePositions[node.id]?.x ?? node.x;
                    const nodeY = draggablePositions[node.id]?.y ?? node.y;

                    let fill = 'var(--color-card, white)';
                    let stroke = 'var(--color-primary, #6366f1)';
                    let textFill = 'var(--color-primary, #6366f1)';

                    if (isDragging) {
                      fill = '#f59e0b'; stroke = '#d97706'; textFill = 'white';
                    } else if (isHL) {
                      fill = 'var(--color-warning, #f59e0b)';
                      stroke = 'var(--color-warning, #f59e0b)';
                      textFill = 'white';
                    } else if (isRB && isRed) {
                      fill = '#ef4444'; stroke = '#dc2626'; textFill = 'white';
                    } else if (isRB) {
                      fill = '#1e293b'; stroke = '#0f172a'; textFill = 'white';
                    }

                    const labelStr = String(node.displayLabel !== undefined ? node.displayLabel : node.val);
                    const fontSize = labelStr.length >= 5 ? "9" : labelStr.length === 4 ? "10" : labelStr.length === 3 ? "11" : "12";
                    const rVal = node.displayRadius ? node.displayRadius : 18;

                    return (
                      <g
                        key={`n-${node.id}`}
                        className={isDragging ? "cursor-grabbing" : "transition-all duration-150 cursor-grab"}
                        onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                        onPointerMove={(e) => handleNodePointerMove(e, node.id)}
                        onPointerUp={(e) => handleNodePointerUp(e)}
                      >
                        <circle
                          cx={nodeX} cy={nodeY} r={isDragging ? rVal + 3 : rVal}
                          fill={fill} stroke={stroke} strokeWidth={isDragging ? 3.5 : 2.5}
                          style={{ filter: isDragging ? 'drop-shadow(0 0 8px rgba(245,158,11,0.7))' : 'none' }}
                        />
                        <text
                          x={nodeX} y={nodeY + 4}
                          textAnchor="middle" fill={textFill}
                          fontSize={fontSize} fontWeight="bold" fontFamily="monospace"
                          className="select-none pointer-events-none"
                        >
                          {labelStr}
                        </text>
                        {/* Balance factor label for AVL */}
                        {(treeType === 'avl') && (
                          <text x={nodeX + rVal + 4} y={nodeY - 16} textAnchor="start" fontSize="9"
                            fill={Math.abs(node.bf) > 1 ? '#ef4444' : 'var(--color-textSecondary, #6b7280)'}
                            fontFamily="monospace" fontWeight="bold" className="pointer-events-none">
                            bf:{node.bf}
                          </text>
                        )}
                        {/* Height label */}
                        <text x={nodeX - rVal - 4} y={nodeY - 16} textAnchor="end" fontSize="8"
                          fill="var(--color-textSecondary, #9ca3af)" fontFamily="monospace"
                          className="pointer-events-none">
                          h:{node.h}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="text-center py-16 space-y-2">
                  <p className="text-sm font-heading font-bold text-textSecondary">Tree is currently empty</p>
                  <p className="text-xs font-body text-textSecondary">Insert nodes or load a preset to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Traversal Sequence Banner */}
          <div className="py-2 border-t-2 border-borderTheme flex items-center gap-2 overflow-x-auto text-xs font-mono shrink-0">
            <span className="text-textSecondary font-bold shrink-0">Traversal:</span>
            {traversalSequence.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-primary text-white font-bold shrink-0">{v}</span>
            ))}
            {traversalSequence.length === 0 && <span className="text-textSecondary italic">Execute a traversal to see output</span>}
          </div>

          {/* Embedded Playback Bar in Full Screen */}
          {isFullscreen && (
            <div className="pt-3 border-t-2 border-borderTheme shrink-0">
              <TreePlaybackBar isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIndex={stepIndex}
                totalSteps={totalSteps} onStepChange={onStepChange} speed={speed} setSpeed={setSpeed} onRestart={onRestart} />
            </div>
          )}
        </div>

        {/* RIGHT SIDE PANEL: Full Screen Complete Controls Studio */}
        {isFullscreen && showFullControls && (
          <div className="w-80 lg:w-96 shrink-0 h-full bg-surface border-l-2 border-borderTheme overflow-y-auto p-4 space-y-4 font-mono shadow-2xl z-20">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-borderTheme pb-2.5">
              <span className="font-heading font-bold text-textPrimary uppercase flex items-center gap-1.5 text-xs">
                <Sliders className="w-4 h-4 text-primary" /> Studio Controls Panel
              </span>
              <button onClick={() => setShowFullControls(false)}
                className="text-[10px] font-bold text-textSecondary hover:text-danger px-2 py-1 bg-card rounded-lg border border-borderTheme">
                ✕ Close
              </button>
            </div>

            {/* CARD 1: INPUT DATA TYPE & PRESETS */}
            <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase block mb-1">Input Data Type:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {(supportedInputTypes || ['Integer']).map((typeOption) => (
                    <Button
                      key={typeOption}
                      onClick={() => setInputType && setInputType(typeOption)}
                      variant={inputType === typeOption ? 'primary' : 'outline'}
                      size="sm"
                      className="text-[10px] py-0.5 px-2"
                    >
                      {typeOption}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-borderTheme">
                <span className="text-[10px] font-bold text-textSecondary uppercase block mb-1">Test Presets:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  <Button onClick={() => onPreset && onPreset('Balanced')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Balanced</Button>
                  <Button onClick={() => onPreset && onPreset('Skewed')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Skewed</Button>
                  <Button onClick={() => onPreset && onPreset('Complete')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Complete</Button>
                  <Button onClick={() => onPreset && onPreset('Random')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Random</Button>
                  <Button onClick={() => onPreset && onPreset('Duplicate')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Duplicate</Button>
                  <Button onClick={() => onPreset && onPreset('Large')} variant="outline" size="sm" className="text-[10px] py-0.5 px-2">Large</Button>
                </div>
              </div>

              {setAutoConvert && (
                <div className="pt-2 border-t border-borderTheme flex items-center justify-between">
                  <span className="text-[10px] font-bold text-textSecondary uppercase">Auto Tree Conversion:</span>
                  <button
                    onClick={() => setAutoConvert(!autoConvert)}
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-lg border transition-all font-bold ${
                      autoConvert
                        ? 'bg-primary/20 text-primary border-primary'
                        : 'bg-surface text-textSecondary border-borderTheme hover:border-primary'
                    }`}
                  >
                    {autoConvert ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: OPERATIONS & IMPORT */}
            <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2.5">
              <span className="text-[10px] font-bold text-textSecondary uppercase block">Basic Operations:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  placeholder="Val"
                  value={opInput}
                  onChange={(e) => setOpInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFsInsert()}
                  className="w-16 px-2 py-1 rounded-lg bg-surface border border-borderTheme text-xs font-bold text-textPrimary focus:outline-none focus:border-primary"
                />
                {isOperationSupported('insert', treeType) && (
                  <Button variant="primary" size="sm" onClick={handleFsInsert} className="text-[10px] py-0.5 px-2">+ Insert</Button>
                )}
                {isOperationSupported('delete', treeType) && (
                  <Button variant="outline" size="sm" onClick={handleFsDelete} className="text-[10px] py-0.5 px-2">Delete</Button>
                )}
                {isOperationSupported('search', treeType) && (
                  <Button variant="outline" size="sm" onClick={handleFsSearch} className="text-[10px] py-0.5 px-2">Search</Button>
                )}
              </div>

              <div className="pt-2 border-t border-borderTheme flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  placeholder="CSV: 50,25,75"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                  className="w-36 px-2 py-1 rounded-lg bg-surface border border-borderTheme text-xs font-bold text-textPrimary focus:outline-none focus:border-primary"
                />
                <Button variant="secondary" size="sm" onClick={handleImport} className="text-[10px] py-0.5 px-2">Import</Button>
              </div>

              <div className="pt-2 border-t border-borderTheme flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onRandomize} className="text-[10px] py-0.5 px-2"><Shuffle className="w-3 h-3 mr-1" /> Random</Button>
                <Button variant="outline" size="sm" onClick={onClear} className="text-[10px] py-0.5 px-2"><Trash2 className="w-3 h-3 mr-1 text-danger" /> Clear</Button>
              </div>
            </div>

            {/* CARD 3: TYPE-SPECIFIC CONTROLS (SHOW ONLY WHEN APPLICABLE) */}
            {TYPE_SPECIFIC_CONTROLS[treeType] && TYPE_SPECIFIC_CONTROLS[treeType].length > 0 && (
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-bold text-primary text-[10px] uppercase">
                    {treeType.toUpperCase()} Specific:
                  </span>
                  <input
                    type="text"
                    placeholder="k / param"
                    value={algParam}
                    onChange={(e) => setAlgParam && setAlgParam(e.target.value)}
                    className="w-24 px-2 py-0.5 rounded bg-surface border border-borderTheme text-[11px] font-mono text-textPrimary focus:outline-none focus:border-primary"
                    title="Value for Type-Specific controls"
                  />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {TYPE_SPECIFIC_CONTROLS[treeType].map((ctrl) => (
                    <Button
                      key={ctrl.key}
                      variant="secondary"
                      size="sm"
                      onClick={() => onCustomOp && onCustomOp(ctrl.key, ctrl.desc)}
                      className="text-[10px] py-0.5 px-2"
                    >
                      {ctrl.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* CARD 4: FILTERED C++ TRAVERSALS */}
            {['inorder', 'preorder', 'postorder', 'levelorder', 'zigzag', 'boundary', 'vertical', 'topview', 'bottomview', 'leftview', 'rightview', 'morris'].filter(t => isTraversalSupported(t, treeType)).length > 0 && (
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2">
                <span className="font-bold text-textSecondary text-[10px] uppercase block">
                  C++ Traversals ({['inorder', 'preorder', 'postorder', 'levelorder', 'zigzag', 'boundary', 'vertical', 'topview', 'bottomview', 'leftview', 'rightview', 'morris'].filter(t => isTraversalSupported(t, treeType)).length}):
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {['inorder', 'preorder', 'postorder', 'levelorder', 'zigzag', 'boundary', 'vertical', 'topview', 'bottomview', 'leftview', 'rightview', 'morris']
                    .filter(trav => isTraversalSupported(trav, treeType))
                    .map((trav) => (
                      <Button
                        key={trav}
                        variant="outline"
                        size="sm"
                        onClick={() => onTraverse && onTraverse(trav)}
                        className="text-[10px] py-0.5 px-2"
                      >
                        {trav === 'levelorder' ? 'Level-BFS' : trav.charAt(0).toUpperCase() + trav.slice(1)}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* CARD 5: FILTERED C++ ALGORITHMS */}
            {[
              { key: 'height', label: 'Height' },
              { key: 'depth', label: 'Depth' },
              { key: 'diameter', label: 'Diameter' },
              { key: 'balance', label: 'Balance Check' },
              { key: 'lca', label: 'LCA (val)' },
              { key: 'kthsmall', label: 'Kth Smallest' },
              { key: 'kthlarge', label: 'Kth Largest' },
              { key: 'successor', label: 'Successor' },
              { key: 'predecessor', label: 'Predecessor' },
              { key: 'mirror', label: 'Mirror/Invert' },
              { key: 'validate', label: 'Validate BST' },
              { key: 'serialize', label: 'Serialize' },
              { key: 'pathsum', label: 'Path Sum' },
              { key: 'countnodes', label: 'Count Nodes' },
              { key: 'countleaves', label: 'Count Leaves' }
            ].filter(alg => isAlgorithmSupported(alg.key, treeType)).length > 0 && (
              <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-bold text-textSecondary text-[10px] uppercase">
                    C++ Algorithms:
                  </span>
                  <input
                    type="text"
                    placeholder="k / val (e.g. 25)"
                    value={algParam}
                    onChange={(e) => setAlgParam && setAlgParam(e.target.value)}
                    className="w-28 px-2 py-0.5 rounded bg-surface border border-borderTheme text-[11px] font-mono text-textPrimary focus:outline-none focus:border-primary"
                    title="Value for Successor, Predecessor, Kth Smallest, Kth Largest, LCA, Path Sum"
                  />
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { key: 'height', label: 'Height' },
                    { key: 'depth', label: 'Depth' },
                    { key: 'diameter', label: 'Diameter' },
                    { key: 'balance', label: 'Balance Check' },
                    { key: 'lca', label: 'LCA (val)' },
                    { key: 'kthsmall', label: 'Kth Smallest' },
                    { key: 'kthlarge', label: 'Kth Largest' },
                    { key: 'successor', label: 'Successor' },
                    { key: 'predecessor', label: 'Predecessor' },
                    { key: 'mirror', label: 'Mirror/Invert' },
                    { key: 'validate', label: 'Validate BST' },
                    { key: 'serialize', label: 'Serialize' },
                    { key: 'pathsum', label: 'Path Sum' },
                    { key: 'countnodes', label: 'Count Nodes' },
                    { key: 'countleaves', label: 'Count Leaves' }
                  ]
                    .filter(alg => isAlgorithmSupported(alg.key, treeType))
                    .map((alg) => (
                      <Button
                        key={alg.key}
                        variant="outline"
                        size="sm"
                        onClick={() => onAlgorithm && onAlgorithm(alg.key, algParam)}
                        className="text-[10px] py-0.5 px-2"
                      >
                        {alg.label}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeCanvas;
