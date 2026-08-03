import React, { useState, useEffect } from 'react';
import {
  Network,
  GitFork,
  Shuffle,
  RotateCcw,
  ShieldCheck,
  Code,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Layers,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Upload,
  Database,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

import api from '../../api/axios';

import GraphCanvas from '../../components/graph/GraphCanvas';
import GraphComparisonView from '../../components/graph/GraphComparisonView';
import GraphAutoVerifier from '../../components/graph/GraphAutoVerifier';
import GraphInformationPanel from '../../components/graph/GraphInformationPanel';
import GraphPlaybackBar from '../../components/graph/GraphPlaybackBar';
import GraphSpecificInputsAndOutput from '../../components/graph/GraphSpecificInputsAndOutput';

export const GRAPH_TYPE_METADATA = {
  undirected: {
    name: 'Undirected Graph',
    category: 'Basic Graphs',
    desc: 'Symmetric edges where (u, v) is identical to (v, u). Standard representation for mutual connections.'
  },
  directed: {
    name: 'Directed Graph (Digraph)',
    category: 'Basic Graphs',
    desc: 'Edges have orientation from u to v. Represents one-way transitions or asymmetric relationships.'
  },
  weighted: {
    name: 'Weighted Graph',
    category: 'Basic Graphs',
    desc: 'Edges carry numerical weights representing cost, distance, latency, or capacity.'
  },
  unweighted: {
    name: 'Unweighted Graph',
    category: 'Basic Graphs',
    desc: 'All edges have uniform unit weight of 1. Ideal for BFS shortest paths.'
  },
  dag: {
    name: 'Directed Acyclic Graph (DAG)',
    category: 'Advanced Graphs',
    desc: 'Directed graph with no directed cycles. Foundational for topological sorting and task dependency resolution.'
  },
  cyclic: {
    name: 'Cyclic Graph',
    category: 'Advanced Graphs',
    desc: 'Contains at least one graph cycle where a vertex is reachable from itself along a path.'
  },
  bipartite: {
    name: 'Bipartite Graph',
    category: 'Advanced Graphs',
    desc: 'Vertices can be partitioned into two independent sets U and V such that every edge connects U to V (no odd cycles).'
  },
  complete: {
    name: 'Complete Graph (K_n)',
    category: 'Advanced Graphs',
    desc: 'Every pair of distinct vertices is connected by a unique edge. Density = 100%.'
  },
  connected: {
    name: 'Connected Graph',
    category: 'Advanced Graphs',
    desc: 'There exists a path between every pair of vertices in the graph.'
  },
  disconnected: {
    name: 'Disconnected Graph',
    category: 'Advanced Graphs',
    desc: 'Contains two or more disconnected components with no edges between them.'
  },
  sparse: {
    name: 'Sparse Graph',
    category: 'Advanced Graphs',
    desc: 'Number of edges is close to V. Adjacency lists are asymptotically optimal.'
  },
  dense: {
    name: 'Dense Graph',
    category: 'Advanced Graphs',
    desc: 'Number of edges is close to V^2. Adjacency matrices provide O(1) edge lookup.'
  },
  tree: {
    name: 'Tree Graph',
    category: 'Trees & Forests',
    desc: 'Connected acyclic undirected graph with exactly V - 1 edges.'
  },
  forest: {
    name: 'Forest',
    category: 'Trees & Forests',
    desc: 'Disjoint union of tree graphs. Acyclic but not necessarily connected.'
  }
};

export const ALGORITHM_METADATA = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function BFS(G, start):',
      '  queue = [start]; visited[start] = true',
      '  while queue not empty:',
      '    u = queue.pop_front()',
      '    for v in G.neighbors(u):',
      '      if not visited[v]:',
      '        visited[v] = true; parent[v] = u',
      '        queue.push_back(v)'
    ],
    intuition: 'Explores level by level outward from the source using a FIFO queue.',
    interviewTip: 'Always guarantees shortest path in unweighted graphs!'
  },
  dfs: {
    name: 'Depth-First Search (DFS)',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function DFS(G, u):',
      '  visited[u] = true',
      '  for v in G.neighbors(u):',
      '    if not visited[v]:',
      '      DFS(G, v)'
    ],
    intuition: 'Plunges as deep as possible along each branch before backtracking.',
    interviewTip: 'Used for cycle detection, topological sort, and connected components.'
  },
  iterative_dfs: {
    name: 'Iterative DFS',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function IterativeDFS(G, start):',
      '  stack = [start]; visited[start] = true',
      '  while stack not empty:',
      '    u = stack.pop()',
      '    for v in G.neighbors(u):',
      '      if not visited[v]: stack.push(v)'
    ],
    intuition: 'Uses an explicit LIFO stack instead of recursion call stack.',
    interviewTip: 'Avoids stack overflow on very deep or linear graphs.'
  },
  recursive_dfs: {
    name: 'Recursive DFS',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function RecursiveDFS(u):',
      '  visited[u] = true',
      '  for v in G.neighbors(u):',
      '    if not visited[v]: RecursiveDFS(v)'
    ],
    intuition: 'Standard recursion-based DFS traversal.',
    interviewTip: 'Be mindful of max recursion limit in languages like Python.'
  },
  multi_source_bfs: {
    name: 'Multi-Source BFS',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function MultiSourceBFS(G, sources):',
      '  for s in sources: queue.push(s); dist[s] = 0',
      '  while queue not empty:',
      '    u = queue.pop_front()',
      '    for v in G.neighbors(u):',
      '      if dist[v] == INF: dist[v] = dist[u] + 1'
    ],
    intuition: 'Simultaneously spreads outward from multiple source vertices.',
    interviewTip: 'Optimal for grid shortest distance to nearest obstacle or gate.'
  },
  level_order_bfs: {
    name: 'Level-Order BFS',
    category: 'Traversals',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function LevelOrderBFS(G, start):',
      '  queue = [start]',
      '  while queue not empty:',
      '    levelSize = queue.size()',
      '    for i = 0 to levelSize-1: process queue.pop()'
    ],
    intuition: 'Processes nodes strictly grouped by discrete distance levels.',
    interviewTip: 'Key pattern for tree level-order printing and layer analysis.'
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: 'Shortest Path',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'function Dijkstra(G, source):',
      '  dist[source] = 0; pq.push((0, source))',
      '  while pq not empty:',
      '    d, u = pq.pop_min()',
      '    for (v, w) in G.edges(u):',
      '      if dist[u] + w < dist[v]:',
      '        dist[v] = dist[u] + w; pq.push((dist[v], v))'
    ],
    intuition: 'Greedily relaxes edges using a min-priority queue to find shortest paths.',
    interviewTip: 'Fails with negative edge weights! Use Bellman-Ford for negative weights.'
  },
  bellman_ford: {
    name: 'Bellman-Ford Algorithm',
    category: 'Shortest Path',
    time: 'O(V * E)',
    space: 'O(V)',
    pseudocode: [
      'function BellmanFord(G, source):',
      '  dist[source] = 0',
      '  for i from 1 to V-1:',
      '    for each edge (u, v, w) in G:',
      '      if dist[u] + w < dist[v]: dist[v] = dist[u] + w',
      '  for each edge (u, v, w) in G:',
      '    if dist[u] + w < dist[v]: return "Negative Cycle!"'
    ],
    intuition: 'Relaxes all edges V-1 times. Detects negative weight cycles.',
    interviewTip: 'Handles negative edge weights and identifies arbitrage loops.'
  },
  floyd_warshall: {
    name: 'Floyd-Warshall Algorithm',
    category: 'Shortest Path',
    time: 'O(V³)',
    space: 'O(V²)',
    pseudocode: [
      'function FloydWarshall(G):',
      '  d = initial adjacency weight matrix',
      '  for k = 0 to V-1:',
      '    for i = 0 to V-1:',
      '      for j = 0 to V-1:',
      '        if d[i][k] + d[k][j] < d[i][j]:',
      '          d[i][j] = d[i][k] + d[k][j]'
    ],
    intuition: 'Dynamic programming all-pairs shortest path by trying each vertex k as an intermediate node.',
    interviewTip: 'Great for small graphs (V <= 400) where all-pairs shortest path is required.'
  },
  johnson: {
    name: "Johnson's Algorithm",
    category: 'Shortest Path',
    time: 'O(V² log V + V E)',
    space: 'O(V²)',
    pseudocode: [
      'function Johnson(G):',
      '  add virtual node q connected to all nodes with weight 0',
      '  h = BellmanFord(G, q)',
      '  reweight edges: w\'(u, v) = w(u, v) + h[u] - h[v]',
      '  for each u in V: run Dijkstra on reweighted G'
    ],
    intuition: 'Reweights edges to be non-negative using Bellman-Ford, then runs Dijkstra from all nodes.',
    interviewTip: 'Faster than Floyd-Warshall on sparse graphs!'
  },
  astar: {
    name: 'A* Shortest Path',
    category: 'Shortest Path',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'function AStar(G, start, target):',
      '  pq.push((0 + h(start), start))',
      '  while pq not empty:',
      '    u = pq.pop_min()',
      '    if u == target: return path',
      '    for v in G.neighbors(u): relax with heuristic h(v)'
    ],
    intuition: 'Uses a goal heuristic h(v) to guide Dijkstra search toward the destination.',
    interviewTip: 'Heuristic must be admissible (never overestimate actual cost).'
  },
  bidirectional: {
    name: 'Bidirectional Search',
    category: 'Shortest Path',
    time: 'O(b^(d/2))',
    space: 'O(b^(d/2))',
    pseudocode: [
      'function BidirectionalSearch(start, target):',
      '  qForward = [start]; qBackward = [target]',
      '  while queues not empty:',
      '    step forward; if overlap with backward, return path!',
      '    step backward; if overlap with forward, return path!'
    ],
    intuition: 'Searches simultaneously from both start and target, meeting in the middle.',
    interviewTip: 'Dramatically reduces search space exponent from d to d/2.'
  },
  prim: {
    name: "Prim's Minimum Spanning Tree (MST)",
    category: 'Minimum Spanning Tree',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'function Prim(G):',
      '  pq.push((0, startNode))',
      '  while pq not empty:',
      '    w, u = pq.pop_min()',
      '    if inMST[u]: continue',
      '    inMST[u] = true',
      '    for (v, weight) in G.neighbors(u):',
      '      if not inMST[v] and weight < key[v]:',
      '        key[v] = weight; pq.push((weight, v))'
    ],
    intuition: 'Grows a single spanning tree by greedily adding minimum weight cut edges.',
    interviewTip: 'Prim is optimal for dense graphs when implemented with adjacency matrix.'
  },
  kruskal: {
    name: "Kruskal's Minimum Spanning Tree (MST)",
    category: 'Minimum Spanning Tree',
    time: 'O(E log E)',
    space: 'O(V)',
    pseudocode: [
      'function Kruskal(G):',
      '  sort all edges by ascending weight',
      '  dsu = DisjointSet(V)',
      '  for each edge (u, v, w):',
      '    if dsu.find(u) != dsu.find(v):',
      '      dsu.union(u, v); mst_edges.push((u, v, w))'
    ],
    intuition: 'Greedily adds global minimum weight edges that do not form a cycle using DSU.',
    interviewTip: 'Kruskal is optimal for sparse graphs and edge-list inputs.'
  },
  boruvka: {
    name: "Boruvka's Minimum Spanning Tree",
    category: 'Minimum Spanning Tree',
    time: 'O(E log V)',
    space: 'O(V)',
    pseudocode: [
      'function Boruvka(G):',
      '  while number of trees > 1:',
      '    for each tree T: find cheapest outgoing edge',
      '    add all cheapest edges to MST and merge trees'
    ],
    intuition: 'The oldest MST algorithm (1926). Merges multiple tree components simultaneously.',
    interviewTip: 'Highly parallelizable component-wise MST algorithm!'
  },
  connected_components: {
    name: 'Connected Components',
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function FindComponents(G):',
      '  for u = 0 to V-1:',
      '    if not visited[u]:',
      '      compCount++; BFS_or_DFS(u, compCount)'
    ],
    intuition: 'Traverses each unvisited vertex to partition the graph into disjoint components.',
    interviewTip: 'Basic building block for network isolation and clustering analysis.'
  },
  kosaraju: {
    name: "Kosaraju's Strongly Connected Components (SCC)",
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function Kosaraju(G):',
      '  1. Run DFS on G and push completed vertices to Stack',
      '  2. Reverse all edges in G to create G_rev',
      '  3. Pop Stack and run DFS on G_rev to find SCCs'
    ],
    intuition: 'Two-pass DFS using a reversed graph to identify mutual reachability.',
    interviewTip: 'Classic linear-time algorithm for directed graph condensation.'
  },
  tarjan_scc: {
    name: "Tarjan's Strongly Connected Components (SCC)",
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function TarjanDFS(u):',
      '  disc[u] = low[u] = ++time; stack.push(u)',
      '  for v in G.neighbors(u):',
      '    update low[u] = min(low[u], low[v] or disc[v])',
      '  if low[u] == disc[u]: pop stack until u -> new SCC'
    ],
    intuition: 'Single-pass DFS using low-link values to detect SCC roots on the fly.',
    interviewTip: 'Requires only one DFS pass compared to Kosaraju!'
  },
  articulation_points: {
    name: 'Articulation Points (Cut Vertices)',
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function FindArticulationPoints(u, parent):',
      '  disc[u] = low[u] = ++time',
      '  for v in G.neighbors(u):',
      '    if low[v] >= disc[u] and parent != -1: u is Articulation Point'
    ],
    intuition: 'Finds vertices whose removal increases the number of connected components.',
    interviewTip: 'Critical for identifying single points of failure in networks.'
  },
  bridges: {
    name: 'Bridges (Cut Edges)',
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function FindBridges(u, parent):',
      '  disc[u] = low[u] = ++time',
      '  for v in G.neighbors(u):',
      '    if low[v] > disc[u]: edge (u, v) is a BRIDGE'
    ],
    intuition: 'Finds edges whose removal disconnects the graph (no back-edge covers them).',
    interviewTip: 'Used in network reliability and 2-edge-connected components.'
  },
  biconnected_components: {
    name: 'Biconnected Components',
    category: 'Connectivity & SCC',
    time: 'O(V + E)',
    space: 'O(V + E)',
    pseudocode: [
      'function BiconnectedDFS(u):',
      '  push edge (u,v) to stack',
      '  when low[v] >= disc[u]: pop edges from stack -> Biconnected Component'
    ],
    intuition: 'Maximal 2-vertex-connected subgraphs where no single vertex cut separates them.',
    interviewTip: 'Biconnected components share at most one articulation point.'
  },
  dfs_cycle: {
    name: 'DFS Cycle Detection',
    category: 'Cycle Detection',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function DFSCycle(u, visited, recStack):',
      '  visited[u] = recStack[u] = true',
      '  for v in G.neighbors(u):',
      '    if recStack[v]: return true // BACK EDGE CYCLE!',
      '  recStack[u] = false'
    ],
    intuition: 'A back-edge pointing to an ancestor currently on the DFS recursion stack indicates a cycle.',
    interviewTip: 'In undirected graphs, check if visited[v] == true and v != parent.'
  },
  union_find_cycle: {
    name: 'Union-Find Cycle Detection',
    category: 'Cycle Detection',
    time: 'O(E * α(V))',
    space: 'O(V)',
    pseudocode: [
      'function UnionFindCycle(G):',
      '  dsu = DisjointSet(V)',
      '  for each edge (u, v):',
      '    if dsu.find(u) == dsu.find(v): return "Cycle Detected!"',
      '    dsu.union(u, v)'
    ],
    intuition: 'If two endpoints of an edge already belong to the same set, adding the edge creates a cycle.',
    interviewTip: 'Standard method for cycle detection in undirected graphs.'
  },
  directed_cycle: {
    name: 'Directed Graph Cycle Detection',
    category: 'Cycle Detection',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function DirectedCycle(G):',
      '  run DFS tracking recStack array',
      '  if edge to active recStack vertex exists -> CYCLE'
    ],
    intuition: 'Detects back edges in directed graphs during DFS traversal.',
    interviewTip: 'Essential step before attempting topological sorting.'
  },
  kahn: {
    name: "Kahn's Topological Sort",
    category: 'Topological Sort',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function Kahn(G):',
      '  compute in_degree for all vertices',
      '  queue = all v where in_degree[v] == 0',
      '  while queue not empty:',
      '    u = queue.pop_front(); order.push_back(u)',
      '    for v in G.neighbors(u): if --in_degree[v] == 0: queue.push(v)'
    ],
    intuition: 'Iteratively removes vertices with in-degree 0 from a DAG.',
    interviewTip: 'If order.size() < V, the graph contains a cycle!'
  },
  dfs_topo: {
    name: 'DFS Topological Sort',
    category: 'Topological Sort',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function DFSTopo(u):',
      '  visited[u] = true',
      '  for v in G.neighbors(u): if not visited[v]: DFSTopo(v)',
      '  stack.push(u) // Push on finish time',
      '// Reverse stack order is the valid Topological Order'
    ],
    intuition: 'Vertices are pushed to a stack after all their descendants finish processing.',
    interviewTip: 'Reverse post-order of DFS yields topological ordering.'
  },
  ford_fulkerson: {
    name: 'Ford-Fulkerson Maximum Flow',
    category: 'Network Flow & Matching',
    time: 'O(E * maxFlow)',
    space: 'O(V²)',
    pseudocode: [
      'function FordFulkerson(G, s, t):',
      '  maxFlow = 0',
      '  while augmenting path p from s to t in residual graph:',
      '    f = min residual capacity along p',
      '    update residual capacities by f; maxFlow += f'
    ],
    intuition: 'Repeatedly finds augmenting paths in a residual network until no path exists.',
    interviewTip: 'Can loop forever if capacities are irrational! Edmonds-Karp fixes this using BFS.'
  },
  edmonds_karp: {
    name: 'Edmonds-Karp Maximum Flow',
    category: 'Network Flow & Matching',
    time: 'O(V E²)',
    space: 'O(V²)',
    pseudocode: [
      'function EdmondsKarp(G, s, t):',
      '  run Ford-Fulkerson using BFS for shortest augmenting path',
      '  guarantees polynomial time termination O(V * E^2)'
    ],
    intuition: 'Specialization of Ford-Fulkerson that uses BFS to find shortest augmenting paths in hops.',
    interviewTip: 'Guarantees at most O(V * E) augmenting iterations.'
  },
  dinic: {
    name: "Dinic's Maximum Flow Algorithm",
    category: 'Network Flow & Matching',
    time: 'O(V² E)',
    space: 'O(V²)',
    pseudocode: [
      'function Dinic(G, s, t):',
      '  while BFS can construct a level graph from s to t:',
      '    while DFS finds blocking flow in level graph:',
      '      add blocking flow to maxFlow'
    ],
    intuition: 'Uses level graphs via BFS and blocking flows via DFS for blazing fast flow computation.',
    interviewTip: 'Runs in O(E * sqrt(V)) on unit-capacity networks like bipartite matching!'
  },
  bipartite_matching: {
    name: 'Maximum Bipartite Matching',
    category: 'Network Flow & Matching',
    time: 'O(V E)',
    space: 'O(V)',
    pseudocode: [
      'function BipartiteMatching(u):',
      '  for each candidate match v:',
      '    if v unassigned or BipartiteMatching(assign[v]):',
      '      assign[v] = u; return true'
    ],
    intuition: 'Finds the maximum set of disjoint edges between two bipartite sets U and V.',
    interviewTip: 'Can be modeled as Maximum Flow with source and sink edges.'
  },
  hopcroft_karp: {
    name: 'Hopcroft-Karp Bipartite Matching',
    category: 'Network Flow & Matching',
    time: 'O(E * sqrt(V))',
    space: 'O(V)',
    pseudocode: [
      'function HopcroftKarp(G):',
      '  while BFS finds augmenting paths of shortest length:',
      '    use DFS to augment all vertex-disjoint paths simultaneously'
    ],
    intuition: 'The fastest algorithm for maximum cardinality bipartite matching.',
    interviewTip: 'Standard algorithm for job-applicant or resource assignment.'
  },
  make_set: {
    name: 'Disjoint Set - Make Set',
    category: 'Disjoint Set Union',
    time: 'O(1)',
    space: 'O(1)',
    pseudocode: [
      'function MakeSet(x):',
      '  parent[x] = x',
      '  rank[x] = 0; size[x] = 1'
    ],
    intuition: 'Initializes an element as its own single-item set representative.',
    interviewTip: 'Base initialization step for Kruskal and connectivity queries.'
  },
  find_set: {
    name: 'Disjoint Set - Find Set',
    category: 'Disjoint Set Union',
    time: 'O(α(V))',
    space: 'O(1)',
    pseudocode: [
      'function Find(x):',
      '  if parent[x] != x:',
      '    parent[x] = Find(parent[x]) // Path Compression',
      '  return parent[x]'
    ],
    intuition: 'Traverses up parent pointers to find the root representative of the set.',
    interviewTip: 'Path compression flattens the tree for nearly O(1) future lookups!'
  },
  union_set: {
    name: 'Disjoint Set - Union Set',
    category: 'Disjoint Set Union',
    time: 'O(α(V))',
    space: 'O(1)',
    pseudocode: [
      'function Union(x, y):',
      '  rootX = Find(x); rootY = Find(y)',
      '  if rootX != rootY: parent[rootY] = rootX'
    ],
    intuition: 'Merges two distinct disjoint sets by setting one root as parent of the other.',
    interviewTip: 'Always combine with Union by Rank or Size for optimal inverse-Ackermann time.'
  },
  path_compression: {
    name: 'Path Compression (DSU)',
    category: 'Disjoint Set Union',
    time: 'O(α(V))',
    space: 'O(1)',
    pseudocode: [
      'function FindWithCompression(x):',
      '  if parent[x] != x: parent[x] = FindWithCompression(parent[x])',
      '  return parent[x]'
    ],
    intuition: 'Attaches all visited nodes directly to the root during Find queries.',
    interviewTip: 'Reduces tree height to almost 1.'
  },
  union_by_rank: {
    name: 'Union by Rank (DSU)',
    category: 'Disjoint Set Union',
    time: 'O(α(V))',
    space: 'O(V)',
    pseudocode: [
      'function UnionByRank(x, y):',
      '  rootX = Find(x); rootY = Find(y)',
      '  if rank[rootX] < rank[rootY]: parent[rootX] = rootY',
      '  else if rank[rootX] > rank[rootY]: parent[rootY] = rootX',
      '  else: parent[rootY] = rootX; rank[rootX]++'
    ],
    intuition: 'Attaches the shorter tree under the root of the taller tree.',
    interviewTip: 'Prevents degenerate linked-list trees in DSU.'
  },
  union_by_size: {
    name: 'Union by Size (DSU)',
    category: 'Disjoint Set Union',
    time: 'O(α(V))',
    space: 'O(V)',
    pseudocode: [
      'function UnionBySize(x, y):',
      '  rootX = Find(x); rootY = Find(y)',
      '  if size[rootX] < size[rootY]: swap(rootX, rootY)',
      '  parent[rootY] = rootX; size[rootX] += size[rootY]'
    ],
    intuition: 'Attaches smaller set under larger set and tracks total component size.',
    interviewTip: 'Very handy when you need to answer queries about connected component size!'
  },
  greedy_coloring: {
    name: 'Greedy Vertex Coloring',
    category: 'Graph Coloring',
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      'function GreedyColoring(G):',
      '  for each u in V:',
      '    assign lowest color index not used by u\'s neighbors'
    ],
    intuition: 'Greedily assigns the smallest available color index to vertices in sequence.',
    interviewTip: 'Uses at most maxDegree + 1 colors (Brooks\' theorem).'
  },
  welsh_powell: {
    name: 'Welsh-Powell Graph Coloring',
    category: 'Graph Coloring',
    time: 'O(V log V + V E)',
    space: 'O(V)',
    pseudocode: [
      'function WelshPowell(G):',
      '  sort vertices by descending degree',
      '  for each color c:',
      '    assign c to uncolored vertex u and all non-adjacent uncolored vertices'
    ],
    intuition: 'Colors high-degree vertices first to use fewer total colors.',
    interviewTip: 'An excellent polynomial-time heuristic for chromatic number minimization.'
  },
  max_clique: {
    name: 'Maximum Clique (Visual)',
    category: 'Clique & Independent Set',
    time: 'NP-Hard (O(3^(V/3)))',
    space: 'O(V)',
    pseudocode: [
      'function BronKerbosch(R, P, X):',
      '  if P and X empty: report maximal clique R',
      '  for each v in P: BronKerbosch(R ∪ {v}, P ∩ N(v), X ∩ N(v))'
    ],
    intuition: 'Finds the largest subset of vertices where every pair is mutually connected.',
    interviewTip: 'Bron-Kerbosch algorithm with pivoting is the standard exact solver.'
  },
  independent_set: {
    name: 'Maximum Independent Set',
    category: 'Clique & Independent Set',
    time: 'NP-Hard',
    space: 'O(V)',
    pseudocode: [
      'function MaxIndependentSet(G):',
      '  equivalent to Maximum Clique on the complement graph G_comp'
    ],
    intuition: 'Finds the largest set of vertices such that no two are adjacent.',
    interviewTip: 'On bipartite graphs, Max Independent Set = V - Maximum Matching!'
  },
  vertex_cover: {
    name: 'Vertex Cover (Basic)',
    category: 'Clique & Independent Set',
    time: 'NP-Hard',
    space: 'O(V)',
    pseudocode: [
      'function MinVertexCover(G):',
      '  for each edge (u, v): pick u or v to cover edge',
      '  on bipartite graphs, solved via König\'s Theorem'
    ],
    intuition: 'A set of vertices that touches every edge in the graph.',
    interviewTip: 'In any graph, Vertex Cover + Independent Set = V.'
  },
  euler_path: {
    name: 'Eulerian Path',
    category: 'Euler & Hamilton',
    time: 'O(V + E)',
    space: 'O(V + E)',
    pseudocode: [
      'function HierholzerPath(G):',
      '  valid if exactly 0 or 2 vertices have odd degree',
      '  DFS traversal popping used edges to form Eulerian path'
    ],
    intuition: 'A trail in a graph which visits every edge exactly once.',
    interviewTip: 'Connected graph has Eulerian Path iff exactly 0 or 2 vertices have odd degree.'
  },
  euler_circuit: {
    name: 'Eulerian Circuit (Cycle)',
    category: 'Euler & Hamilton',
    time: 'O(V + E)',
    space: 'O(V + E)',
    pseudocode: [
      'function HierholzerCircuit(G):',
      '  valid if ALL vertices have even degree (undirected)',
      '  run DFS popping edges into circuit path'
    ],
    intuition: 'A closed Eulerian trail that visits every edge exactly once and returns to start.',
    interviewTip: 'Every vertex must have even degree in an undirected Eulerian circuit.'
  },
  hamiltonian_path: {
    name: 'Hamiltonian Path',
    category: 'Euler & Hamilton',
    time: 'NP-Complete (O(V² * 2^V))',
    space: 'O(V * 2^V)',
    pseudocode: [
      'function HamiltonianPath(G):',
      '  backtracking DFS to visit every vertex exactly ONCE'
    ],
    intuition: 'A path that visits every vertex in the graph exactly once.',
    interviewTip: 'Unlike Eulerian Path (edges), Hamiltonian Path (vertices) is NP-Complete!'
  },
  hamiltonian_cycle: {
    name: 'Hamiltonian Cycle (TSP)',
    category: 'Euler & Hamilton',
    time: 'NP-Complete (O(V² * 2^V))',
    space: 'O(V * 2^V)',
    pseudocode: [
      'function HamiltonianCycle(G):',
      '  backtracking DFS visiting every vertex once and returning to start'
    ],
    intuition: 'A closed cycle that visits every vertex exactly once.',
    interviewTip: 'The decision problem behind the famous Traveling Salesperson Problem (TSP).'
  },
  greedy_best_first: {
    name: 'Greedy Best-First Search (AI)',
    category: 'Heuristics & AI',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    pseudocode: [
      'function GreedyBestFirst(G, start, target):',
      '  pq.push((h(start), start)) // Order purely by heuristic h(u)',
      '  while pq not empty: u = pq.pop_min(); if u == target: return'
    ],
    intuition: 'Explores the node that appears closest to the goal according to heuristic h(u).',
    interviewTip: 'Unlike A*, it is not guaranteed to find the shortest path, but is very fast.'
  }
};

