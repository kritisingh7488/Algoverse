const fs = require('fs');

const graphMap = {
  bfs: [
    'void BFS(const vector<vector<int>>& adj, int start) {',
    '    vector<bool> visited(adj.size(), false);',
    '    queue<int> q;',
    '',
    '    visited[start] = true;',
    '    q.push(start);',
    '',
    '    while (!q.empty()) {',
    '        int u = q.front();',
    '        q.pop();',
    '        // Process node u here',
    '',
    '        for (int v : adj[u]) {',
    '            if (!visited[v]) {',
    '                visited[v] = true;',
    '                q.push(v);',
    '            }',
    '        }',
    '    }',
    '}'
  ],
  dfs: [
    'void DFSUtil(const vector<vector<int>>& adj, int u, vector<bool>& visited) {',
    '    visited[u] = true;',
    '    // Process node u here',
    '',
    '    for (int v : adj[u]) {',
    '        if (!visited[v]) {',
    '            DFSUtil(adj, v, visited);',
    '        }',
    '    }',
    '}',
    '',
    'void DFS(const vector<vector<int>>& adj, int start) {',
    '    vector<bool> visited(adj.size(), false);',
    '    DFSUtil(adj, start, visited);',
    '}'
  ],
  dijkstra: [
    'vector<int> Dijkstra(const vector<vector<pair<int, int>>>& adj, int src) {',
    '    int V = adj.size();',
    '    vector<int> dist(V, INT_MAX);',
    '    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;',
    '',
    '    dist[src] = 0;',
    '    pq.push({0, src});',
    '',
    '    while (!pq.empty()) {',
    '        int u = pq.top().second;',
    '        int d = pq.top().first;',
    '        pq.pop();',
    '',
    '        if (d > dist[u]) continue;',
    '',
    '        for (auto& edge : adj[u]) {',
    '            int v = edge.first;',
    '            int weight = edge.second;',
    '',
    '            if (dist[u] + weight < dist[v]) {',
    '                dist[v] = dist[u] + weight;',
    '                pq.push({dist[v], v});',
    '            }',
    '        }',
    '    }',
    '    return dist;',
    '}'
  ],
  kruskal: [
    'struct Edge { int u, v, weight; };',
    'bool compareEdges(Edge a, Edge b) { return a.weight < b.weight; }',
    '',
    'int find(vector<int>& parent, int i) {',
    '    if (parent[i] == i) return i;',
    '    return parent[i] = find(parent, parent[i]);',
    '}',
    '',
    'void unite(vector<int>& parent, vector<int>& rank, int x, int y) {',
    '    int rootX = find(parent, x);',
    '    int rootY = find(parent, y);',
    '    if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;',
    '    else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;',
    '    else { parent[rootY] = rootX; rank[rootX]++; }',
    '}',
    '',
    'int Kruskal(int V, vector<Edge>& edges) {',
    '    sort(edges.begin(), edges.end(), compareEdges);',
    '    vector<int> parent(V), rank(V, 0);',
    '    for (int i = 0; i < V; i++) parent[i] = i;',
    '',
    '    int mstWeight = 0;',
    '    for (Edge e : edges) {',
    '        if (find(parent, e.u) != find(parent, e.v)) {',
    '            unite(parent, rank, e.u, e.v);',
    '            mstWeight += e.weight;',
    '        }',
    '    }',
    '    return mstWeight;',
    '}'
  ]
};

let content = fs.readFileSync('frontend/src/pages/labs/GraphLab.jsx', 'utf8');
for (const [key, code] of Object.entries(graphMap)) {
  const regex = new RegExp(`(${key}:\\s*\\{[^}]*?pseudocode:\\s*\\[)[^\\]]*(\\])`, 's');
  const replacement = `$1\n${code.map(c => `      \`${c.replace(/`/g, '\\`')}\``).join(',\n')}\n    $2`;
  content = content.replace(regex, replacement);
}
fs.writeFileSync('frontend/src/pages/labs/GraphLab.jsx', content);
console.log("GraphLab updated.");
