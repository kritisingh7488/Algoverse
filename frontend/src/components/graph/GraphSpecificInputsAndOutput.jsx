import React from 'react';
import { Sliders, Play, Activity } from 'lucide-react';
import Button from '../common/Button';

export const GraphSpecificInputsAndOutput = ({
  algorithm = 'bfs',
  startNode = 0,
  setStartNode,
  targetNode = 5,
  setTargetNode,
  kValue = 3,
  setKValue,
  onRunOperation,
  events = [],
  stepIndex = 0,
  statistics = {},
  vertices = [],
  edges = []
}) => {
  const algo = (algorithm || 'bfs').toLowerCase();

  const isTargetApplicable = [
    'dijkstra',
    'astar',
    'bidirectional',
    'kth_shortest_path',
    'bellman_ford',
    'ford_fulkerson',
    'edmonds_karp',
    'dinic',
    'bipartite_matching',
    'hopcroft_karp'
  ].includes(algo);

  const isKApplicable = [
    'kth_shortest_path',
    'k_core',
    'greedy_coloring',
    'welsh_powell',
    'max_clique',
    'independent_set',
    'vertex_cover'
  ].includes(algo);

  const computeAlgorithmOutputLine = () => {
    if (!events || events.length === 0) {
      return "No execution events yet. Click 'Run' to generate live C++ output.";
    }

    const currentEvent = events[Math.min(stepIndex, events.length - 1)] || {};

    // 1. Check if there is a direct custom result or message
    if (statistics?.resultText) return statistics.resultText;

    // 2. Traversal Order (BFS, DFS, Kahn, Topological Sort, Euler/Hamilton)
    if ([
      'bfs', 'dfs', 'iterative_dfs', 'recursive_dfs',
      'multi_source_bfs', 'level_order_bfs', 'kahn', 'dfs_topo',
      'euler_path', 'euler_circuit', 'hamiltonian_path', 'hamiltonian_cycle'
    ].includes(algo)) {
      if (currentEvent.sequence && currentEvent.sequence.length > 0) {
        return `Traversal Sequence (${currentEvent.sequence.length} vertices): ` + currentEvent.sequence.map(id => {
          // try to find the label for this id
          const v = vertices.find(v => v.id === id);
          return v && v.label !== String(id) ? `${v.label} (V${id})` : `V${id}`;
        }).join(' → ');
      }
      return `Traversal in progress... (Step ${stepIndex + 1} of ${events.length})`;
    }

    // 3. Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall, A*, Bidirectional, Johnson)
    if ([
      'dijkstra', 'bellman_ford', 'floyd_warshall', 'johnson',
      'astar', 'bidirectional', 'kth_shortest_path'
    ].includes(algo)) {
      if (currentEvent.distances || statistics.distances) {
        const dists = currentEvent.distances || statistics.distances;
        const distStr = Object.entries(dists)
          .map(([id, d]) => `V${id}:${d === Infinity || d > 99999 ? '∞' : d}`)
          .slice(0, 10)
          .join(', ');
        return `Shortest Distances from V${startNode}: [ ${distStr} ]`;
      }
      return `Computing Shortest Paths from V${startNode}... (Step ${stepIndex + 1} of ${events.length})`;
    }

    // 4. Minimum Spanning Tree (Prim, Kruskal, Boruvka)
    if (['prim', 'kruskal', 'boruvka'].includes(algo)) {
      const mstCost = statistics.mstCost !== undefined ? statistics.mstCost : (currentEvent.mstCost || 0);
      const mstEdgesCount = statistics.mstEdgesCount !== undefined ? statistics.mstEdgesCount : 0;
      return `Minimum Spanning Tree Cost: ${mstCost} (${mstEdgesCount || 'Optimal'} Edges Selected)`;
    }

    // 5. Connectivity & SCC (Connected Components, Kosaraju, Tarjan, Bridges, Articulation Points)
    if ([
      'connected_components', 'kosaraju', 'tarjan_scc',
      'articulation_points', 'bridges', 'biconnected_components'
    ].includes(algo)) {
      const count = statistics.componentsCount || statistics.count || currentEvent.componentsCount || 1;
      return `Connectivity Analysis: Found ${count} Component(s) / Critical Point(s)`;
    }

    // 6. Network Flow & Matching (Ford-Fulkerson, Edmonds-Karp, Dinic, Bipartite Matching)
    if (['ford_fulkerson', 'edmonds_karp', 'dinic', 'bipartite_matching', 'hopcroft_karp'].includes(algo)) {
      const val = statistics.maxFlow || statistics.matchingCount || currentEvent.maxFlow || 0;
      return `Max Network Flow / Matching Cardinality: ${val}`;
    }

    // 7. Cycle Detection
    if (['dfs_cycle', 'union_find_cycle', 'directed_cycle'].includes(algo)) {
      const cycleFound = statistics.hasCycle || currentEvent.hasCycle || false;
      return `Cycle Detection Result: ${cycleFound ? 'TRUE (Cycle Detected in Graph)' : 'FALSE (Graph is Acyclic)'}`;
    }

    // 8. Graph Coloring
    if (['greedy_coloring', 'welsh_powell'].includes(algo)) {
      const colors = statistics.chromaticNumber || currentEvent.numColors || 3;
      return `Graph Chromatic Number: χ(G) = ${colors} colors required`;
    }

    // 9. Clique & Independent Set
    if (['max_clique', 'independent_set', 'vertex_cover'].includes(algo)) {
      const sz = statistics.size || currentEvent.size || 1;
      return `Max Clique / Set Size: ${sz} vertices`;
    }

    // Default fallback line
    if (currentEvent.desc || currentEvent.description || currentEvent.msg) {
      return currentEvent.desc || currentEvent.description || currentEvent.msg;
    }
    return `Algorithm ${algo.toUpperCase()} step ${stepIndex + 1} of ${events.length} completed.`;
  };

  return (
    <div className="bg-surface/95 border-2 border-primary/30 rounded-xl p-3 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-body">
      {/* Left: Specific Inputs Box */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-primary flex items-center gap-1 shrink-0">
          <Sliders className="w-3.5 h-3.5" /> Specific Inputs:
        </span>

        {/* Start / Source Vertex Input */}
        <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-borderTheme shadow-xs">
          <span className="text-xs font-semibold text-muted whitespace-nowrap">Start (u):</span>
          <input
            type="number"
            min={0}
            value={startNode}
            onChange={(e) => setStartNode && setStartNode(Number(e.target.value))}
            className="w-12 bg-background border border-borderTheme rounded px-1.5 py-0.5 text-xs font-mono font-bold text-foreground text-center focus:outline-none focus:border-primary"
          />
        </div>

        {/* Target / Sink Vertex Input (where applicable) */}
        {isTargetApplicable && (
          <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-borderTheme shadow-xs">
            <span className="text-xs font-semibold text-muted whitespace-nowrap">Target / Sink (v):</span>
            <input
              type="number"
              min={0}
              value={targetNode}
              onChange={(e) => setTargetNode && setTargetNode(Number(e.target.value))}
              className="w-12 bg-background border border-borderTheme rounded px-1.5 py-0.5 text-xs font-mono font-bold text-foreground text-center focus:outline-none focus:border-primary"
            />
          </div>
        )}

        {/* K Value Input (where applicable) */}
        {isKApplicable && (
          <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-borderTheme shadow-xs">
            <span className="text-xs font-semibold text-muted whitespace-nowrap">k Value:</span>
            <input
              type="number"
              min={1}
              value={kValue}
              onChange={(e) => setKValue && setKValue(Number(e.target.value))}
              className="w-12 bg-background border border-borderTheme rounded px-1.5 py-0.5 text-xs font-mono font-bold text-foreground text-center focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onRunOperation}
          className="text-xs py-1 px-3 shadow-soft font-bold shrink-0"
        >
          <Play className="w-3.5 h-3.5 mr-1" /> Run {algorithm.toUpperCase()}
        </Button>
      </div>

      {/* Right: Live Output Line Bar */}
      <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-lg flex-1 min-w-[240px] shadow-xs">
        <Activity className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span className="text-xs font-mono font-bold text-foreground break-words whitespace-normal">
          Output: {computeAlgorithmOutputLine()}
        </span>
      </div>
    </div>
  );
};

export default GraphSpecificInputsAndOutput;