export default function GraphLab() {
  const [graphType, setGraphType] = useState('undirected');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState(0);
  const [targetNode, setTargetNode] = useState(5);
  const [kValue, setKValue] = useState(3);
  const [autoConvert, setAutoConvert] = useState(true);
  const [mode, setMode] = useState('interactive'); // 'interactive', 'compare'
  const [showVerifier, setShowVerifier] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [desc, setDesc] = useState('Select a graph type or algorithm to start native C++ visualization.');

  // Graph construction input states
  const [newVertexLabel, setNewVertexLabel] = useState('');
  const [delVertexId, setDelVertexId] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [delEdgeFrom, setDelEdgeFrom] = useState('');
  const [delEdgeTo, setDelEdgeTo] = useState('');

  // Engine state
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [representations, setRepresentations] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch from C++ Graph Engine
  const fetchGraphState = async (
    customGraphType = graphType,
    customAlgo = algorithm,
    customStart = startNode,
    customTarget = targetNode,
    customK = kValue
  ) => {
    setLoading(true);
    setErrorMessage('');
    setIsPlaying(false);
    setStepIndex(0);

    try {
      const res = await api.post('/graph/run', {
        graphType: customGraphType,
        algorithm: customAlgo,
        startNode: customStart,
        targetNode: customTarget,
        kValue: customK
      });

      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setVertices(d.vertices || []);
        setEdges(d.edges || []);
        setEvents(d.events || []);
        setStatistics(d.statistics || {});
        setRepresentations(d.representations || {});
        if (d.events && d.events.length > 0) {
          setDesc(d.events[0].desc || `C++ Engine generated '${customGraphType}' and initialized '${customAlgo}'.`);
        } else {
          setDesc(`C++ Engine generated '${customGraphType}' with ${d.vertices?.length || 0} vertices and ${d.edges?.length || 0} edges.`);
        }
      } else {
        setErrorMessage(res.data?.message || 'Failed to execute C++ graph engine.');
      }
    } catch (error) {
      console.error('C++ Graph Engine Error:', error);
      setErrorMessage(error.response?.data?.message || 'Error communicating with C++ graph backend.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchGraphState();
  }, []);

  // When graphType changes: only re-run automatically if Auto-Convert is ON!
  const handleGraphTypeChange = (newType) => {
    setGraphType(newType);
    if (autoConvert) {
      fetchGraphState(newType, algorithm, startNode);
    } else {
      setDesc(`Selected '${newType}' (Auto-Convert is OFF, click Shuffle to regenerate).`);
    }
  };

  // When algorithm changes
  const handleAlgorithmChange = (newAlgo) => {
    setAlgorithm(newAlgo);
    fetchGraphState(graphType, newAlgo, startNode);
  };

  // Preset Handler
  const handlePreset = async (presetKey) => {
    setIsPlaying(false);
    setStepIndex(0);
    setGraphType(presetKey);
    setDesc(`Loaded preset '${presetKey}' and executed C++ engine.`);
    await fetchGraphState(presetKey, algorithm, startNode);
  };

  // Graph Construction Handlers
  const handleAddVertex = () => {
    const nextId = vertices.length;
    const label = newVertexLabel.trim() || `V${nextId}`;
    const newV = {
      id: nextId,
      label,
      x: 150 + (nextId * 50) % 400,
      y: 120 + (nextId * 35) % 250
    };
    setVertices([...vertices, newV]);
    setNewVertexLabel('');
    setDesc(`Added vertex ${label} (ID: ${nextId}).`);
  };

  const handleDeleteVertex = () => {
    const id = parseInt(delVertexId, 10);
    if (isNaN(id)) return;
    setVertices(vertices.filter((v) => v.id !== id));
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
    setDelVertexId('');
    setDesc(`Deleted vertex ID ${id} and all incident edges.`);
  };

  const handleAddEdge = () => {
    const u = parseInt(edgeFrom, 10);
    const v = parseInt(edgeTo, 10);
    const w = parseInt(edgeWeight, 10) || 1;
    if (isNaN(u) || isNaN(v)) return;
    const newE = { from: u, to: v, weight: w };
    setEdges([...edges, newE]);
    setEdgeFrom('');
    setEdgeTo('');
    setDesc(`Added edge (${u} -> ${v}) with weight ${w}.`);
  };

  const handleDeleteEdge = () => {
    const u = parseInt(delEdgeFrom, 10);
    const v = parseInt(delEdgeTo, 10);
    if (isNaN(u) || isNaN(v)) return;
    setEdges(edges.filter((e) => !(e.from === u && e.to === v) && !(graphType === 'undirected' && e.from === v && e.to === u)));
    setDelEdgeFrom('');
    setDelEdgeTo('');
    setDesc(`Deleted edge (${u} -> ${v}).`);
  };

  const handleClearGraph = () => {
    setIsPlaying(false);
    setVertices([]);
    setEdges([]);
    setEvents([]);
    setStepIndex(0);
    setDesc('Cleared all vertices and edges.');
  };

  const handleRandomize = () => {
    fetchGraphState('random', algorithm, startNode);
    setDesc('Generated random graph with C++ backend.');
  };

  const handleResetGraph = () => {
    fetchGraphState(graphType, algorithm, startNode);
    setDesc(`Reset '${graphType}' graph to default state.`);
  };

  // Playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && events.length > 0) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, Math.max(100, 1000 / speed));
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, events.length]);

  const currentMeta = ALGORITHM_METADATA[algorithm] || ALGORITHM_METADATA.bfs;
  const currentGraphMeta = GRAPH_TYPE_METADATA[graphType] || GRAPH_TYPE_METADATA.undirected;
  const currentEvent = events[stepIndex] || {};

  const ALGO_CATEGORIES = [
    'All',
    'Traversals',
    'Shortest Path',
    'Minimum Spanning Tree',
    'Connectivity & SCC',
    'Cycle Detection',
    'Topological Sort',
    'Network Flow & Matching',
    'Disjoint Set Union',
    'Graph Coloring',
    'Clique & Independent Set',
    'Euler & Hamilton',
    'Heuristics & AI'
  ];

  const filteredAlgorithms = Object.entries(ALGORITHM_METADATA).filter(([key, meta]) => {
    if (selectedCategory === 'All') return true;
    return meta.category === selectedCategory;
  });

  const filteredGraphTypes = Object.entries(GRAPH_TYPE_METADATA).filter(([key, meta]) => {
    const q = searchType.toLowerCase();
    return key.toLowerCase().includes(q) || meta.name.toLowerCase().includes(q) || meta.category.toLowerCase().includes(q);
  });

  return (
    <AppLayout>
      <div className={`space-y-4 py-1 font-body ${isFullScreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto p-4' : ''}`}>
        
        {/* Header Bar */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-[1.5px] border-borderTheme">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="shrink-0" title="Toggle Sidebar">
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                  <Network className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-heading font-bold text-textPrimary">
                  Graph Laboratory
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  0 DLL Dependencies
                </span>
              </div>
              <p className="text-sm font-body text-textSecondary mt-1">
                14 Graph Types • 4 Live Synchronized Representations • 40+ C++ Native Algorithms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant={mode === 'compare' ? 'primary' : 'outline'} size="sm" onClick={() => setMode(mode === 'compare' ? 'interactive' : 'compare')}>
              <BarChart2 className="w-4 h-4 mr-1.5" />
              <span>{mode === 'compare' ? 'Interactive Studio' : 'Compare Algorithms'}</span>
            </Button>
          </div>
        </Card>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between text-xs font-semibold text-red-500">
            <span>{errorMessage}</span>
            <Button variant="ghost" size="sm" onClick={() => setErrorMessage('')}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Main 3-Column Studio Layout */}
        {mode === 'compare' ? (
          <GraphComparisonView
            graphType={graphType}
            onBackToSingle={() => setMode('interactive')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">
            
            {/* LEFT COLUMN: Graph Architecture & Types (lg:col-span-3) */}
            {!isSidebarCollapsed && (
              <div className="lg:col-span-3">
                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-primary" /> Graph Architecture
                    </h3>
                    <div className="flex items-center gap-1">
                      <label
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface border border-borderTheme cursor-pointer select-none"
                        title="When enabled, switching Graph Type automatically generates and runs that graph in C++."
                      >
                        <input
                          type="checkbox"
                          checked={autoConvert}
                          onChange={(e) => setAutoConvert(e.target.checked)}
                          className="accent-primary w-3 h-3 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold text-foreground">Auto-Convert</span>
                      </label>
                    </div>
                  </div>

                  {/* Search Graph Types */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Search 14 Graph Types..."
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full bg-surface border border-borderTheme rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Selectable Graph Types List */}
                  <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                    {filteredGraphTypes.map(([key, meta]) => {
                      const isSelected = graphType === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleGraphTypeChange(key)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-primary font-bold shadow-soft'
                              : 'bg-surface border-borderTheme text-foreground hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-heading font-semibold">{meta.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono bg-background border border-borderTheme text-muted">
                              {meta.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted line-clamp-2 leading-tight font-normal">
                            {meta.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Verify Engine Suite Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVerifier(true)}
                    className="w-full border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 justify-center"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
                    <span>Verify Engine (126 Tests)</span>
                  </Button>
                </Card>
              </div>
            )}

            {/* CENTER COLUMN: Interactive Canvas, Operations Card & Playback (lg:col-span-6 or 9) */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-6 min-w-0`}>
              
              {/* Step Description Banner */}
              <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 rounded-card p-3 shadow-soft flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                    {algorithm.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-muted capitalize">
                    {graphType} Graph
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground text-right truncate max-w-[65%]">
                  {desc}
                </p>
              </div>

              {/* Visual Graph Canvas / Representation Table */}
              <GraphCanvas
                graphType={graphType}
                setGraphType={handleGraphTypeChange}
                algorithm={algorithm}
                setAlgorithm={handleAlgorithmChange}
                startNode={startNode}
                setStartNode={setStartNode}
                targetNode={targetNode}
                setTargetNode={setTargetNode}
                kValue={kValue}
                setKValue={setKValue}
                vertices={vertices}
                edges={edges}
                events={events}
                statistics={statistics}
                representations={representations}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
                onRunOperation={() => fetchGraphState(graphType, algorithm, startNode, targetNode, kValue)}
                onPreset={(preset) => {
                  if (preset === 'random') handleRandomize();
                  else handleGraphTypeChange(preset);
                }}
                onAddVertex={handleAddVertex}
                onDeleteVertex={handleDeleteVertex}
                onAddEdge={handleAddEdge}
                onDeleteEdge={handleDeleteEdge}
                onRandomize={handleRandomize}
                onResetGraph={handleResetGraph}
                onClearGraph={handleClearGraph}
                newVertexLabel={newVertexLabel}
                setNewVertexLabel={setNewVertexLabel}
                delVertexId={delVertexId}
                setDelVertexId={setDelVertexId}
                edgeFrom={edgeFrom}
                setEdgeFrom={setEdgeFrom}
                edgeTo={edgeTo}
                setEdgeTo={setEdgeTo}
                edgeWeight={edgeWeight}
                setEdgeWeight={setEdgeWeight}
                delEdgeFrom={delEdgeFrom}
                setDelEdgeFrom={setDelEdgeFrom}
                delEdgeTo={delEdgeTo}
                setDelEdgeTo={setDelEdgeTo}
                autoConvert={autoConvert}
                setAutoConvert={setAutoConvert}
                isFullScreen={isFullScreen}
                onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
              />

              {/* Operations Studio Card */}
              <Card className="p-5 space-y-5 bg-card border-borderTheme">
                
                {/* 1. Test Presets Bar */}
                <div className="space-y-2">
                  <span className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">
                    1. Test Presets & Architectures
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'random', label: 'Random Graph' },
                      { key: 'grid', label: 'Grid Graph' },
                      { key: 'negative', label: 'Negative Weights' },
                      { key: 'complete', label: 'Complete Kn' },
                      { key: 'sparse', label: 'Sparse' },
                      { key: 'dense', label: 'Dense' },
                      { key: 'dag', label: 'DAG (Acyclic)' },
                      { key: 'bipartite', label: 'Bipartite' },
                      { key: 'tree', label: 'Tree Graph' },
                      { key: 'cyclic', label: 'Cyclic' },
                      { key: 'weighted', label: 'Weighted' },
                      { key: 'disconnected', label: 'Disconnected' }
                    ].map((preset) => (
                      <Button
                        key={preset.key}
                        variant={graphType === preset.key ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePreset(preset.key)}
                        className="text-xs py-1 px-2.5"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 2. Graph Construction & Mutation Bar */}
                <div className="space-y-2 pt-3 border-t border-borderTheme">
                  <span className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">
                    2. Interactive Graph Construction
                  </span>
                  
                  {/* Vertex & Edge Inputs Responsive Rows */}
                  <div className="space-y-2">
                    
                    {/* Row 1: Add / Delete Vertex */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-2.5 rounded-xl border border-borderTheme">
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <span className="text-xs font-bold text-muted whitespace-nowrap">+ Vertex:</span>
                        <input
                          type="text"
                          placeholder="New Vertex Label (e.g., V5)..."
                          value={newVertexLabel}
                          onChange={(e) => setNewVertexLabel(e.target.value)}
                          className="flex-1 min-w-[120px] bg-background border border-borderTheme rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <Button variant="outline" size="sm" onClick={handleAddVertex} className="text-xs py-1 px-2.5 shrink-0">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add V
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 sm:border-l sm:border-borderTheme sm:pl-3">
                        <span className="text-xs font-bold text-muted whitespace-nowrap">Delete:</span>
                        <input
                          type="number"
                          placeholder="ID"
                          value={delVertexId}
                          onChange={(e) => setDelVertexId(e.target.value)}
                          className="w-16 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-red-500"
                        />
                        <Button variant="ghost" size="sm" onClick={handleDeleteVertex} className="text-xs py-1 px-2 text-red-500 hover:bg-red-500/10 shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Row 2: Add / Delete Edge */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-2.5 rounded-xl border border-borderTheme">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-muted whitespace-nowrap">+ Edge:</span>
                        <input
                          type="number"
                          placeholder="u (From)"
                          value={edgeFrom}
                          onChange={(e) => setEdgeFrom(e.target.value)}
                          className="w-20 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <span className="text-muted text-xs font-bold">→</span>
                        <input
                          type="number"
                          placeholder="v (To)"
                          value={edgeTo}
                          onChange={(e) => setEdgeTo(e.target.value)}
                          className="w-20 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <input
                          type="number"
                          placeholder="wt (Weight)"
                          value={edgeWeight}
                          onChange={(e) => setEdgeWeight(e.target.value)}
                          className="w-24 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                        <Button variant="outline" size="sm" onClick={handleAddEdge} className="text-xs py-1 px-2.5 shrink-0">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Edge
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 sm:border-l sm:border-borderTheme sm:pl-3">
                        <span className="text-xs font-bold text-muted whitespace-nowrap">Delete Edge:</span>
                        <input
                          type="number"
                          placeholder="u"
                          value={delEdgeFrom}
                          onChange={(e) => setDelEdgeFrom(e.target.value)}
                          className="w-14 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-red-500"
                        />
                        <span className="text-muted text-xs">→</span>
                        <input
                          type="number"
                          placeholder="v"
                          value={delEdgeTo}
                          onChange={(e) => setDelEdgeTo(e.target.value)}
                          className="w-14 bg-background border border-borderTheme rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-red-500"
                        />
                        <Button variant="ghost" size="sm" onClick={handleDeleteEdge} className="text-xs py-1 px-2 text-red-500 hover:bg-red-500/10 shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                  </div>

                  {/* Global Graph Operations */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={handleRandomize} className="text-xs">
                      <Shuffle className="w-3.5 h-3.5 mr-1" /> Randomize Graph
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetGraph} className="text-xs">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Graph
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearGraph} className="text-xs text-red-500 border-red-500/30">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Graph
                    </Button>
                  </div>
                </div>

                {/* 3. Categorized Algorithms Bar (40+ Algorithms) */}
                <div className="space-y-3 pt-3 border-t border-borderTheme">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">
                      3. Select & Execute C++ Native Algorithm (40+ Available)
                    </span>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-1 bg-surface p-1.5 rounded-xl border border-borderTheme">
                    {ALGO_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Algorithm Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                    {filteredAlgorithms.map(([key, meta]) => {
                      const isSelected = algorithm === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleAlgorithmChange(key)}
                          className={`p-2 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                            isSelected
                              ? 'bg-primary/15 border-primary text-primary font-bold shadow-soft'
                              : 'bg-surface border-borderTheme text-foreground hover:border-primary/50'
                          }`}
                        >
                          <span className="text-xs font-heading truncate">{meta.name}</span>
                          <span className="text-[10px] text-muted font-mono">{meta.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Specific Inputs Box & Live Output Line Bar */}
                <div className="pt-3 border-t border-borderTheme">
                  <span className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block mb-2">
                    4. Specific Inputs Box & Live Output Line Bar
                  </span>
                  <GraphSpecificInputsAndOutput
                    algorithm={algorithm}
                    startNode={startNode}
                    setStartNode={setStartNode}
                    targetNode={targetNode}
                    setTargetNode={setTargetNode}
                    kValue={kValue}
                    setKValue={setKValue}
                    onRunOperation={() => fetchGraphState(graphType, algorithm, startNode, targetNode, kValue)}
                    events={events}
                    stepIndex={stepIndex}
                    statistics={statistics}
                    vertices={vertices}
                    edges={edges}
                  />
                </div>

              </Card>

              {/* Playback Control Bar */}
              <GraphPlaybackBar
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
              />

            </div>

            {/* RIGHT COLUMN: Live Pseudocode, Intuition & Information Panel (lg:col-span-3 or 4) */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6 min-w-0`}>
              
              {/* Pseudocode & Time/Space Complexity Card */}
              <Card className="p-5 bg-card border-borderTheme space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
                  <Code className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    C++ Native {currentMeta.name} Pseudocode
                  </h3>
                </div>
                <pre className="p-3 bg-surface rounded-lg font-mono text-xs text-foreground overflow-x-auto border border-borderTheme space-y-1">
                  {currentMeta.pseudocode.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">{line}</div>
                  ))}
                </pre>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-borderTheme">
                  <span className="text-muted">Time Complexity:</span>
                  <span className="font-bold text-primary">{currentMeta.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted">Space Complexity:</span>
                  <span className="font-bold text-foreground">{currentMeta.space}</span>
                </div>
              </Card>

              {/* Intuition & Interview Tip Card */}
              <Card className="p-5 bg-card border-borderTheme space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-borderTheme">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    {currentGraphMeta.name} Intuition
                  </h3>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {currentGraphMeta.desc}
                </p>
                <div className="p-3 bg-surface rounded-lg border border-borderTheme space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    Algorithm Intuition
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    {currentMeta.intuition}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-foreground">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline" /> Expert Interview Tip:
                  </p>
                  <p className="text-muted">{currentMeta.interviewTip}</p>
                </div>

              </Card>

              {/* Live Algorithm Data Structures & C++ Statistics Panel */}
              <GraphInformationPanel
                currentEvent={currentEvent}
                statistics={statistics}
                graphType={graphType}
                algorithm={algorithm}
                stepIndex={stepIndex}
                totalSteps={events.length}
              />

            </div>

          </div>
        )}

        {/* Verification Suite Modal */}
        {showVerifier && (
          <GraphAutoVerifier onClose={() => setShowVerifier(false)} />
        )}

      </div>
    </AppLayout>
  );
}
