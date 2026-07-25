import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Code, 
  Activity, 
  Layers, 
  Sparkles,
  ArrowRight,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const GRAPH_ALGORITHMS = {
  bfs: {
    name: 'Breadth First Search (BFS)',
    category: 'Traversal',
    best: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'queue = [startNode]',
      'visited[startNode] = true',
      'while queue is not empty:',
      '  curr = queue.pop()',
      '  for neighbor of curr:',
      '    if not visited[neighbor]:',
      '      visited[neighbor] = true',
      '      queue.push(neighbor)'
    ],
    intuition: 'Explores graph level-by-level using a FIFO queue. Guarantees shortest path in unweighted graphs.',
    mistakes: 'Forgetting to mark nodes as visited when pushing to the queue, causing infinite loops in cyclic graphs.',
    interviewTip: 'BFS is ideal for finding shortest path in unweighted graphs and minimum knight moves on a chessboard.'
  },
  dfs: {
    name: 'Depth First Search (DFS)',
    category: 'Traversal',
    best: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function dfs(node):',
      '  visited[node] = true',
      '  for neighbor of node:',
      '    if not visited[neighbor]:',
      '      dfs(neighbor)'
    ],
    intuition: 'Explores as far as possible along each branch before backtracking using a call stack or explicit stack.',
    mistakes: 'Exceeding recursion stack limits on deep linear graphs; use iterative stack for high depth.',
    interviewTip: 'DFS is used for topological sorting, connected components, cycle detection, and maze pathfinding.'
  },
  dijkstra: {
    name: 'Dijkstra Shortest Path',
    category: 'Shortest Path',
    best: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'dist[all] = infinity, dist[source] = 0',
      'pq = [(0, source)]',
      'while pq is not empty:',
      '  (d, u) = pq.popMin()',
      '  for (v, weight) of neighbors(u):',
      '    if dist[u] + weight < dist[v]:',
      '      dist[v] = dist[u] + weight',
      '      pq.push((dist[v], v))'
    ],
    intuition: 'Greedily selects the unvisited node with smallest tentative distance and relaxes outgoing edges.',
    mistakes: 'Fails on graphs with negative edge weights; use Bellman-Ford algorithm instead.',
    interviewTip: 'Using a min-priority queue (binary heap) reduces distance lookup and relaxation time to O((V + E) log V).'
  }
};

