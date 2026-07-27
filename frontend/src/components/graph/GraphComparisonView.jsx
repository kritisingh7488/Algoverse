import React, { useState, useEffect } from 'react';
import { GitFork, ArrowLeft, CheckCircle2, XCircle, Briefcase, Trophy, Sliders, CheckSquare, Square, RefreshCw, BarChart2, Activity, ShieldCheck, Layers } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

export const GraphComparisonView = ({
  graphType = 'undirected',
  onBackToSingle
}) => {
  const [activeGraphType, setActiveGraphType] = useState(graphType);
  const [selectedAlgos, setSelectedAlgos] = useState(['bfs', 'dfs', 'dijkstra', 'prim']);
  const [startNode, setStartNode] = useState(0);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [summaryTab, setSummaryTab] = useState('types');
  const [algoCategoryFilter, setAlgoCategoryFilter] = useState('All');

  // Complete Metadata for all 14 Graph Types
  const ALL_14_GRAPH_TYPES = [
    { key: 'undirected', name: 'Undirected', symmetry: 'Symmetric (u ↔ v)', weight: 'Unweighted/Default', cycles: 'Yes', edgeCount: 'O(V + E)', bestFor: 'Social networks, connectivity, mutual links' },
    { key: 'directed', name: 'Directed (Digraph)', symmetry: 'Oriented (u → v)', weight: 'Unweighted/Default', cycles: 'Yes', edgeCount: 'O(V + E)', bestFor: 'Web links, dependency graphs, road networks' },
    { key: 'weighted', name: 'Weighted', symmetry: 'Either', weight: 'Weighted edges', cycles: 'Yes', edgeCount: 'O(V + E)', bestFor: 'Dijkstra shortest path, MST, network routing' },
    { key: 'unweighted', name: 'Unweighted', symmetry: 'Either', weight: 'Uniform wt = 1', cycles: 'Yes', edgeCount: 'O(V + E)', bestFor: 'BFS shortest path, level traversal' },
    { key: 'dag', name: 'DAG', symmetry: 'Oriented (u → v)', weight: 'Either', cycles: 'Acyclic (No cycles)', edgeCount: 'O(V + E)', bestFor: 'Topological sort, task scheduling, build pipelines' },
    { key: 'cyclic', name: 'Cyclic', symmetry: 'Either', weight: 'Either', cycles: 'Guaranteed Cycles', edgeCount: 'O(V + E)', bestFor: 'Cycle detection algorithms, deadlock checking' },
    { key: 'bipartite', name: 'Bipartite', symmetry: 'Undirected', weight: 'Unweighted', cycles: 'Even Cycles Only', edgeCount: 'O(V₁ · V₂)', bestFor: '2-Coloring, matching problems, job assignments' },
    { key: 'complete', name: 'Complete (Kn)', symmetry: 'Undirected', weight: 'Either', cycles: 'Yes', edgeCount: 'E = V(V-1)/2', bestFor: 'TSP Hamiltonian cycles, dense graph benchmarks' },
    { key: 'connected', name: 'Connected', symmetry: 'Undirected', weight: 'Either', cycles: 'Yes', edgeCount: 'E ≥ V - 1', bestFor: 'Ensures single connected component for MST' },
    { key: 'disconnected', name: 'Disconnected', symmetry: 'Undirected', weight: 'Either', cycles: 'Yes', edgeCount: 'Multi Components', bestFor: 'Connected components, multi-source BFS' },
    { key: 'sparse', name: 'Sparse', symmetry: 'Either', weight: 'Either', cycles: 'Yes', edgeCount: 'E ≈ O(V)', bestFor: 'Adjacency list efficiency, Kruskal MST' },
    { key: 'dense', name: 'Dense', symmetry: 'Either', weight: 'Either', cycles: 'Yes', edgeCount: 'E ≈ O(V²)', bestFor: 'Adjacency matrix efficiency, Prim MST, Floyd-Warshall' },
    { key: 'tree', name: 'Tree Graph', symmetry: 'Undirected', weight: 'Either', cycles: 'Acyclic (0 cycles)', edgeCount: 'E = V - 1', bestFor: 'Hierarchical data, unique path between vertices' },
    { key: 'forest', name: 'Forest Graph', symmetry: 'Undirected', weight: 'Either', cycles: 'Acyclic (0 cycles)', edgeCount: 'E < V - 1', bestFor: 'Union-Find disjoint sets, independent trees' }
  ];

  // Complete Metadata for all 40+ Algorithms
  const FULL_ALGO_METADATA = {
    // Traversals
    bfs: { name: 'Breadth-First Search (BFS)', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Shortest path in unweighted graphs', color: '#3B82F6' },
    dfs: { name: 'Depth-First Search (DFS)', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Cycle detection, topological ordering', color: '#10B981' },
    iterative_dfs: { name: 'Iterative DFS (Explicit Stack)', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Deep trees without call-stack overflow', color: '#059669' },
    recursive_dfs: { name: 'Recursive DFS', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Backtracking and natural recursion', color: '#34D399' },
    multi_source_bfs: { name: 'Multi-Source BFS', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Simultaneous diffusion from multiple sources', color: '#60A5FA' },
    level_order_bfs: { name: 'Level-Order BFS', category: 'Traversal', time: 'O(V + E)', space: 'O(V)', bestFor: 'Layer-by-layer graph leveling', color: '#2563EB' },

    // Shortest Path
    dijkstra: { name: "Dijkstra's Algorithm", category: 'Shortest Path', time: 'O((V + E) log V)', space: 'O(V)', bestFor: 'Non-negative weighted shortest paths', color: '#8B5CF6' },
    bellman_ford: { name: 'Bellman-Ford Algorithm', category: 'Shortest Path', time: 'O(V · E)', space: 'O(V)', bestFor: 'Graphs with negative weight edges', color: '#F59E0B' },
    floyd_warshall: { name: 'Floyd-Warshall (APSP)', category: 'Shortest Path', time: 'O(V³)', space: 'O(V²)', bestFor: 'All-pairs shortest paths on dense graphs', color: '#D97706' },
    johnson: { name: "Johnson's Algorithm (APSP)", category: 'Shortest Path', time: 'O(V² log V + V·E)', space: 'O(V²)', bestFor: 'All-pairs shortest paths on sparse graphs', color: '#B45309' },
    astar: { name: 'A* Search Algorithm', category: 'Shortest Path', time: 'O((V + E) log V)', space: 'O(V)', bestFor: 'Heuristically guided shortest path', color: '#7C3AED' },
    bidirectional: { name: 'Bidirectional Search', category: 'Shortest Path', time: 'O(b^(d/2))', space: 'O(b^(d/2))', bestFor: 'Fast point-to-point unweighted search', color: '#A78BFA' },

    // Minimum Spanning Tree
    prim: { name: "Prim's MST", category: 'Minimum Spanning Tree', time: 'O((V + E) log V)', space: 'O(V)', bestFor: 'Dense graphs MST construction', color: '#EC4899' },
    kruskal: { name: "Kruskal's MST", category: 'Minimum Spanning Tree', time: 'O(E log E)', space: 'O(V)', bestFor: 'Sparse graphs MST construction', color: '#06B6D4' },
    boruvka: { name: "Borůvka's MST", category: 'Minimum Spanning Tree', time: 'O(E log V)', space: 'O(V)', bestFor: 'Distributed/parallel MST computation', color: '#0891B2' },

    // Connectivity & SCC
    connected_components: { name: 'Connected Components', category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: 'Finding disjoint subgraphs', color: '#14B8A6' },
    kosaraju: { name: "Kosaraju's SCC", category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: 'Two-pass strongly connected components', color: '#0D9488' },
    tarjan_scc: { name: "Tarjan's SCC", category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: 'Single-pass DFS strongly connected components', color: '#0F766E' },
    articulation_points: { name: 'Articulation Points (Cut Vertices)', category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: 'Network vulnerability & single points of failure', color: '#F97316' },
    bridges: { name: 'Bridges (Cut Edges)', category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: 'Critical network connections', color: '#EA580C' },
    biconnected_components: { name: 'Biconnected Components', category: 'Connectivity', time: 'O(V + E)', space: 'O(V)', bestFor: '2-edge-connected network blocks', color: '#C2410C' },

    // Cycle Detection
    dfs_cycle: { name: 'DFS Cycle Detection', category: 'Cycle Detection', time: 'O(V + E)', space: 'O(V)', bestFor: 'Back-edge detection in directed/undirected graphs', color: '#EF4444' },
    union_find_cycle: { name: 'Union-Find Cycle Detection', category: 'Cycle Detection', time: 'O(E α(V))', space: 'O(V)', bestFor: 'Undirected graph cycle checking via DSU', color: '#DC2626' },
    directed_cycle: { name: 'Directed Cycle Detection', category: 'Cycle Detection', time: 'O(V + E)', space: 'O(V)', bestFor: '3-color DFS recursion stack cycle detection', color: '#B91C1C' },

    // Topological Sort
    kahn: { name: "Kahn's Topological Sort", category: 'Topological Sort', time: 'O(V + E)', space: 'O(V)', bestFor: 'In-degree queue DAG ordering', color: '#6366F1' },
    dfs_topo: { name: 'DFS Topological Sort', category: 'Topological Sort', time: 'O(V + E)', space: 'O(V)', bestFor: 'Post-order reverse stack DAG ordering', color: '#4F46E5' },

    // Network Flow & Matching
    ford_fulkerson: { name: 'Ford-Fulkerson Max Flow', category: 'Flow & Matching', time: 'O(E · |f*|)', space: 'O(V)', bestFor: 'Augmenting paths max network flow', color: '#3B82F6' },
    edmonds_karp: { name: 'Edmonds-Karp Max Flow', category: 'Flow & Matching', time: 'O(V · E²)', space: 'O(V)', bestFor: 'BFS-based polynomial max flow', color: '#2563EB' },
    dinic: { name: "Dinic's Algorithm", category: 'Flow & Matching', time: 'O(V² · E)', space: 'O(V)', bestFor: 'Level graph blocking flow optimization', color: '#1D4ED8' },
    bipartite_matching: { name: 'Bipartite Matching', category: 'Flow & Matching', time: 'O(V · E)', space: 'O(V)', bestFor: 'Maximum cardinality bipartite matching', color: '#1E40AF' },
    hopcroft_karp: { name: 'Hopcroft-Karp Matching', category: 'Flow & Matching', time: 'O(E √V)', space: 'O(V)', bestFor: 'Optimal bipartite matching', color: '#1E3A8A' },

    // Disjoint Set Union
    make_set: { name: 'DSU Make-Set', category: 'Disjoint Set Union', time: 'O(1)', space: 'O(V)', bestFor: 'Initializing singleton sets', color: '#06B6D4' },
    find_set: { name: 'DSU Find-Set', category: 'Disjoint Set Union', time: 'O(α(V))', space: 'O(1)', bestFor: 'Finding set representative with path compression', color: '#0891B2' },
    union_set: { name: 'DSU Union-Set', category: 'Disjoint Set Union', time: 'O(α(V))', space: 'O(1)', bestFor: 'Merging two disjoint components', color: '#0E7490' },
    path_compression: { name: 'DSU Path Compression Demo', category: 'Disjoint Set Union', time: 'O(α(V))', space: 'O(V)', bestFor: 'Flattening parent pointers during lookup', color: '#155E75' },
    union_by_rank: { name: 'DSU Union by Rank Demo', category: 'Disjoint Set Union', time: 'O(α(V))', space: 'O(V)', bestFor: 'Attaching smaller rank tree under larger rank tree', color: '#164E63' },
    union_by_size: { name: 'DSU Union by Size Demo', category: 'Disjoint Set Union', time: 'O(α(V))', space: 'O(V)', bestFor: 'Attaching smaller size tree under larger size tree', color: '#083344' },

    // Graph Coloring
    greedy_coloring: { name: 'Greedy Graph Coloring', category: 'Graph Coloring', time: 'O(V² + E)', space: 'O(V)', bestFor: 'Fast heuristic vertex coloring', color: '#EC4899' },
    welsh_powell: { name: 'Welsh-Powell Coloring', category: 'Graph Coloring', time: 'O(V log V + E)', space: 'O(V)', bestFor: 'Degree-sorted coloring heuristic', color: '#DB2777' },

    // Clique & Independent Set
    max_clique: { name: 'Maximum Clique (Bron-Kerbosch)', category: 'Clique & Set', time: 'O(3^(V/3))', space: 'O(V)', bestFor: 'Finding largest fully connected subgraphs', color: '#8B5CF6' },
    independent_set: { name: 'Maximum Independent Set', category: 'Clique & Set', time: 'O(3^(V/3))', space: 'O(V)', bestFor: 'Finding largest mutually non-adjacent vertex set', color: '#7C3AED' },
    vertex_cover: { name: 'Minimum Vertex Cover', category: 'Clique & Set', time: 'O(2^V)', space: 'O(V)', bestFor: 'Finding smallest vertex set covering all edges', color: '#6D28D9' },

    // Euler & Hamilton
    euler_path: { name: 'Eulerian Path (Hierholzer)', category: 'Euler & Hamilton', time: 'O(V + E)', space: 'O(V + E)', bestFor: 'Path visiting every edge exactly once', color: '#10B981' },
    euler_circuit: { name: 'Eulerian Circuit', category: 'Euler & Hamilton', time: 'O(V + E)', space: 'O(V + E)', bestFor: 'Closed tour visiting every edge exactly once', color: '#059669' },
    hamiltonian_path: { name: 'Hamiltonian Path', category: 'Euler & Hamilton', time: 'O(N² 2^N)', space: 'O(N 2^N)', bestFor: 'Path visiting every vertex exactly once', color: '#047857' },
    hamiltonian_cycle: { name: 'Hamiltonian Cycle (TSP)', category: 'Euler & Hamilton', time: 'O(N² 2^N)', space: 'O(N 2^N)', bestFor: 'Closed cycle visiting every vertex exactly once', color: '#065F46' },

    // Heuristics / AI
    greedy_best_first: { name: 'Greedy Best-First Search', category: 'Heuristics & AI', time: 'O((V + E) log V)', space: 'O(V)', bestFor: 'Fast heuristic target pursuit', color: '#F59E0B' }
  };

  const CATEGORIES = [
    'All',
    'Traversal',
    'Shortest Path',
    'Minimum Spanning Tree',
    'Connectivity',
    'Cycle Detection',
    'Topological Sort',
    'Flow & Matching',
    'Disjoint Set Union',
    'Graph Coloring',
    'Clique & Set',
    'Euler & Hamilton',
    'Heuristics & AI'
  ];

  useEffect(() => {
    fetchComparisonData();
  }, [activeGraphType, selectedAlgos, startNode]);

  const fetchComparisonData = async () => {
    if (selectedAlgos.length === 0) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const promises = selectedAlgos.map((algo) =>
        api.post('/graph/run', {
          graphType: activeGraphType,
          algorithm: algo,
          startNode
        }).then(res => ({ algo, data: res.data?.data }))
      );

      const resArray = await Promise.all(promises);
      const newMap = {};
      resArray.forEach(({ algo, data }) => {
        if (data) newMap[algo] = data;
      });
      setResults(newMap);
    } catch (err) {
      console.error('Graph Comparison fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAlgo = (key) => {
    if (selectedAlgos.includes(key)) {
      if (selectedAlgos.length > 1) {
        setSelectedAlgos(selectedAlgos.filter((k) => k !== key));
      }
    } else {
      setSelectedAlgos([...selectedAlgos, key]);
    }
  };

  const renderMiniGraph = (data, colorHex) => {
    const verts = data?.vertices || [];
    const edges = data?.edges || [];
    if (verts.length === 0) {
      return (
        <div className="h-32 flex items-center justify-center text-xs text-muted italic border border-borderTheme rounded-xl bg-surface/50">
          No Graph Data
        </div>
      );
    }

    return (
      <svg viewBox="0 0 600 360" className="w-full h-32 bg-surface/80 rounded-xl border border-borderTheme overflow-hidden">
        {edges.map((e, idx) => {
          const fromV = verts.find((v) => v.id === e.from) || { x: 200, y: 150 };
          const toV = verts.find((v) => v.id === e.to) || { x: 400, y: 250 };
          const isMstOrTree = e.state === 'tree_edge' || e.state === 'mst';
          return (
            <line
              key={idx}
              x1={fromV.x}
              y1={fromV.y}
              x2={toV.x}
              y2={toV.y}
              stroke={isMstOrTree ? colorHex : '#64748B'}
              strokeWidth={isMstOrTree ? 3 : 1.5}
            />
          );
        })}
        {verts.map((v, idx) => (
          <g key={idx} transform={`translate(${v.x}, ${v.y})`}>
            <circle r="14" fill="#1E293B" stroke={colorHex} strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
              {v.label}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const filteredAlgorithms = Object.entries(FULL_ALGO_METADATA).filter(([, meta]) => {
    if (algoCategoryFilter === 'All') return true;
    return meta.category === algoCategoryFilter;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border-2 border-borderTheme rounded-card p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBackToSingle}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Interactive Canvas
          </Button>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Graph Architecture & Algorithm Comparison Studio
            </h2>
            <p className="text-xs text-muted">
              Simultaneous C++ native execution comparing performance across all <span className="font-bold text-primary">14 Graph Types</span> and <span className="font-bold text-primary">40+ Algorithms</span>.
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={fetchComparisonData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Benchmarks
        </Button>
      </div>

      {/* 1. All 14 Graph Types Switcher Bar */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-primary" />
            1. Select Graph Type for C++ Benchmark (All 14 Graph Types Supported)
          </h4>
          <span className="text-xs font-mono text-primary font-bold uppercase bg-primary/10 px-2.5 py-0.5 rounded-full">
            Active: {activeGraphType}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_14_GRAPH_TYPES.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGraphType(g.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeGraphType === g.key
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-surface text-muted hover:text-foreground border-borderTheme'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </Card>

      {/* 2. Algorithm Selection with Category Filters */}
      <Card className="p-4 bg-card border-borderTheme space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-primary" />
            2. Select Algorithms to Compare ({selectedAlgos.length} Active)
          </h4>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setAlgoCategoryFilter(cat)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  algoCategoryFilter === cat
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted hover:text-foreground bg-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pt-1">
          {filteredAlgorithms.map(([key, meta]) => {
            const isSel = selectedAlgos.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleAlgo(key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-surface border-borderTheme text-muted hover:text-foreground'
                }`}
              >
                {isSel ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                <span>{meta.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {selectedAlgos.map((key) => {
          const meta = FULL_ALGO_METADATA[key] || { name: key, category: 'General', time: 'O(V + E)', space: 'O(V)', color: '#3B82F6', bestFor: 'Algorithm benchmark' };
          const data = results[key];
          const stats = data?.statistics || {};

          return (
            <Card key={key} className="p-4 bg-card border-borderTheme flex flex-col justify-between space-y-4 shadow-soft">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-borderTheme mb-3">
                  <h3 className="text-sm font-bold text-foreground">{meta.name}</h3>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                </div>
                <p className="text-xs text-muted mb-3">{meta.bestFor}</p>

                {/* Mini SVG Preview */}
                {renderMiniGraph(data, meta.color)}

                {/* Comparative Metrics Table */}
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-borderTheme/50">
                    <span className="text-muted">C++ Engine Runtime:</span>
                    <span className="font-bold text-primary">{stats.runtimeMs !== undefined ? `${stats.runtimeMs} ms` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-borderTheme/50">
                    <span className="text-muted">Relaxations / Updates:</span>
                    <span className="font-bold text-foreground">{stats.relaxationsCount || 0}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-borderTheme/50">
                    <span className="text-muted">Queue / Stack Operations:</span>
                    <span className="font-bold text-foreground">{(stats.queueOpsCount || 0) + (stats.stackOpsCount || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-borderTheme/50">
                    <span className="text-muted">Edges in Result / MST:</span>
                    <span className="font-bold text-emerald-500">
                      {data?.events?.[data?.events?.length - 1]?.mstCost > 0
                        ? `Cost: ${data?.events?.[data?.events?.length - 1]?.mstCost}`
                        : `${stats.edgesCount || 0} edges`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted">Memory Allocated:</span>
                    <span className="font-bold text-foreground">{stats.memoryUsedBytes ? `${stats.memoryUsedBytes} B` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-borderTheme flex items-center justify-between text-[11px] text-muted">
                <span>Category: <strong className="text-foreground">{meta.category}</strong></span>
                <span className="font-mono text-primary font-bold">{meta.time}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. SUMMARY & COMPARATIVE ANALYSIS TABLES (14 Graph Types & Selected Algorithms) */}
      <Card className="p-5 bg-card border-2 border-borderTheme space-y-4 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-borderTheme">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Graph Architecture & Algorithm Benchmark Summary Table
              </h3>
              <p className="text-xs text-muted">
                Comprehensive comparative reference across all 14 Graph Types and live C++ algorithm performance metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-borderTheme">
            <button
              onClick={() => setSummaryTab('types')}
              className={`text-xs px-3 py-1 rounded font-bold transition-colors ${
                summaryTab === 'types'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              14 Graph Types Reference Table
            </button>
            <button
              onClick={() => setSummaryTab('algorithms')}
              className={`text-xs px-3 py-1 rounded font-bold transition-colors ${
                summaryTab === 'algorithms'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Live Algorithm Benchmark ({selectedAlgos.length})
            </button>
          </div>
        </div>

        {summaryTab === 'types' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body">
              <thead>
                <tr className="border-b-2 border-borderTheme text-[11px] font-bold text-muted uppercase tracking-wider bg-surface/60">
                  <th className="py-2.5 px-3">Graph Type</th>
                  <th className="py-2.5 px-3">Symmetry</th>
                  <th className="py-2.5 px-3">Edge Weight</th>
                  <th className="py-2.5 px-3">Cycles</th>
                  <th className="py-2.5 px-3">Edge Complexity</th>
                  <th className="py-2.5 px-3">Best Applications & Properties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderTheme/50 text-xs">
                {ALL_14_GRAPH_TYPES.map((g) => {
                  const isCurrent = activeGraphType === g.key;
                  return (
                    <tr
                      key={g.key}
                      onClick={() => setActiveGraphType(g.key)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-primary/10 font-medium' : 'hover:bg-surface/50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-2">
                        {g.name}
                        {isCurrent && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-mono uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-muted">{g.symmetry}</td>
                      <td className="py-2.5 px-3 text-muted">{g.weight}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            g.cycles.includes('Acyclic') || g.cycles === 'No'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {g.cycles}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">{g.edgeCount}</td>
                      <td className="py-2.5 px-3 text-muted">{g.bestFor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body">
              <thead>
                <tr className="border-b-2 border-borderTheme text-[11px] font-bold text-muted uppercase tracking-wider bg-surface/60">
                  <th className="py-2.5 px-3">Algorithm</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Time Complexity</th>
                  <th className="py-2.5 px-3">Space Complexity</th>
                  <th className="py-2.5 px-3">C++ Runtime</th>
                  <th className="py-2.5 px-3">Relaxations / Updates</th>
                  <th className="py-2.5 px-3">Queue / Stack Ops</th>
                  <th className="py-2.5 px-3">Memory Allocated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderTheme/50 text-xs">
                {selectedAlgos.map((algoKey) => {
                  const meta = FULL_ALGO_METADATA[algoKey] || { name: algoKey, category: 'General', time: 'O(V + E)', space: 'O(V)', color: '#3B82F6' };
                  const res = results[algoKey];
                  const stats = res?.statistics || {};
                  return (
                    <tr key={algoKey} className="hover:bg-surface/50">
                      <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                        {meta.name}
                      </td>
                      <td className="py-2.5 px-3 text-muted">{meta.category}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">{meta.time}</td>
                      <td className="py-2.5 px-3 font-mono text-muted">{meta.space}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                        {stats.runtimeMs !== undefined ? `${stats.runtimeMs} ms` : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-foreground">{stats.relaxationsCount || 0}</td>
                      <td className="py-2.5 px-3 font-mono text-foreground">
                        {(stats.queueOpsCount || 0) + (stats.stackOpsCount || 0)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-foreground">
                        {stats.memoryUsedBytes ? `${stats.memoryUsedBytes} B` : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GraphComparisonView;
