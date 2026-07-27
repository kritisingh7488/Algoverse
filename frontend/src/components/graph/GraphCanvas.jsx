import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  Layout,
  Grid,
  Circle,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Sliders,
  Table,
  List,
  FileText,
  Play,
  Activity,
  Search,
  Plus,
  Trash2,
  Shuffle,
  Check,
  Code
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import GraphPlaybackBar from './GraphPlaybackBar';
import GraphInformationPanel from './GraphInformationPanel';
import GraphSpecificInputsAndOutput from './GraphSpecificInputsAndOutput';
import { GRAPH_TYPE_METADATA, ALGORITHM_METADATA } from '../../pages/labs/GraphLab';

export const GraphCanvas = ({
  graphType = 'undirected',
  setGraphType,
  algorithm = 'bfs',
  setAlgorithm,
  startNode = 0,
  setStartNode,
  targetNode = 5,
  setTargetNode,
  kValue = 3,
  setKValue,
  vertices = [],
  edges = [],
  events = [],
  statistics = {},
  representations = {},
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
  onStepChange,
  speed,
  setSpeed,
  onRestart,
  onRunOperation,
  onPreset,
  onAddVertex,
  onDeleteVertex,
  onAddEdge,
  onDeleteEdge,
  onRandomize,
  onResetGraph,
  onClearGraph,
  newVertexLabel,
  setNewVertexLabel,
  delVertexId,
  setDelVertexId,
  edgeFrom,
  setEdgeFrom,
  edgeTo,
  setEdgeTo,
  edgeWeight,
  setEdgeWeight,
  delEdgeFrom,
  setDelEdgeFrom,
  delEdgeTo,
  setDelEdgeTo,
  autoConvert,
  setAutoConvert,
  isFullScreen = false,
  onToggleFullScreen
}) => {
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas', 'edgelist', 'adjlist', 'adjmatrix', 'incmatrix'
  const [showFullControls, setShowFullControls] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showWeights, setShowWeights] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showDirections, setShowDirections] = useState(true);
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(isFullScreen);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const canvasContainerRef = useRef(null);

  const svgRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasContainerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
        if (onToggleFullScreen) onToggleFullScreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        if (onToggleFullScreen) onToggleFullScreen(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);
      if (onToggleFullScreen) onToggleFullScreen(full);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [onToggleFullScreen]);

  const renderFullScreenStudioPanel = () => {
    const categories = ['All', 'Traversal', 'Shortest Path', 'Minimum Spanning Tree', 'Connectivity', 'Cycle Detection', 'Topological Sort', 'Flow & Matching', 'Disjoint Set Union', 'Graph Coloring', 'Clique & Set', 'Euler & Hamilton', 'Heuristics & AI'];
    const filteredAlgos = Object.entries(ALGORITHM_METADATA || {}).filter(([key, meta]) => {
      if (selectedCategory === 'All') return true;
      return meta.category === selectedCategory;
    });
    const currentMeta = (ALGORITHM_METADATA && ALGORITHM_METADATA[algorithm]) || {
      name: algorithm,
      time: 'O(V + E)',
      space: 'O(V)',
      pseudocode: [`// C++ native ${algorithm} execution`]
    };

    return (
      <div className="w-80 lg:w-96 shrink-0 h-full bg-surface border-l-2 border-borderTheme overflow-y-auto p-4 space-y-4 font-body shadow-2xl z-20">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-borderTheme pb-2.5">
          <span className="font-heading font-bold text-textPrimary uppercase flex items-center gap-1.5 text-xs">
            <Sliders className="w-4 h-4 text-primary" /> Studio Controls Panel
          </span>
          <button
            onClick={() => setShowFullControls(false)}
            className="text-[10px] font-bold text-textSecondary hover:text-danger px-2 py-1 bg-card rounded-lg border border-borderTheme"
          >
            ✕ Close
          </button>
        </div>

        {/* Card 1: Graph Architectures & Presets */}
        <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2.5">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase block mb-1.5">
              1. Select Graph Architecture:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {Object.entries(GRAPH_TYPE_METADATA || {}).map(([typeKey, meta]) => (
                <Button
                  key={typeKey}
                  variant={graphType === typeKey ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setGraphType && setGraphType(typeKey)}
                  className="text-[10px] py-0.5 px-2"
                >
                  {meta.name || typeKey}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-borderTheme">
            <span className="text-[10px] font-bold text-textSecondary uppercase block mb-1.5">
              Test Presets:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { key: 'random', label: 'Random Graph' },
                { key: 'grid', label: 'Grid Graph' },
                { key: 'complete', label: 'Complete Kn' },
                { key: 'negative', label: 'Negative Wt' },
                { key: 'dag', label: 'DAG' },
                { key: 'bipartite', label: 'Bipartite' },
                { key: 'sparse', label: 'Sparse' },
                { key: 'dense', label: 'Dense' },
                { key: 'tree', label: 'Tree' },
                { key: 'cycle', label: 'Cycle' }
              ].map((p) => (
                <Button
                  key={p.key}
                  variant="outline"
                  size="sm"
                  onClick={() => onPreset && onPreset(p.key)}
                  className="text-[10px] py-0.5 px-2"
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Construction & Mutations */}
        <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2.5">
          <span className="text-[10px] font-bold text-primary uppercase block">
            2. Interactive Construction:
          </span>
          <div className="space-y-2 text-xs">
            {/* Add/Delete Vertex */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 bg-surface p-2 rounded-lg border border-borderTheme">
              <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                <input
                  type="text"
                  placeholder="New V..."
                  value={newVertexLabel || ''}
                  onChange={(e) => setNewVertexLabel && setNewVertexLabel(e.target.value)}
                  className="w-16 bg-background border border-borderTheme rounded px-1.5 py-0.5 text-xs focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={onAddVertex} className="text-[10px] py-0.5 px-2">
                  <Plus className="w-3 h-3 mr-0.5" /> Add V
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="ID"
                  value={delVertexId || ''}
                  onChange={(e) => setDelVertexId && setDelVertexId(e.target.value)}
                  className="w-12 bg-background border border-borderTheme rounded px-1.5 py-0.5 text-xs focus:outline-none"
                />
                <Button variant="ghost" size="sm" onClick={onDeleteVertex} className="text-[10px] py-0.5 px-1.5 text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Add/Delete Edge */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 bg-surface p-2 rounded-lg border border-borderTheme">
              <div className="flex items-center gap-1 flex-wrap">
                <input
                  type="number"
                  placeholder="u"
                  value={edgeFrom || ''}
                  onChange={(e) => setEdgeFrom && setEdgeFrom(e.target.value)}
                  className="w-10 bg-background border border-borderTheme rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <span>→</span>
                <input
                  type="number"
                  placeholder="v"
                  value={edgeTo || ''}
                  onChange={(e) => setEdgeTo && setEdgeTo(e.target.value)}
                  className="w-10 bg-background border border-borderTheme rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="wt"
                  value={edgeWeight || ''}
                  onChange={(e) => setEdgeWeight && setEdgeWeight(e.target.value)}
                  className="w-10 bg-background border border-borderTheme rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={onAddEdge} className="text-[10px] py-0.5 px-2">
                  <Plus className="w-3 h-3 mr-0.5" /> Add E
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="u"
                  value={delEdgeFrom || ''}
                  onChange={(e) => setDelEdgeFrom && setDelEdgeFrom(e.target.value)}
                  className="w-9 bg-background border border-borderTheme rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <span>→</span>
                <input
                  type="number"
                  placeholder="v"
                  value={delEdgeTo || ''}
                  onChange={(e) => setDelEdgeTo && setDelEdgeTo(e.target.value)}
                  className="w-9 bg-background border border-borderTheme rounded px-1 py-0.5 text-xs focus:outline-none"
                />
                <Button variant="ghost" size="sm" onClick={onDeleteEdge} className="text-[10px] py-0.5 px-1.5 text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <Button variant="outline" size="sm" onClick={onRandomize} className="text-[10px] py-1 px-2">
              <Shuffle className="w-3 h-3 mr-1" /> Randomize
            </Button>
            <Button variant="outline" size="sm" onClick={onResetGraph} className="text-[10px] py-1 px-2">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={onClearGraph} className="text-[10px] py-1 px-2 text-red-500">
              <Trash2 className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Card 3: Categorized Algorithms Bar */}
        <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2.5">
          <span className="text-[10px] font-bold text-primary uppercase block">
            3. Select & Execute Algorithm (40+ Available):
          </span>
          <div className="flex flex-wrap gap-1 bg-surface p-1 rounded-lg border border-borderTheme">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                  selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto p-1">
            {filteredAlgos.map(([key, meta]) => {
              const isSelected = algorithm === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (setAlgorithm) setAlgorithm(key);
                  }}
                  className={`p-1.5 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                    isSelected ? 'bg-primary/20 border-primary text-primary font-bold shadow-xs' : 'bg-surface border-borderTheme text-foreground hover:border-primary/50'
                  }`}
                >
                  <span className="text-[11px] font-heading truncate">{meta.name}</span>
                  <span className="text-[9px] text-muted font-mono">{meta.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 4: Pseudocode & Complexity */}
        <div className="bg-card p-3 rounded-xl border border-borderTheme space-y-2">
          <div className="flex items-center gap-1.5 border-b border-borderTheme pb-1.5">
            <Code className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">C++ Native {currentMeta.name}</span>
          </div>
          <pre className="p-2 bg-surface rounded text-[10px] font-mono text-foreground overflow-x-auto border border-borderTheme space-y-0.5">
            {(currentMeta.pseudocode || []).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </pre>
          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
            <span className="text-muted">Time:</span>
            <span className="font-bold text-primary">{currentMeta.time}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-muted">Space:</span>
            <span className="font-bold text-foreground">{currentMeta.space}</span>
          </div>
        </div>

        {/* Card 5: Live Information Panel */}
        <GraphInformationPanel
          algorithm={algorithm}
          events={events}
          stepIndex={stepIndex}
          statistics={statistics}
          vertices={vertices}
          edges={edges}
        />
      </div>
    );
  };

  // Sync initial node positions from C++ engine output
  useEffect(() => {
    const newPos = {};
    vertices.forEach((v) => {
      newPos[v.id] = { x: v.x || 200, y: v.y || 200 };
    });
    setNodePositions(newPos);
  }, [vertices]);

  // Handle draggable nodes
  const handleMouseDown = (nodeId) => {
    setDraggingNode(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggingNode === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    setNodePositions((prev) => ({
      ...prev,
      [draggingNode]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Auto Layout triggers
  const applyLayout = (layoutType) => {
    const n = vertices.length;
    if (n === 0) return;
    const newPos = {};

    if (layoutType === 'circular') {
      const cx = 350, cy = 220, radius = 170;
      vertices.forEach((v, idx) => {
        const angle = (2 * Math.PI * idx) / n;
        newPos[v.id] = {
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        };
      });
    } else if (layoutType === 'grid') {
      const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
      const dx = 130, dy = 110;
      vertices.forEach((v, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        newPos[v.id] = { x: 120 + c * dx, y: 80 + r * dy };
      });
    } else if (layoutType === 'tree') {
      const dx = 140, dy = 100;
      vertices.forEach((v, idx) => {
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        newPos[v.id] = { x: 180 + c * dx, y: 80 + r * dy };
      });
    }
    setNodePositions(newPos);
  };

  const currentEvent = events[stepIndex] || {};
  const currentVertices = currentEvent.vertices || vertices;
  const currentEdges = currentEvent.edges || edges;

  // Render SVG Node Graph
  const renderSvgGraph = () => {
    const isDirectedGraph = graphType === 'directed' || graphType === 'dag' || graphType === 'cyclic';

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 700 450"
        className="w-full h-[450px] lg:h-[520px] bg-surface rounded-card border-2 border-borderTheme overflow-hidden cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-muted" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
          </marker>
        </defs>

        {/* Edges */}
        {currentEdges.map((e) => {
          const fromPos = nodePositions[e.from] || { x: 200, y: 200 };
          const toPos = nodePositions[e.to] || { x: 300, y: 300 };
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;

          let strokeColor = '#64748B';
          let strokeWidth = 2;
          let markerId = isDirectedGraph && showDirections ? 'url(#arrow)' : undefined;

          if (e.state === 'tree_edge' || e.state === 'mst') {
            strokeColor = '#10B981'; // Emerald
            strokeWidth = 3.5;
            if (isDirectedGraph && showDirections) markerId = 'url(#arrow-active)';
          } else if (e.state === 'rejected') {
            strokeColor = '#EF4444'; // Red
            strokeWidth = 2;
          } else if (e.state === 'cross_edge' || e.state === 'back_edge') {
            strokeColor = '#3B82F6'; // Blue
            strokeWidth = 2.5;
          }

          return (
            <g key={`edge-${e.id}`}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                markerEnd={markerId}
                className="transition-all duration-300"
              />
              {showWeights && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-12"
                    y="-9"
                    width="24"
                    height="18"
                    rx="4"
                    className="fill-surface stroke-borderTheme"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] font-mono font-bold fill-foreground"
                  >
                    {e.weight}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Vertices */}
        {currentVertices.map((v) => {
          const pos = nodePositions[v.id] || { x: v.x || 200, y: v.y || 200 };

          let fillColor = '#1E293B'; // default dark
          let strokeColor = '#64748B';
          let textColor = '#FFFFFF';

          if (v.state === 'active') {
            fillColor = '#3B82F6'; // active blue
            strokeColor = '#60A5FA';
          } else if (v.state === 'visited') {
            fillColor = '#10B981'; // visited emerald
            strokeColor = '#34D399';
          } else if (v.state === 'completed') {
            fillColor = '#475569'; // completed slate
            strokeColor = '#94A3B8';
          }

          return (
            <g
              key={`node-${v.id}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseDown={() => handleMouseDown(v.id)}
              className="cursor-pointer"
            >
              <circle
                r="20"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="3"
                className="transition-colors duration-200 shadow-md"
              />
              {showLabels && (
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  className="text-xs font-mono font-bold fill-white select-none pointer-events-none"
                >
                  {v.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // Render 4 Live Synchronized Representations
  const renderRepresentation = () => {
    if (activeTab === 'edgelist') {
      const elData = typeof representations.edgeList === 'string'
        ? JSON.parse(representations.edgeList || '[]')
        : (representations.edgeList || []);

      return (
        <Card className="p-4 bg-card border-borderTheme overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Edge List Representation [O(E)]
          </h4>
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-borderTheme text-muted">
                <th className="py-2 px-3">Edge ID</th>
                <th className="py-2 px-3">From Vertex</th>
                <th className="py-2 px-3">To Vertex</th>
                <th className="py-2 px-3">Weight</th>
                <th className="py-2 px-3">Directed</th>
              </tr>
            </thead>
            <tbody>
              {elData.map((edge, idx) => (
                <tr key={idx} className="border-b border-borderTheme/50 hover:bg-surface">
                  <td className="py-2 px-3 font-bold">#{idx}</td>
                  <td className="py-2 px-3">{edge.from}</td>
                  <td className="py-2 px-3">{edge.to}</td>
                  <td className="py-2 px-3 text-primary font-bold">{edge.weight}</td>
                  <td className="py-2 px-3">{edge.directed ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    }

    if (activeTab === 'adjlist') {
      const alData = typeof representations.adjacencyList === 'string'
        ? JSON.parse(representations.adjacencyList || '{}')
        : (representations.adjacencyList || {});

      return (
        <Card className="p-4 bg-card border-borderTheme overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Adjacency List Representation [O(V + E)]
          </h4>
          <div className="space-y-2 font-mono text-xs">
            {Object.entries(alData).map(([u, neighbors]) => (
              <div key={u} className="flex items-center gap-2 p-2 bg-surface rounded border border-borderTheme">
                <span className="w-10 font-bold text-primary">V[{u}]</span>
                <span className="text-muted">➔</span>
                <div className="flex flex-wrap gap-1.5">
                  {neighbors.map((n, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-card rounded border border-borderTheme">
                      {n.to} <span className="text-muted">(w: {n.weight})</span>
                    </span>
                  ))}
                  {neighbors.length === 0 && <span className="text-muted italic">No outgoing edges</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    if (activeTab === 'adjmatrix') {
      const amData = typeof representations.adjacencyMatrix === 'string'
        ? JSON.parse(representations.adjacencyMatrix || '[]')
        : (representations.adjacencyMatrix || []);

      return (
        <Card className="p-4 bg-card border-borderTheme overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Adjacency Matrix Representation [O(V²)]
          </h4>
          <table className="w-full text-center text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-borderTheme text-muted">
                <th className="p-2">U \ V</th>
                {amData.map((_, idx) => (
                  <th key={idx} className="p-2">V{idx}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {amData.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-borderTheme/50">
                  <td className="p-2 font-bold text-muted border-r border-borderTheme">V{rIdx}</td>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-2 font-bold ${val > 0 ? 'bg-primary/10 text-primary' : 'text-muted'}`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    }

    if (activeTab === 'incmatrix') {
      const imData = typeof representations.incidenceMatrix === 'string'
        ? JSON.parse(representations.incidenceMatrix || '[]')
        : (representations.incidenceMatrix || []);

      return (
        <Card className="p-4 bg-card border-borderTheme overflow-x-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Incidence Matrix Representation (Vertices × Edges) [O(V·E)]
          </h4>
          <table className="w-full text-center text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-borderTheme text-muted">
                <th className="p-2">V \ E</th>
                {edges.map((_, idx) => (
                  <th key={idx} className="p-2">E{idx}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {imData.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-borderTheme/50">
                  <td className="p-2 font-bold text-muted border-r border-borderTheme">V{rIdx}</td>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-2 font-bold ${val !== 0 ? 'bg-primary/10 text-primary' : 'text-muted'}`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      );
    }

    return null;
  };

  // ---------------------------------------------------------------------------
  // Main Workspace Structure with Right-Hand Studio Side Panel in Full-Screen
  // ---------------------------------------------------------------------------
  const renderSidePanelControls = () => (
    <div className="space-y-4 font-body">
      {/* 1. Graph Type & Algorithm Selector */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Graph Type & Algorithm
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold text-muted block mb-1">Graph Type</label>
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="w-full bg-surface border border-borderTheme rounded px-2.5 py-1.5 text-xs font-semibold"
            >
              <optgroup label="Basic Graphs">
                <option value="undirected">Undirected Graph</option>
                <option value="directed">Directed Graph</option>
                <option value="weighted">Weighted Graph</option>
                <option value="unweighted">Unweighted Graph</option>
              </optgroup>
              <optgroup label="Advanced Graphs">
                <option value="dag">DAG (Acyclic)</option>
                <option value="cyclic">Cyclic Graph</option>
                <option value="bipartite">Bipartite Graph</option>
                <option value="complete">Complete Graph</option>
                <option value="connected">Connected Graph</option>
                <option value="disconnected">Disconnected Graph</option>
                <option value="sparse">Sparse Graph</option>
                <option value="dense">Dense Graph</option>
                <option value="tree">Tree Graph</option>
                <option value="forest">Forest</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted block mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-surface border border-borderTheme rounded px-2.5 py-1.5 text-xs font-semibold"
            >
              <optgroup label="Traversals">
                <option value="bfs">BFS (Breadth-First)</option>
                <option value="dfs">DFS (Depth-First)</option>
                <option value="iterative_dfs">Iterative DFS</option>
                <option value="recursive_dfs">Recursive DFS</option>
              </optgroup>
              <optgroup label="Shortest Path">
                <option value="dijkstra">Dijkstra's Algorithm</option>
                <option value="bellman_ford">Bellman-Ford</option>
              </optgroup>
              <optgroup label="Minimum Spanning Tree">
                <option value="prim">Prim's MST</option>
                <option value="kruskal">Kruskal's MST</option>
              </optgroup>
              <optgroup label="Topological & DAG">
                <option value="kahn">Kahn's Topological Sort</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Start Node Input */}
        <div className="flex items-center gap-2 pt-1">
          <label className="text-[11px] font-bold text-muted shrink-0">Start Node (ID):</label>
          <input
            type="number"
            value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
            className="w-20 bg-surface border border-borderTheme rounded px-2 py-1 text-xs font-mono font-bold"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRunOperation()}
            className="ml-auto"
          >
            Run Algorithm
          </Button>
        </div>
      </Card>

      {/* 2. Representation Switcher */}
      <Card className="p-4 bg-card border-borderTheme space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Synchronized Graph Representations
        </h4>
        <div className="grid grid-cols-5 gap-1 bg-surface p-1 rounded-lg border border-borderTheme">
          {[
            { id: 'canvas', label: 'Canvas', icon: Network },
            { id: 'edgelist', label: 'Edge List', icon: List },
            { id: 'adjlist', label: 'Adj List', icon: FileText },
            { id: 'adjmatrix', label: 'Adj Matrix', icon: Table },
            { id: 'incmatrix', label: 'Inc Matrix', icon: Grid }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-md text-[10px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Auto Layouts & Visual Controls */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Layouts & Visual Controls
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={() => applyLayout('circular')}>
            <Circle className="w-3.5 h-3.5 mr-1" />
            Circular
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout('grid')}>
            <Grid className="w-3.5 h-3.5 mr-1" />
            Grid
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyLayout('tree')}>
            <Layout className="w-3.5 h-3.5 mr-1" />
            Tree
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-borderTheme text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-muted font-semibold">
            <input
              type="checkbox"
              checked={showWeights}
              onChange={(e) => setShowWeights(e.target.checked)}
              className="accent-primary"
            />
            Show Weights
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-muted font-semibold">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="accent-primary"
            />
            Show Labels
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-muted font-semibold">
            <input
              type="checkbox"
              checked={showDirections}
              onChange={(e) => setShowDirections(e.target.checked)}
              className="accent-primary"
            />
            Arrows
          </label>
        </div>
      </Card>
    </div>
  );

  return (
    <div
      ref={canvasContainerRef}
      className={`font-body transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none p-4 bg-card flex flex-col justify-between h-screen w-screen overflow-hidden'
          : 'space-y-4'
      }`}
    >
      {/* Top Bar with View Switcher, Graph Type Dropdown (in fullscreen) & Layout Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card border-2 border-borderTheme rounded-card p-3 shadow-soft shrink-0">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            {isFullscreen ? 'C++ Native Graph Studio (Full Screen)' : 'C++ Native Graph Engine Canvas'}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
            |V|={vertices.length} |E|={edges.length}
          </span>
        </div>

        {/* In Full-Screen: Allow switching Graph Type directly from Header! */}
        {isFullscreen && setGraphType && (
          <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-lg border border-borderTheme">
            <span className="text-xs font-semibold text-muted">Graph Type:</span>
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="bg-background border border-borderTheme rounded px-2 py-0.5 text-xs font-heading font-bold text-primary focus:outline-none"
            >
              {Object.entries(GRAPH_TYPE_METADATA || {}).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.name || key}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Representation Switcher Tabs */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-borderTheme flex-wrap">
          <Button
            variant={activeTab === 'canvas' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('canvas')}
            className="text-xs py-1"
          >
            <Network className="w-3.5 h-3.5 mr-1" />
            Visual Canvas
          </Button>
          <Button
            variant={activeTab === 'edgelist' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('edgelist')}
            className="text-xs py-1"
          >
            <List className="w-3.5 h-3.5 mr-1" />
            Edge List
          </Button>
          <Button
            variant={activeTab === 'adjlist' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('adjlist')}
            className="text-xs py-1"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Adjacency List
          </Button>
          <Button
            variant={activeTab === 'adjmatrix' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('adjmatrix')}
            className="text-xs py-1"
          >
            <Table className="w-3.5 h-3.5 mr-1" />
            Adjacency Matrix
          </Button>
          <Button
            variant={activeTab === 'incmatrix' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('incmatrix')}
            className="text-xs py-1"
          >
            <Table className="w-3.5 h-3.5 mr-1" />
            Incidence Matrix
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isFullscreen && (
            <Button
              variant={showFullControls ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFullControls(!showFullControls)}
              title="Toggle Studio Controls Panel"
            >
              {showFullControls ? <PanelRightClose className="w-4 h-4 mr-1" /> : <PanelRightOpen className="w-4 h-4 mr-1" />}
              <span>{showFullControls ? 'Hide Controls' : 'Show Controls'}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Studio'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 mr-1.5 text-primary" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-1.5 text-primary" />
                <span>Full Screen Studio</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Workspace: Left Canvas + Right Studio Panel (when in Full-Screen) */}
      <div className={`w-full flex-1 overflow-hidden flex ${isFullscreen ? 'flex-row' : 'flex-col'} relative gap-4`}>
        {/* Left Side: Specific Inputs Bar + Canvas + Playback Bar (in full screen) */}
        <div className="flex-1 h-full flex flex-col justify-between overflow-hidden gap-3">
          {/* Specific Inputs Box & Live Output Line Bar right at the top of the canvas! */}
          <GraphSpecificInputsAndOutput
            algorithm={algorithm}
            startNode={startNode}
            setStartNode={setStartNode}
            targetNode={targetNode}
            setTargetNode={setTargetNode}
            kValue={kValue}
            setKValue={setKValue}
            onRunOperation={onRunOperation}
            events={events}
            stepIndex={stepIndex}
            statistics={statistics}
            vertices={vertices}
            edges={edges}
          />

          {/* SVG Graph / Representation Table */}
          <div className="flex-1 w-full overflow-hidden flex items-center justify-center">
            {activeTab === 'canvas' ? renderSvgGraph() : renderRepresentation()}
          </div>

          {/* Embedded Playback Bar at the bottom of the canvas in Full-Screen Mode */}
          {isFullscreen && (
            <div className="shrink-0 pt-2">
              <GraphPlaybackBar
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

        {/* Right Studio Panel (in Full-Screen mode when showFullControls is true) */}
        {isFullscreen && showFullControls && renderFullScreenStudioPanel()}
      </div>
    </div>
  );
};

export default GraphCanvas;