const GraphLab = () => {
  const [algoKey, setAlgoKey] = useState('bfs');
  const [nodes, setNodes] = useState([
    { id: 'A', x: 120, y: 80 },
    { id: 'B', x: 260, y: 60 },
    { id: 'C', x: 140, y: 220 },
    { id: 'D', x: 320, y: 200 },
    { id: 'E', x: 440, y: 120 }
  ]);

  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 3 }
  ]);

  const [newFrom, setNewFrom] = useState('A');
  const [newTo, setNewTo] = useState('E');
  const [newWeight, setNewWeight] = useState(2);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  // Visualizer step states
  const [currNode, setCurrNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [activeEdge, setActiveEdge] = useState(null);
  const [queueState, setQueueState] = useState([]);
  const [distTable, setDistTable] = useState({});
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [desc, setDesc] = useState('');

  const currentSpec = GRAPH_ALGORITHMS[algoKey];

  // Adjacency Builder
  const getAdj = () => {
    let adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      if (!adj[e.from]) adj[e.from] = [];
      adj[e.from].push({ node: e.to, weight: e.weight });
    });
    return adj;
  };

  // Step Generators
  const generateBFSEvents = () => {
    let steps = [];
    let visited = new Set(['A']);
    let queue = ['A'];
    let adj = getAdj();

    steps.push({
      curr: 'A', visited: ['A'], queue: ['A'], activeEdge: null, line: 0,
      desc: 'Initialized BFS from source Node A into FIFO queue.'
    });

    while (queue.length > 0) {
      const u = queue.shift();
      steps.push({
        curr: u, visited: Array.from(visited), queue: [...queue], activeEdge: null, line: 3,
        desc: `Popped Node ${u} from queue for exploration.`
      });

      const neighbors = adj[u] || [];
      for (const edge of neighbors) {
        const v = edge.node;
        steps.push({
          curr: u, visited: Array.from(visited), queue: [...queue], activeEdge: `${u}-${v}`, line: 4,
          desc: `Inspecting edge ${u} -> ${v} (weight ${edge.weight}).`
        });

        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
          steps.push({
            curr: v, visited: Array.from(visited), queue: [...queue], activeEdge: `${u}-${v}`, line: 7,
            desc: `Node ${v} marked as visited and pushed to queue.`
          });
        }
      }
    }

    steps.push({
      curr: null, visited: Array.from(visited), queue: [], activeEdge: null, line: 0,
      desc: 'BFS Traversal Completed!'
    });
    return steps;
  };

  const generateDFSEvents = () => {
    let steps = [];
    let visited = new Set();
    let stack = ['A'];
    let adj = getAdj();

    steps.push({
      curr: 'A', visited: [], queue: ['A'], activeEdge: null, line: 0,
      desc: 'Initialized DFS with call stack starting at Node A.'
    });

    const dfs = (u) => {
      visited.add(u);
      steps.push({
        curr: u, visited: Array.from(visited), queue: Array.from(visited), activeEdge: null, line: 1,
        desc: `Visited Node ${u}. Pushed to call stack.`
      });

      const neighbors = adj[u] || [];
      for (const edge of neighbors) {
        const v = edge.node;
        if (!visited.has(v)) {
          steps.push({
            curr: u, visited: Array.from(visited), queue: Array.from(visited), activeEdge: `${u}-${v}`, line: 3,
            desc: `Traversing edge ${u} -> ${v}.`
          });
          dfs(v);
        }
      }
    };

    dfs('A');
    steps.push({
      curr: null, visited: Array.from(visited), queue: [], activeEdge: null, line: 0,
      desc: 'DFS Traversal Completed!'
    });
    return steps;
  };

  const generateDijkstraEvents = () => {
    let steps = [];
    let dist = {};
    nodes.forEach(n => dist[n.id] = Infinity);
    dist['A'] = 0;
    let visited = new Set();
    let adj = getAdj();

    steps.push({
      curr: 'A', visited: [], queue: ['A'], dist: { ...dist }, activeEdge: null, line: 0,
      desc: 'Dijkstra initialized: dist[A] = 0, all other distances = ∞'
    });

    while (visited.size < nodes.length) {
      let u = null;
      let minD = Infinity;
      nodes.forEach(n => {
        if (!visited.has(n.id) && dist[n.id] < minD) {
          minD = dist[n.id];
          u = n.id;
        }
      });

      if (!u || minD === Infinity) break;
      visited.add(u);

      steps.push({
        curr: u, visited: Array.from(visited), queue: Array.from(visited), dist: { ...dist }, activeEdge: null, line: 2,
        desc: `Selected unvisited node ${u} with minimum tentative distance (${dist[u]}).`
      });

      const neighbors = adj[u] || [];
      for (const edge of neighbors) {
        const v = edge.node;
        const weight = edge.weight;

        steps.push({
          curr: u, visited: Array.from(visited), queue: Array.from(visited), dist: { ...dist }, activeEdge: `${u}-${v}`, line: 4,
          desc: `Checking edge ${u} -> ${v} (weight ${weight}).`
        });

        if (dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          steps.push({
            curr: v, visited: Array.from(visited), queue: Array.from(visited), dist: { ...dist }, activeEdge: `${u}-${v}`, line: 5,
            desc: `Relaxed edge! Updated shortest distance to ${v}: dist[${v}] = ${dist[v]}`
          });
        }
      }
    }

    steps.push({
      curr: null, visited: Array.from(visited), queue: [], dist: { ...dist }, activeEdge: null, line: 0,
      desc: 'Dijkstra Shortest Path Completed!'
    });
    return steps;
  };

  useEffect(() => {
    let steps = [];
    if (algoKey === 'bfs') steps = generateBFSEvents();
    else if (algoKey === 'dfs') steps = generateDFSEvents();
    else steps = generateDijkstraEvents();

    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
    if (steps.length > 0) applyStep(steps[0]);
  }, [algoKey, nodes, edges]);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        const next = stepIndex + 1;
        setStepIndex(next);
        applyStep(events[next]);
      }, 700 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const applyStep = (step) => {
    if (!step) return;
    setCurrNode(step.curr);
    setVisitedNodes(step.visited || []);
    setActiveEdge(step.activeEdge);
    setQueueState(step.queue || []);
    setDistTable(step.dist || {});
    setActiveCodeLine(step.line || 0);
    setDesc(step.desc || '');
  };

  const handleAddEdge = () => {
    if (newFrom === newTo) return;
    const exists = edges.some(e => e.from === newFrom && e.to === newTo);
    if (!exists) {
      setEdges([...edges, { from: newFrom, to: newTo, weight: parseInt(newWeight) || 1 }]);
    }
  };

  const handleAddNode = () => {
    const nextChar = String.fromCharCode(65 + nodes.length);
    if (nodes.length < 8) {
      const newNode = {
        id: nextChar,
        x: 100 + (nodes.length * 60) % 360,
        y: 100 + Math.floor(nodes.length / 3) * 80
      };
      setNodes([...nodes, newNode]);
    }
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    setStepIndex(0);
    let steps = [];
    if (algoKey === 'bfs') steps = generateBFSEvents();
    else if (algoKey === 'dfs') steps = generateDFSEvents();
    else steps = generateDijkstraEvents();
    setEvents(steps);
    if (steps.length > 0) applyStep(steps[0]);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Network className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Graph Laboratory</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Visualize graph traversals, shortest paths, and node queue states interactively.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">Queue State:</span>
            <div className="flex gap-1.5 font-mono text-xs">
              {queueState.map((q, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-bold">
                  {q}
                </span>
              ))}
              {queueState.length === 0 && <span className="text-gray-300 font-mono">Empty</span>}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Selector & Graph Builder */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Graph Algorithm</h3>
            <div className="space-y-2">
              {Object.keys(GRAPH_ALGORITHMS).map((key) => {
                const item = GRAPH_ALGORITHMS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setAlgoKey(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      algoKey === key
                        ? 'border-primary bg-primary/5 text-primary font-semibold shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-poppins font-bold">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-mono">{item.best}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block font-inter">{item.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Connect Edge Builder */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Edge Builder</label>
                <button onClick={handleAddNode} className="text-[11px] font-bold text-primary hover:underline">+ Add Node</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select value={newFrom} onChange={e => setNewFrom(e.target.value)} className="px-2 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono">
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
                <select value={newTo} onChange={e => setNewTo(e.target.value)} className="px-2 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono">
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
                <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="W" className="px-2 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono w-full" />
              </div>
              <Button onClick={handleAddEdge} variant="outline" className="w-full py-1.5 text-xs">
                Connect Edge
              </Button>
            </div>
          </div>

          {/* Canvas & Controls */}
          <div className="lg:col-span-6 space-y-6">

            {/* Graph Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[360px] relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CANVAS: {currentSpec.name.toUpperCase()}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Active Node
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Visited
                </span>
              </div>

              {/* SVG Edges and Nodes */}
              <div className="flex-1 relative w-full h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, idx) => {
                    const u = nodes.find((n) => n.id === edge.from);
                    const v = nodes.find((n) => n.id === edge.to);
                    if (!u || !v) return null;

                    const isEdgeActive = activeEdge === `${edge.from}-${edge.to}`;

                    return (
                      <g key={idx}>
                        <line
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          stroke={isEdgeActive ? '#A855F7' : '#E5E7EB'}
                          strokeWidth={isEdgeActive ? '3' : '2'}
                          className="transition-colors duration-300"
                        />
                        <text
                          x={(u.x + v.x) / 2}
                          y={(u.y + v.y) / 2 - 6}
                          fill="#9CA3AF"
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes */}
                {nodes.map((node) => {
                  const isCurrent = currNode === node.id;
                  const isVisited = visitedNodes.includes(node.id);

                  let bgClass = 'bg-white text-primary border-primary';
                  if (isVisited) bgClass = 'bg-blue-50 text-blue-600 border-blue-400';
                  if (isCurrent) bgClass = 'bg-amber-400 text-white border-amber-500 shadow-lg shadow-amber-400/30 scale-110 ring-4 ring-amber-200';

                  return (
                    <motion.div
                      key={node.id}
                      style={{ left: `${node.x - 20}px`, top: `${node.y - 20}px` }}
                      className={`absolute w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all duration-300 ${bgClass}`}
                    >
                      {node.id}
                    </motion.div>
                  );
                })}
              </div>

              {/* Event Description */}
              <div className="text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">
                  {desc || 'Ready to run graph algorithm.'}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => { if (stepIndex > 0) { setStepIndex(stepIndex - 1); applyStep(events[stepIndex - 1]); } }} 
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if (stepIndex < events.length - 1) { setStepIndex(stepIndex + 1); applyStep(events[stepIndex + 1]); } }}
                  disabled={stepIndex >= events.length - 1}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setStepIndex(0); if (events.length > 0) applyStep(events[0]); }}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleRandomize}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                  title="Randomize Events"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      speed === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pseudocode & Specs */}
          <div className="lg:col-span-3 space-y-6">

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1.5 overflow-x-auto">
                {currentSpec.pseudocode.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`px-2 py-1 rounded transition-colors ${
                      activeCodeLine === idx ? 'bg-primary/40 text-white font-bold border-l-2 border-primary' : 'opacity-70'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Intuition & Educational Notes */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <Lightbulb className="w-3.5 h-3.5" /> Conceptual Intuition
              </h3>
              <p className="text-xs text-gray-600 font-inter leading-relaxed">{currentSpec.intuition}</p>
              
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-red-500 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Common Mistake
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentSpec.mistakes}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-emerald-600 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interview Tip
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentSpec.interviewTip}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default GraphLab;
