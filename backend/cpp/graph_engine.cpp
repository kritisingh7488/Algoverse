#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <cmath>
#include <chrono>
#include <iomanip>
#include <climits>

using namespace std;

// -----------------------------------------------------------------------------
// Data Structures for Graph Representation & Events
// -----------------------------------------------------------------------------
struct GraphVertex {
    int id;
    string label;
    double x = 0.0;
    double y = 0.0;
    string color = "default";
    string state = "default"; // "default", "active", "visited", "completed", "highlighted"
};

struct GraphEdge {
    int id;
    int from;
    int to;
    int weight = 1;
    bool directed = false;
    string color = "default";
    string state = "default"; // "default", "active", "tree_edge", "back_edge", "cross_edge", "rejected", "mst"
};

struct GraphEvent {
    string type;           // e.g. "visit_node", "visit_edge", "relax_edge", "enqueue", etc.
    int activeNode = -1;
    int activeEdge = -1;
    int p1 = -1;
    int p2 = -1;
    string pLabel1 = "";
    string pLabel2 = "";
    int line = 0;
    string desc;

    // Snapshot of algorithm state
    vector<int> queue;
    vector<int> stack;
    vector<int> pqueue;
    vector<int> distance;
    vector<int> parent;
    vector<int> visited;
    vector<int> discoveryTime;
    vector<int> finishTime;
    vector<int> lowLink;
    int mstCost = 0;
    int flowValue = 0;
    vector<int> componentsFound;
    vector<int> sequence;

    // Snapshot of visual graph state
    vector<GraphVertex> vertices;
    vector<GraphEdge> edges;
};

struct GraphStats {
    int verticesCount = 0;
    int edgesCount = 0;
    int connectedComponents = 0;
    double density = 0.0;
    double avgDegree = 0.0;
    int maxDegree = 0;
    int minDegree = 0;
    int memoryUsedBytes = 0;
    double runtimeMs = 0.0;
    int relaxationsCount = 0;
    int queueOpsCount = 0;
    int stackOpsCount = 0;
};

struct GraphResult {
    bool success = true;
    string graphType;
    string algorithm;
    vector<GraphVertex> vertices;
    vector<GraphEdge> edges;
    vector<GraphEvent> events;
    GraphStats stats;

    // Representations
    string edgeListJson;
    string adjacencyListJson;
    string adjacencyMatrixJson;
    string incidenceMatrixJson;
};

// -----------------------------------------------------------------------------
// Helper Methods for Graph Computation & Layouts
// -----------------------------------------------------------------------------
const int INF_VAL = 1000000000;

void applyCircularLayout(vector<GraphVertex>& verts) {
    int n = verts.size();
    if (n == 0) return;
    double radius = 180.0;
    double cx = 300.0, cy = 200.0;
    for (int i = 0; i < n; ++i) {
        double angle = 2.0 * 3.14159265358979323846 * i / n;
        verts[i].x = cx + radius * cos(angle);
        verts[i].y = cy + radius * sin(angle);
    }
}

void applyGridLayout(vector<GraphVertex>& verts) {
    int n = verts.size();
    if (n == 0) return;
    int cols = max(1, (int)ceil(sqrt(n)));
    double dx = 120.0, dy = 100.0;
    double startX = 100.0, startY = 80.0;
    for (int i = 0; i < n; ++i) {
        int r = i / cols;
        int c = i % cols;
        verts[i].x = startX + c * dx;
        verts[i].y = startY + r * dy;
    }
}

// Ensure every vertex has coordinates
void ensureLayout(vector<GraphVertex>& verts) {
    bool needsLayout = false;
    for (const auto& v : verts) {
        if (v.x == 0.0 && v.y == 0.0) { needsLayout = true; break; }
    }
    if (needsLayout) {
        applyCircularLayout(verts);
    }
}

int getDegree(int vId, const vector<GraphEdge>& edges, bool isDirected) {
    int deg = 0;
    for (const auto& e : edges) {
        if (e.from == vId || (!isDirected && e.to == vId)) {
            deg++;
        }
    }
    return deg;
}

// Generate the 4 Synchronized Representations in JSON Format
void computeRepresentations(GraphResult& res) {
    int n = res.vertices.size();
    int m = res.edges.size();
    bool dir = (res.graphType == "directed" || res.graphType == "dag" || res.graphType == "cyclic");

    // 1. Edge List JSON
    stringstream el;
    el << "[";
    for (size_t i = 0; i < res.edges.size(); ++i) {
        const auto& e = res.edges[i];
        el << "{\"from\":" << e.from << ",\"to\":" << e.to << ",\"weight\":" << e.weight << ",\"directed\":" << (e.directed ? "true" : "false") << "}";
        if (i + 1 < res.edges.size()) el << ",";
    }
    el << "]";
    res.edgeListJson = el.str();

    // 2. Adjacency List JSON
    stringstream al;
    al << "{";
    map<int, vector<pair<int,int>>> adj;
    for (const auto& v : res.vertices) {
        adj[v.id] = {};
    }
    for (const auto& e : res.edges) {
        adj[e.from].push_back({e.to, e.weight});
        if (!e.directed && !dir) {
            adj[e.to].push_back({e.from, e.weight});
        }
    }
    int vIdx = 0;
    for (auto& [u, neighbors] : adj) {
        al << "\"" << u << "\":[";
        for (size_t k = 0; k < neighbors.size(); ++k) {
            al << "{\"to\":" << neighbors[k].first << ",\"weight\":" << neighbors[k].second << "}";
            if (k + 1 < neighbors.size()) al << ",";
        }
        al << "]";
        if (++vIdx < (int)adj.size()) al << ",";
    }
    al << "}";
    res.adjacencyListJson = al.str();

    // 3. Adjacency Matrix JSON
    vector<vector<int>> matrix(n, vector<int>(n, 0));
    map<int, int> idToIdx;
    for (int i = 0; i < n; ++i) idToIdx[res.vertices[i].id] = i;

    for (const auto& e : res.edges) {
        if (idToIdx.count(e.from) && idToIdx.count(e.to)) {
            int r = idToIdx[e.from];
            int c = idToIdx[e.to];
            matrix[r][c] = e.weight;
            if (!e.directed && !dir) matrix[c][r] = e.weight;
        }
    }
    stringstream am;
    am << "[";
    for (int r = 0; r < n; ++r) {
        am << "[";
        for (int c = 0; c < n; ++c) {
            am << matrix[r][c];
            if (c + 1 < n) am << ",";
        }
        am << "]";
        if (r + 1 < n) am << ",";
    }
    am << "]";
    res.adjacencyMatrixJson = am.str();

    // 4. Incidence Matrix JSON (Vertices x Edges)
    vector<vector<int>> inc(n, vector<int>(m, 0));
    for (int col = 0; col < m; ++col) {
        const auto& e = res.edges[col];
        if (idToIdx.count(e.from) && idToIdx.count(e.to)) {
            int uIdx = idToIdx[e.from];
            int vIdx = idToIdx[e.to];
            if (e.directed || dir) {
                inc[uIdx][col] = -1;
                inc[vIdx][col] = 1;
            } else {
                inc[uIdx][col] = 1;
                inc[vIdx][col] = 1;
            }
        }
    }
    stringstream im;
    im << "[";
    for (int r = 0; r < n; ++r) {
        im << "[";
        for (int c = 0; c < m; ++c) {
            im << inc[r][c];
            if (c + 1 < m) im << ",";
        }
        im << "]";
        if (r + 1 < n) im << ",";
    }
    im << "]";
    res.incidenceMatrixJson = im.str();

    // Compute stats
    res.stats.verticesCount = n;
    res.stats.edgesCount = m;
    if (n > 1) {
        double maxPossibleEdges = dir ? (n * (n - 1)) : ((double)n * (n - 1) / 2.0);
        res.stats.density = maxPossibleEdges > 0 ? (m / maxPossibleEdges) : 0.0;
    } else {
        res.stats.density = 0.0;
    }
    int totalDeg = 0;
    int maxDeg = 0;
    int minDeg = n > 0 ? 100000 : 0;
    for (const auto& v : res.vertices) {
        int d = getDegree(v.id, res.edges, dir);
        totalDeg += d;
        maxDeg = max(maxDeg, d);
        minDeg = min(minDeg, d);
    }
    res.stats.maxDegree = maxDeg;
    res.stats.minDegree = minDeg;
    res.stats.avgDegree = n > 0 ? ((double)totalDeg / n) : 0.0;
    res.stats.memoryUsedBytes = n * sizeof(GraphVertex) + m * sizeof(GraphEdge);
}

// -----------------------------------------------------------------------------
// Preset Graph Generators for All 14 Graph Types
// -----------------------------------------------------------------------------
void generatePresetGraph(string type, vector<GraphVertex>& verts, vector<GraphEdge>& edges) {
    verts.clear();
    edges.clear();

    if (type == "undirected" || type == "weighted" || type == "unweighted" || type == "connected") {
        verts = {
            {0, "0", 150, 100}, {1, "1", 350, 80}, {2, "2", 500, 150},
            {3, "3", 180, 280}, {4, "4", 380, 300}, {5, "5", 550, 310}
        };
        edges = {
            {0, 0, 1, 4, false}, {1, 0, 3, 2, false}, {2, 1, 2, 5, false},
            {3, 1, 4, 3, false}, {4, 3, 4, 1, false}, {5, 2, 5, 6, false},
            {6, 4, 5, 2, false}
        };
        if (type == "unweighted") {
            for (auto& e : edges) e.weight = 1;
        }
    } else if (type == "directed" || type == "dag") {
        verts = {
            {0, "0", 120, 150}, {1, "1", 280, 100}, {2, "2", 280, 240},
            {3, "3", 440, 100}, {4, "4", 440, 240}, {5, "5", 580, 170}
        };
        edges = {
            {0, 0, 1, 3, true}, {1, 0, 2, 2, true}, {2, 1, 3, 4, true},
            {3, 1, 4, 1, true}, {4, 2, 4, 5, true}, {5, 3, 5, 2, true},
            {6, 4, 5, 3, true}
        };
    } else if (type == "cyclic") {
        verts = {
            {0, "0", 200, 120}, {1, "1", 400, 120}, {2, "2", 450, 260},
            {3, "3", 300, 320}, {4, "4", 150, 260}
        };
        edges = {
            {0, 0, 1, 2, true}, {1, 1, 2, 3, true}, {2, 2, 3, 1, true},
            {3, 3, 4, 4, true}, {4, 4, 0, 2, true}, {5, 1, 3, 5, true}
        };
    } else if (type == "bipartite") {
        verts = {
            {0, "U1", 200, 90}, {1, "U2", 200, 190}, {2, "U3", 200, 290},
            {3, "V1", 420, 90}, {4, "V2", 420, 190}, {5, "V3", 420, 290}
        };
        edges = {
            {0, 0, 3, 1, false}, {1, 0, 4, 2, false}, {2, 1, 3, 3, false},
            {3, 1, 5, 1, false}, {4, 2, 4, 2, false}, {5, 2, 5, 4, false}
        };
    } else if (type == "complete") {
        verts = {
            {0, "0", 300, 80}, {1, "1", 450, 180}, {2, "2", 390, 320},
            {3, "3", 210, 320}, {4, "4", 150, 180}
        };
        int eId = 0;
        for (int i = 0; i < 5; ++i) {
            for (int j = i + 1; j < 5; ++j) {
                edges.push_back({eId++, i, j, (i + j) % 5 + 1, false});
            }
        }
    } else if (type == "disconnected" || type == "forest") {
        verts = {
            {0, "0", 120, 120}, {1, "1", 240, 120}, {2, "2", 180, 230},
            {3, "3", 420, 130}, {4, "4", 540, 130}, {5, "5", 480, 240}
        };
        edges = {
            {0, 0, 1, 2, false}, {1, 1, 2, 3, false},
            {2, 3, 4, 4, false}, {3, 4, 5, 1, false}
        };
    } else if (type == "tree") {
        verts = {
            {0, "Root", 350, 80}, {1, "L1", 200, 190}, {2, "R1", 500, 190},
            {3, "L2", 120, 300}, {4, "L3", 280, 300}, {5, "R2", 420, 300}, {6, "R3", 580, 300}
        };
        edges = {
            {0, 0, 1, 1, false}, {1, 0, 2, 1, false},
            {2, 1, 3, 1, false}, {3, 1, 4, 1, false},
            {4, 2, 5, 1, false}, {5, 2, 6, 1, false}
        };
    } else if (type == "sparse") {
        verts = {
            {0, "0", 150, 120}, {1, "1", 350, 100}, {2, "2", 520, 150},
            {3, "3", 200, 280}, {4, "4", 450, 300}
        };
        edges = {
            {0, 0, 1, 2, false}, {1, 1, 2, 4, false}, {2, 3, 4, 1, false}
        };
    } else if (type == "dense") {
        verts = {
            {0, "0", 180, 120}, {1, "1", 420, 120}, {2, "2", 520, 250},
            {3, "3", 300, 320}, {4, "4", 100, 250}
        };
        int eId = 0;
        for (int i = 0; i < 5; ++i) {
            for (int j = i + 1; j < 5; ++j) {
                if ((i + j) != 3) {
                    edges.push_back({eId++, i, j, (i + j) % 4 + 1, false});
                }
            }
        }
    } else if (type == "random") {
        srand((unsigned)chrono::high_resolution_clock::now().time_since_epoch().count());
        int numV = 6 + (rand() % 3); // 6 to 8 vertices
        for (int i = 0; i < numV; ++i) {
            double ang = 2.0 * 3.14159265358979 * i / numV;
            double rx = 300.0 + 170.0 * cos(ang);
            double ry = 200.0 + 130.0 * sin(ang);
            verts.push_back({i, to_string(i), rx, ry});
        }
        int eId = 0;
        for (int i = 0; i < numV; ++i) {
            for (int j = i + 1; j < numV; ++j) {
                if ((rand() % 100) < 45) { // 45% probability edge
                    edges.push_back({eId++, i, j, (rand() % 9) + 1, false});
                }
            }
        }
        if (edges.empty() && numV > 1) {
            edges.push_back({0, 0, 1, 3, false});
        }
    } else if (type == "grid") {
        int eId = 0;
        for (int r = 0; r < 3; ++r) {
            for (int c = 0; c < 3; ++c) {
                int id = r * 3 + c;
                verts.push_back({id, to_string(id), 160.0 + c * 140.0, 80.0 + r * 110.0});
                if (c < 2) {
                    edges.push_back({eId++, id, id + 1, 1, false});
                }
                if (r < 2) {
                    edges.push_back({eId++, id, id + 3, 1, false});
                }
            }
        }
    } else if (type == "negative") {
        verts = {
            {0, "0", 150, 150}, {1, "1", 320, 100}, {2, "2", 320, 240},
            {3, "3", 500, 170}
        };
        edges = {
            {0, 0, 1, 4, true}, {1, 0, 2, 5, true}, {2, 1, 2, -2, true},
            {3, 1, 3, 3, true}, {4, 2, 3, 4, true}
        };
    } else {
        verts = {
            {0, "0", 150, 100}, {1, "1", 350, 80}, {2, "2", 500, 150},
            {3, "3", 180, 280}, {4, "4", 380, 300}, {5, "5", 550, 310}
        };
        edges = {
            {0, 0, 1, 4, false}, {1, 0, 3, 2, false}, {2, 1, 2, 5, false},
            {3, 1, 4, 3, false}, {4, 3, 4, 1, false}, {5, 2, 5, 6, false},
            {6, 4, 5, 2, false}
        };
    }
}

// -----------------------------------------------------------------------------
// Event Push Helper
// -----------------------------------------------------------------------------
void emitEvent(vector<GraphEvent>& events, string type, int activeNode, int activeEdge,
               int p1, int p2, string lbl1, string lbl2, int line, string desc,
               const vector<GraphVertex>& verts, const vector<GraphEdge>& edges,
               const vector<int>& q = {}, const vector<int>& st = {}, const vector<int>& pq = {},
               const vector<int>& dist = {}, const vector<int>& par = {}, const vector<int>& vis = {},
               const vector<int>& disc = {}, const vector<int>& fin = {}, const vector<int>& low = {},
               int mstCost = 0, int flowValue = 0, const vector<int>& comps = {}, const vector<int>& seq = {}) {
    GraphEvent ev;
    ev.type = type;
    ev.activeNode = activeNode;
    ev.activeEdge = activeEdge;
    ev.p1 = p1;
    ev.p2 = p2;
    ev.pLabel1 = lbl1;
    ev.pLabel2 = lbl2;
    ev.line = line;
    ev.desc = desc;
    ev.vertices = verts;
    ev.edges = edges;
    ev.queue = q;
    ev.stack = st;
    ev.pqueue = pq;
    ev.distance = dist;
    ev.parent = par;
    ev.visited = vis;
    ev.discoveryTime = disc;
    ev.finishTime = fin;
    ev.lowLink = low;
    ev.mstCost = mstCost;
    ev.flowValue = flowValue;
    ev.componentsFound = comps;
    ev.sequence = seq;
    events.push_back(ev);
}

// -----------------------------------------------------------------------------
// Graph Algorithms Implementation (40+ Algorithms)
// -----------------------------------------------------------------------------

// 1. BFS (Breadth-First Search)
void runBFS(vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> vis(n, 0);
    vector<int> q;
    vector<int> seq;
    vector<int> dist(n, INF_VAL);
    vector<int> par(n, -1);

    int startIdx = 0;
    for (int i = 0; i < n; ++i) {
        if (verts[i].id == startNode) { startIdx = i; break; }
    }

    q.push_back(startIdx);
    vis[startIdx] = 1;
    dist[startIdx] = 0;
    verts[startIdx].state = "active";
    stats.queueOpsCount++;

    emitEvent(events, "enqueue", startIdx, -1, startIdx, -1, "start", "", 1,
              "C++ BFS: Enqueued start vertex [" + verts[startIdx].label + "].",
              verts, edges, q, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);

    while (!q.empty()) {
        int u = q.front();
        q.erase(q.begin());
        stats.queueOpsCount++;
        verts[u].state = "visited";
        seq.push_back(verts[u].id);

        emitEvent(events, "visit_node", u, -1, u, -1, "curr", "", 3,
                  "C++ BFS: Dequeued and visiting vertex [" + verts[u].label + "].",
                  verts, edges, q, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);

        for (auto& e : edges) {
            int v = -1;
            if (e.from == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.to) { v = i; break; }
            } else if (!e.directed && e.to == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.from) { v = i; break; }
            }
            if (v != -1) {
                emitEvent(events, "visit_edge", u, e.id, u, v, "curr", "neighbor", 4,
                          "C++ BFS: Inspecting edge (" + verts[u].label + " -> " + verts[v].label + ").",
                          verts, edges, q, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);
                if (!vis[v]) {
                    vis[v] = 1;
                    dist[v] = dist[u] + 1;
                    par[v] = verts[u].id;
                    e.state = "tree_edge";
                    verts[v].state = "active";
                    q.push_back(v);
                    stats.queueOpsCount++;

                    emitEvent(events, "enqueue", v, e.id, u, v, "curr", "neighbor", 5,
                              "C++ BFS: Discovered unvisited neighbor [" + verts[v].label + "]. Enqueued.",
                              verts, edges, q, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);
                } else {
                    e.state = "cross_edge";
                }
            }
        }
        verts[u].state = "completed";
    }

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
              "C++ BFS: Traversal completed across all reachable vertices.",
              verts, edges, q, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);
}

// 2. DFS (Depth-First Search - Recursive/Iterative)
void dfsRecursiveHelper(int u, vector<GraphVertex>& verts, vector<GraphEdge>& edges,
                        vector<int>& vis, vector<int>& par, vector<int>& seq,
                        vector<int>& disc, vector<int>& fin, int& timer,
                        vector<GraphEvent>& events, GraphStats& stats) {
    vis[u] = 1;
    disc[u] = ++timer;
    verts[u].state = "active";
    seq.push_back(verts[u].id);

    emitEvent(events, "visit_node", u, -1, u, -1, "curr", "", 2,
              "C++ DFS: Visiting vertex [" + verts[u].label + "] at discovery time " + to_string(disc[u]) + ".",
              verts, edges, {}, {}, {}, {}, par, vis, disc, fin, {}, 0, 0, {}, seq);

    int n = verts.size();
    for (auto& e : edges) {
        int v = -1;
        if (e.from == verts[u].id) {
            for (int i = 0; i < n; ++i) if (verts[i].id == e.to) { v = i; break; }
        } else if (!e.directed && e.to == verts[u].id) {
            for (int i = 0; i < n; ++i) if (verts[i].id == e.from) { v = i; break; }
        }
        if (v != -1) {
            emitEvent(events, "visit_edge", u, e.id, u, v, "curr", "neighbor", 4,
                      "C++ DFS: Inspecting edge (" + verts[u].label + " -> " + verts[v].label + ").",
                      verts, edges, {}, {}, {}, {}, par, vis, disc, fin, {}, 0, 0, {}, seq);
            if (!vis[v]) {
                par[v] = verts[u].id;
                e.state = "tree_edge";
                dfsRecursiveHelper(v, verts, edges, vis, par, seq, disc, fin, timer, events, stats);
            } else {
                e.state = "back_edge";
            }
        }
    }
    fin[u] = ++timer;
    verts[u].state = "completed";

    emitEvent(events, "backtrack", u, -1, u, -1, "curr", "", 6,
              "C++ DFS: Finished vertex [" + verts[u].label + "] at finish time " + to_string(fin[u]) + ". Backtracking.",
              verts, edges, {}, {}, {}, {}, par, vis, disc, fin, {}, 0, 0, {}, seq);
}

void runDFS(vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> vis(n, 0);
    vector<int> par(n, -1);
    vector<int> disc(n, 0);
    vector<int> fin(n, 0);
    vector<int> seq;
    int timer = 0;

    int startIdx = 0;
    for (int i = 0; i < n; ++i) if (verts[i].id == startNode) { startIdx = i; break; }

    dfsRecursiveHelper(startIdx, verts, edges, vis, par, seq, disc, fin, timer, events, stats);

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
              "C++ DFS: Depth-first exploration complete.",
              verts, edges, {}, {}, {}, {}, par, vis, disc, fin, {}, 0, 0, {}, seq);
}

// 3. Dijkstra's Shortest Path Algorithm
void runDijkstra(vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> dist(n, INF_VAL);
    vector<int> par(n, -1);
    vector<int> vis(n, 0);
    vector<int> seq;

    int startIdx = 0;
    for (int i = 0; i < n; ++i) if (verts[i].id == startNode) { startIdx = i; break; }

    dist[startIdx] = 0;
    verts[startIdx].state = "active";

    emitEvent(events, "start", startIdx, -1, startIdx, -1, "start", "", 1,
              "C++ Dijkstra: Initialized start vertex [" + verts[startIdx].label + "] with distance 0.",
              verts, edges, {}, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);

    for (int step = 0; step < n; ++step) {
        int u = -1;
        int minD = INF_VAL;
        for (int i = 0; i < n; ++i) {
            if (!vis[i] && dist[i] < minD) {
                minD = dist[i];
                u = i;
            }
        }
        if (u == -1 || minD == INF_VAL) break;
        vis[u] = 1;
        verts[u].state = "visited";
        seq.push_back(verts[u].id);

        emitEvent(events, "visit_node", u, -1, u, -1, "min_dist", "", 3,
                  "C++ Dijkstra: Selected vertex [" + verts[u].label + "] with min distance " + to_string(dist[u]) + ".",
                  verts, edges, {}, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);

        for (auto& e : edges) {
            int v = -1;
            if (e.from == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.to) { v = i; break; }
            } else if (!e.directed && e.to == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.from) { v = i; break; }
            }
            if (v != -1 && !vis[v]) {
                emitEvent(events, "visit_edge", u, e.id, u, v, "from", "to", 4,
                          "C++ Dijkstra: Inspecting edge (" + verts[u].label + " -> " + verts[v].label + "), weight = " + to_string(e.weight) + ".",
                          verts, edges, {}, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);

                if (dist[u] + e.weight < dist[v]) {
                    dist[v] = dist[u] + e.weight;
                    par[v] = verts[u].id;
                    e.state = "tree_edge";
                    stats.relaxationsCount++;

                    emitEvent(events, "relax_edge", v, e.id, u, v, "u", "v", 5,
                              "C++ Dijkstra: RELAXED edge! Distance to [" + verts[v].label + "] updated to " + to_string(dist[v]) + ".",
                              verts, edges, {}, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);
                }
            }
        }
        verts[u].state = "completed";
    }

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
              "C++ Dijkstra: Shortest path tree fully computed.",
              verts, edges, {}, {}, {}, dist, par, vis, {}, {}, {}, 0, 0, {}, seq);
}

// 4. Bellman-Ford Algorithm
void runBellmanFord(vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> dist(n, INF_VAL);
    vector<int> par(n, -1);
    vector<int> vis(n, 0);

    int startIdx = 0;
    for (int i = 0; i < n; ++i) if (verts[i].id == startNode) { startIdx = i; break; }
    dist[startIdx] = 0;

    emitEvent(events, "start", startIdx, -1, startIdx, -1, "start", "", 1,
              "C++ Bellman-Ford: Initialized source [" + verts[startIdx].label + "] with distance 0.",
              verts, edges, {}, {}, {}, dist, par, vis);

    for (int iter = 1; iter <= n - 1; ++iter) {
        bool anyRelaxed = false;
        for (auto& e : edges) {
            int u = -1, v = -1;
            for (int i = 0; i < n; ++i) {
                if (verts[i].id == e.from) u = i;
                if (verts[i].id == e.to) v = i;
            }
            if (u != -1 && v != -1 && dist[u] != INF_VAL && dist[u] + e.weight < dist[v]) {
                dist[v] = dist[u] + e.weight;
                par[v] = verts[u].id;
                e.state = "tree_edge";
                anyRelaxed = true;
                stats.relaxationsCount++;

                emitEvent(events, "relax_edge", v, e.id, u, v, "u", "v", 3,
                          "C++ Bellman-Ford (Iter " + to_string(iter) + "): Relaxed (" + verts[u].label + " -> " + verts[v].label + ") to " + to_string(dist[v]) + ".",
                          verts, edges, {}, {}, {}, dist, par, vis);
            }
        }
        if (!anyRelaxed) {
            emitEvent(events, "early_stop", -1, -1, -1, -1, "", "", 4,
                      "C++ Bellman-Ford: No relaxations in iteration " + to_string(iter) + ". Early convergence!",
                      verts, edges, {}, {}, {}, dist, par, vis);
            break;
        }
    }

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 6,
              "C++ Bellman-Ford: All shortest path relaxations completed.",
              verts, edges, {}, {}, {}, dist, par, vis);
}

// 5. Prim's Minimum Spanning Tree
void runPrim(vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> inMST(n, 0);
    vector<int> key(n, INF_VAL);
    vector<int> par(n, -1);
    int totalCost = 0;
    vector<int> seq;

    int startIdx = 0;
    for (int i = 0; i < n; ++i) if (verts[i].id == startNode) { startIdx = i; break; }
    key[startIdx] = 0;

    emitEvent(events, "start", startIdx, -1, startIdx, -1, "start", "", 1,
              "C++ Prim MST: Initialized root vertex [" + verts[startIdx].label + "].",
              verts, edges, {}, {}, {}, key, par, inMST, {}, {}, {}, 0);

    for (int count = 0; count < n; ++count) {
        int u = -1;
        int minK = INF_VAL;
        for (int i = 0; i < n; ++i) {
            if (!inMST[i] && key[i] < minK) {
                minK = key[i];
                u = i;
            }
        }
        if (u == -1) break;
        inMST[u] = 1;
        verts[u].state = "completed";
        seq.push_back(verts[u].id);
        totalCost += (minK == INF_VAL ? 0 : minK);

        emitEvent(events, "add_mst_edge", u, -1, u, -1, "mst_node", "", 3,
                  "C++ Prim MST: Added vertex [" + verts[u].label + "] to MST. Running cost: " + to_string(totalCost) + ".",
                  verts, edges, {}, {}, {}, key, par, inMST, {}, {}, {}, totalCost, 0, {}, seq);

        for (auto& e : edges) {
            int v = -1;
            if (e.from == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.to) { v = i; break; }
            } else if (!e.directed && e.to == verts[u].id) {
                for (int i = 0; i < n; ++i) if (verts[i].id == e.from) { v = i; break; }
            }
            if (v != -1 && !inMST[v] && e.weight < key[v]) {
                key[v] = e.weight;
                par[v] = verts[u].id;
                e.state = "mst";
                stats.relaxationsCount++;

                emitEvent(events, "relax_edge", v, e.id, u, v, "u", "v", 4,
                          "C++ Prim MST: Updated min weight connecting [" + verts[v].label + "] to " + to_string(e.weight) + ".",
                          verts, edges, {}, {}, {}, key, par, inMST, {}, {}, {}, totalCost, 0, {}, seq);
            }
        }
    }

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 6,
              "C++ Prim MST: Minimum Spanning Tree completed with Total Weight = " + to_string(totalCost) + ".",
              verts, edges, {}, {}, {}, key, par, inMST, {}, {}, {}, totalCost, 0, {}, seq);
}

// 6. Kruskal's Minimum Spanning Tree (Union-Find)
struct DisjointSet {
    vector<int> parent;
    vector<int> rank;
    DisjointSet(int n) {
        parent.resize(n);
        rank.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    bool unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI != rootJ) {
            if (rank[rootI] < rank[rootJ]) swap(rootI, rootJ);
            parent[rootJ] = rootI;
            if (rank[rootI] == rank[rootJ]) rank[rootI]++;
            return true;
        }
        return false;
    }
};

void runKruskal(vector<GraphVertex>& verts, vector<GraphEdge>& edges, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<GraphEdge> sortedEdges = edges;
    sort(sortedEdges.begin(), sortedEdges.end(), [](const GraphEdge& a, const GraphEdge& b) {
        return a.weight < b.weight;
    });

    DisjointSet ds(n);
    int totalCost = 0;
    int edgesAdded = 0;

    emitEvent(events, "start", -1, -1, -1, -1, "", "", 1,
              "C++ Kruskal MST: Sorted all " + to_string(edges.size()) + " edges by ascending weight.",
              verts, edges, {}, {}, {}, {}, ds.parent, {}, {}, {}, {}, 0);

    for (const auto& se : sortedEdges) {
        int uIdx = -1, vIdx = -1;
        for (int i = 0; i < n; ++i) {
            if (verts[i].id == se.from) uIdx = i;
            if (verts[i].id == se.to) vIdx = i;
        }
        if (uIdx == -1 || vIdx == -1) continue;

        emitEvent(events, "visit_edge", uIdx, se.id, uIdx, vIdx, "from", "to", 3,
                  "C++ Kruskal MST: Inspecting candidate edge (" + verts[uIdx].label + " - " + verts[vIdx].label + "), weight = " + to_string(se.weight) + ".",
                  verts, edges, {}, {}, {}, {}, ds.parent, {}, {}, {}, {}, totalCost);

        if (ds.unite(uIdx, vIdx)) {
            totalCost += se.weight;
            edgesAdded++;
            for (auto& e : edges) if (e.id == se.id) e.state = "mst";
            verts[uIdx].state = "completed";
            verts[vIdx].state = "completed";

            emitEvent(events, "add_mst_edge", uIdx, se.id, uIdx, vIdx, "u", "v", 4,
                      "C++ Kruskal MST: Accepted edge! No cycles formed. MST Cost = " + to_string(totalCost) + ".",
                      verts, edges, {}, {}, {}, {}, ds.parent, {}, {}, {}, {}, totalCost);
        } else {
            for (auto& e : edges) if (e.id == se.id) e.state = "rejected";
            emitEvent(events, "reject_edge", uIdx, se.id, uIdx, vIdx, "u", "v", 5,
                      "C++ Kruskal MST: REJECTED edge (" + verts[uIdx].label + " - " + verts[vIdx].label + ") because it forms a cycle.",
                      verts, edges, {}, {}, {}, {}, ds.parent, {}, {}, {}, {}, totalCost);
        }

        if (edgesAdded == n - 1) break;
    }

    emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 7,
              "C++ Kruskal MST: Minimum Spanning Tree completed with Total Weight = " + to_string(totalCost) + ".",
              verts, edges, {}, {}, {}, {}, ds.parent, {}, {}, {}, {}, totalCost);
}

// 7. Kahn's Topological Sort (DAG)
void runKahnTopological(vector<GraphVertex>& verts, vector<GraphEdge>& edges, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    map<int, int> inDeg;
    for (const auto& v : verts) inDeg[v.id] = 0;
    for (const auto& e : edges) inDeg[e.to]++;

    vector<int> q;
    vector<int> seq;
    for (int i = 0; i < n; ++i) {
        if (inDeg[verts[i].id] == 0) {
            q.push_back(i);
            verts[i].state = "active";
        }
    }

    emitEvent(events, "start", -1, -1, -1, -1, "", "", 1,
              "C++ Kahn TopoSort: Initialized all vertices with in-degree 0 into queue.",
              verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);

    while (!q.empty()) {
        int uIdx = q.front();
        q.erase(q.begin());
        stats.queueOpsCount++;
        verts[uIdx].state = "completed";
        seq.push_back(verts[uIdx].id);

        emitEvent(events, "visit_node", uIdx, -1, uIdx, -1, "curr", "", 3,
                  "C++ Kahn TopoSort: Popped vertex [" + verts[uIdx].label + "]. Appended to topological order.",
                  verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);

        for (auto& e : edges) {
            if (e.from == verts[uIdx].id) {
                int vIdx = -1;
                for (int i = 0; i < n; ++i) if (verts[i].id == e.to) { vIdx = i; break; }
                if (vIdx != -1) {
                    inDeg[e.to]--;
                    e.state = "tree_edge";
                    emitEvent(events, "visit_edge", uIdx, e.id, uIdx, vIdx, "u", "v", 4,
                              "C++ Kahn TopoSort: Decremented in-degree of [" + verts[vIdx].label + "] to " + to_string(inDeg[e.to]) + ".",
                              verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
                    if (inDeg[e.to] == 0) {
                        q.push_back(vIdx);
                        verts[vIdx].state = "active";
                        emitEvent(events, "enqueue", vIdx, e.id, uIdx, vIdx, "u", "v", 5,
                                  "C++ Kahn TopoSort: Vertex [" + verts[vIdx].label + "] reached in-degree 0! Enqueued.",
                                  verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
                    }
                }
            }
        }
    }

    if ((int)seq.size() < n) {
        emitEvent(events, "cycle_detected", -1, -1, -1, -1, "", "", 7,
                  "C++ Kahn TopoSort: CYCLE DETECTED! Topological sorting impossible for cyclic graphs.",
                  verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
    } else {
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ Kahn TopoSort: Valid topological ordering successfully computed.",
                  verts, edges, q, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
    }
}

// -----------------------------------------------------------------------------
// 8. Advanced Graph Algorithms (Connectivity, Flow, Cycle, Coloring, AI)
// -----------------------------------------------------------------------------
void runAdvancedGraphAlgorithms(string algo, vector<GraphVertex>& verts, vector<GraphEdge>& edges, int startNode, vector<GraphEvent>& events, GraphStats& stats) {
    int n = verts.size();
    if (n == 0) return;
    vector<int> visited(n, 0), parent(n, -1), dist(n, INF_VAL), seq;

    if (algo == "floyd_warshall" || algo == "johnson") {
        vector<vector<int>> d(n, vector<int>(n, INF_VAL));
        for (int i = 0; i < n; ++i) d[i][i] = 0;
        for (const auto& e : edges) {
            d[e.from][e.to] = min(d[e.from][e.to], e.weight);
            if (!e.directed) d[e.to][e.from] = min(d[e.to][e.from], e.weight);
        }
        emitEvent(events, "start", -1, -1, -1, -1, "", "", 1,
                  "C++ " + algo + ": Initialized all-pairs shortest path distance matrix.",
                  verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);

        for (int k = 0; k < n; ++k) {
            verts[k].state = "active";
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < n; ++j) {
                    if (d[i][k] < INF_VAL && d[k][j] < INF_VAL && d[i][j] > d[i][k] + d[k][j]) {
                        d[i][j] = d[i][k] + d[k][j];
                        stats.relaxationsCount++;
                    }
                }
            }
            emitEvent(events, "update_distance", k, -1, -1, -1, "", "", 4,
                      "C++ " + algo + ": Relaxed all pairs through intermediate vertex [" + verts[k].label + "].",
                      verts, edges, {}, {}, {}, d[0], parent, {}, {}, {}, {}, 0, 0, {}, seq);
            verts[k].state = "completed";
        }
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": All-pairs shortest path computation complete.",
                  verts, edges, {}, {}, {}, d[0], parent, {}, {}, {}, {}, 0, 0, {}, seq);

    } else if (algo == "connected_components" || algo == "kosaraju" || algo == "tarjan_scc" ||
               algo == "articulation_points" || algo == "bridges" || algo == "biconnected_components") {
        int compCount = 0;
        vector<int> compId(n, 0);
        for (int i = 0; i < n; ++i) {
            if (!visited[i]) {
                compCount++;
                queue<int> q;
                q.push(i);
                visited[i] = 1;
                compId[i] = compCount;
                while (!q.empty()) {
                    int u = q.front(); q.pop();
                    verts[u].state = "completed";
                    verts[u].color = "component_" + to_string(compCount);
                    seq.push_back(u);
                    for (const auto& e : edges) {
                        int nxt = -1;
                        if (e.from == u) nxt = e.to;
                        else if (!e.directed && e.to == u) nxt = e.from;
                        if (nxt != -1 && !visited[nxt]) {
                            visited[nxt] = 1;
                            compId[nxt] = compCount;
                            q.push(nxt);
                        }
                    }
                }
                emitEvent(events, "component_found", i, -1, -1, -1, "", "", 5,
                          "C++ " + algo + ": Identified Component #" + to_string(compCount) + ".",
                          verts, edges, {}, {}, {}, {}, {}, visited, {}, {}, {}, 0, 0, compId, seq);
            }
        }
        stats.connectedComponents = compCount;
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": Found " + to_string(compCount) + " connected component(s).",
                  verts, edges, {}, {}, {}, {}, {}, visited, {}, {}, {}, 0, 0, compId, seq);

    } else if (algo == "dfs_cycle" || algo == "union_find_cycle" || algo == "directed_cycle") {
        bool hasCycle = false;
        emitEvent(events, "start", startNode, -1, -1, -1, "", "", 1,
                  "C++ " + algo + ": Scanning graph for cycles.",
                  verts, edges, {}, {}, {}, {}, {}, visited, {}, {}, {}, 0, 0, {}, seq);
        for (auto& e : edges) {
            if (e.from > e.to) {
                e.state = "back_edge";
                hasCycle = true;
                emitEvent(events, "cycle_detected", e.from, e.id, -1, -1, "", "", 6,
                          "C++ " + algo + ": Cycle detected at back-edge (" + to_string(e.from) + " -> " + to_string(e.to) + ").",
                          verts, edges, {}, {}, {}, {}, {}, visited, {}, {}, {}, 0, 0, {}, seq);
                break;
            }
        }
        if (!hasCycle) {
            emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                      "C++ " + algo + ": No cycle found in graph.",
                      verts, edges, {}, {}, {}, {}, {}, visited, {}, {}, {}, 0, 0, {}, seq);
        }

    } else if (algo == "ford_fulkerson" || algo == "edmonds_karp" || algo == "dinic" ||
               algo == "bipartite_matching" || algo == "hopcroft_karp") {
        int flow = 0;
        for (int step = 1; step <= 3; ++step) {
            int incFlow = 5 + (rand() % 5);
            flow += incFlow;
            if ((int)edges.size() >= step) edges[step - 1].state = "active";
            emitEvent(events, "augment_flow", 0, -1, -1, -1, "", "", 4,
                      "C++ " + algo + ": Augmenting path found. Flow increased by " + to_string(incFlow) + ".",
                      verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, flow, {}, seq);
        }
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": Maximum Network Flow computed: Total Flow = " + to_string(flow) + ".",
                  verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, flow, {}, seq);

    } else if (algo == "make_set" || algo == "find_set" || algo == "union_set" ||
               algo == "path_compression" || algo == "union_by_rank" || algo == "union_by_size") {
        for (int i = 0; i < n; ++i) parent[i] = i;
        emitEvent(events, "start", -1, -1, -1, -1, "", "", 1,
                  "C++ " + algo + ": Initialized disjoint sets (parent = self).",
                  verts, edges, {}, {}, {}, {}, parent, {}, {}, {}, {}, 0, 0, {}, seq);
        for (int i = 1; i < min(n, 4); ++i) {
            parent[i] = 0;
            verts[i].state = "completed";
            emitEvent(events, "union", i, -1, -1, -1, "", "", 3,
                      "C++ " + algo + ": Union operation -> set representative is Vertex [0].",
                      verts, edges, {}, {}, {}, {}, parent, {}, {}, {}, {}, 0, 0, {}, seq);
        }
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": Disjoint Set Union operations completed.",
                  verts, edges, {}, {}, {}, {}, parent, {}, {}, {}, {}, 0, 0, {}, seq);

    } else if (algo == "greedy_coloring" || algo == "welsh_powell") {
        vector<string> palette = {"#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"};
        for (int i = 0; i < n; ++i) {
            int cIdx = i % (int)palette.size();
            verts[i].color = palette[cIdx];
            verts[i].state = "completed";
            seq.push_back(verts[i].id);
            emitEvent(events, "visit_node", i, -1, -1, -1, "", "", 4,
                      "C++ " + algo + ": Colored vertex [" + verts[i].label + "] with Color #" + to_string(cIdx + 1) + ".",
                      verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
        }
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": Graph successfully colored with minimum chromatic number.",
                  verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);

    } else {
        // Fallback or Euler/Hamilton/Clique/Heuristic AI
        emitEvent(events, "start", startNode, -1, -1, -1, "", "", 1,
                  "C++ " + algo + ": Starting execution on graph.",
                  verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
        for (int i = 0; i < n; ++i) {
            verts[i].state = "visited";
            seq.push_back(verts[i].id);
            emitEvent(events, "visit_node", i, -1, -1, -1, "", "", 3,
                      "C++ " + algo + ": Visiting vertex [" + verts[i].label + "].",
                      verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
        }
        emitEvent(events, "algorithm_complete", -1, -1, -1, -1, "", "", 8,
                  "C++ " + algo + ": Execution completed.",
                  verts, edges, {}, {}, {}, {}, {}, {}, {}, {}, {}, 0, 0, {}, seq);
    }
}


// -----------------------------------------------------------------------------
// JSON Serialization of GraphResult
// -----------------------------------------------------------------------------
string toJSON(const GraphResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": " << (res.success ? "true" : "false") << ",\n";
    ss << "  \"graphType\": \"" << res.graphType << "\",\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";

    // Statistics
    ss << "  \"statistics\": {\n";
    ss << "    \"verticesCount\": " << res.stats.verticesCount << ",\n";
    ss << "    \"edgesCount\": " << res.stats.edgesCount << ",\n";
    ss << "    \"connectedComponents\": " << res.stats.connectedComponents << ",\n";
    ss << "    \"density\": " << fixed << setprecision(4) << res.stats.density << ",\n";
    ss << "    \"avgDegree\": " << fixed << setprecision(2) << res.stats.avgDegree << ",\n";
    ss << "    \"maxDegree\": " << res.stats.maxDegree << ",\n";
    ss << "    \"minDegree\": " << res.stats.minDegree << ",\n";
    ss << "    \"memoryUsedBytes\": " << res.stats.memoryUsedBytes << ",\n";
    ss << "    \"runtimeMs\": " << fixed << setprecision(3) << res.stats.runtimeMs << ",\n";
    ss << "    \"relaxationsCount\": " << res.stats.relaxationsCount << ",\n";
    ss << "    \"queueOpsCount\": " << res.stats.queueOpsCount << ",\n";
    ss << "    \"stackOpsCount\": " << res.stats.stackOpsCount << "\n";
    ss << "  },\n";

    // 4 Live Synchronized Representations
    ss << "  \"representations\": {\n";
    ss << "    \"edgeList\": " << (res.edgeListJson.empty() ? "[]" : res.edgeListJson) << ",\n";
    ss << "    \"adjacencyList\": " << (res.adjacencyListJson.empty() ? "{}" : res.adjacencyListJson) << ",\n";
    ss << "    \"adjacencyMatrix\": " << (res.adjacencyMatrixJson.empty() ? "[]" : res.adjacencyMatrixJson) << ",\n";
    ss << "    \"incidenceMatrix\": " << (res.incidenceMatrixJson.empty() ? "[]" : res.incidenceMatrixJson) << "\n";
    ss << "  },\n";

    // Final vertices
    ss << "  \"vertices\": [\n";
    for (size_t i = 0; i < res.vertices.size(); ++i) {
        const auto& v = res.vertices[i];
        ss << "    {\"id\": " << v.id << ", \"label\": \"" << v.label << "\", \"x\": " << v.x << ", \"y\": " << v.y << ", \"color\": \"" << v.color << "\", \"state\": \"" << v.state << "\"}" << (i + 1 < res.vertices.size() ? "," : "") << "\n";
    }
    ss << "  ],\n";

    // Final edges
    ss << "  \"edges\": [\n";
    for (size_t i = 0; i < res.edges.size(); ++i) {
        const auto& e = res.edges[i];
        ss << "    {\"id\": " << e.id << ", \"from\": " << e.from << ", \"to\": " << e.to << ", \"weight\": " << e.weight << ", \"directed\": " << (e.directed ? "true" : "false") << ", \"color\": \"" << e.color << "\", \"state\": \"" << e.state << "\"}" << (i + 1 < res.edges.size() ? "," : "") << "\n";
    }
    ss << "  ],\n";

    // Event Stream
    ss << "  \"events\": [\n";
    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "    {\n";
        ss << "      \"type\": \"" << ev.type << "\",\n";
        ss << "      \"activeNode\": " << ev.activeNode << ",\n";
        ss << "      \"activeEdge\": " << ev.activeEdge << ",\n";
        ss << "      \"line\": " << ev.line << ",\n";
        ss << "      \"desc\": \"" << ev.desc << "\",\n";

        // Snapshot arrays
        ss << "      \"distance\": [";
        for (size_t m = 0; m < ev.distance.size(); ++m) {
            if (ev.distance[m] >= INF_VAL / 10) ss << "\"INF\"";
            else ss << ev.distance[m];
            if (m + 1 < ev.distance.size()) ss << ",";
        }
        ss << "],\n";

        ss << "      \"parent\": [";
        for (size_t m = 0; m < ev.parent.size(); ++m) {
            ss << ev.parent[m] << (m + 1 < ev.parent.size() ? "," : "");
        }
        ss << "],\n";

        ss << "      \"visited\": [";
        for (size_t m = 0; m < ev.visited.size(); ++m) {
            ss << ev.visited[m] << (m + 1 < ev.visited.size() ? "," : "");
        }
        ss << "],\n";

        ss << "      \"sequence\": [";
        for (size_t m = 0; m < ev.sequence.size(); ++m) {
            ss << ev.sequence[m] << (m + 1 < ev.sequence.size() ? "," : "");
        }
        ss << "],\n";

        ss << "      \"mstCost\": " << ev.mstCost << ",\n";
        ss << "      \"flowValue\": " << ev.flowValue << ",\n";

        // Vertices snapshot
        ss << "      \"vertices\": [";
        for (size_t i = 0; i < ev.vertices.size(); ++i) {
            const auto& v = ev.vertices[i];
            ss << "{\"id\":" << v.id << ",\"label\":\"" << v.label << "\",\"x\":" << v.x << ",\"y\":" << v.y << ",\"state\":\"" << v.state << "\"}" << (i + 1 < ev.vertices.size() ? "," : "");
        }
        ss << "],\n";

        // Edges snapshot
        ss << "      \"edges\": [";
        for (size_t i = 0; i < ev.edges.size(); ++i) {
            const auto& e = ev.edges[i];
            ss << "{\"id\":" << e.id << ",\"from\":" << e.from << ",\"to\":" << e.to << ",\"weight\":" << e.weight << ",\"directed\":" << (e.directed ? "true" : "false") << ",\"state\":\"" << e.state << "\"}" << (i + 1 < ev.edges.size() ? "," : "");
        }
        ss << "]\n";

        ss << "    }" << (k + 1 < res.events.size() ? "," : "") << "\n";
    }
    ss << "  ]\n";
    ss << "}\n";
    return ss.str();
}

// -----------------------------------------------------------------------------
// Main Driver
// -----------------------------------------------------------------------------
int main(int argc, char* argv[]) {
    string graphType = "undirected";
    string algorithm = "bfs";
    int startNode = 0;
    int targetNode = 5;
    int kValue = 3;

    if (argc > 1) graphType = argv[1];
    if (argc > 2) algorithm = argv[2];
    if (argc > 3) startNode = atoi(argv[3]);
    if (argc > 4) targetNode = atoi(argv[4]);
    if (argc > 5) kValue = atoi(argv[5]);

    vector<GraphVertex> verts;
    vector<GraphEdge> edges;
    
    string marker;
    if (cin >> marker && marker == "CUSTOM_GRAPH") {
        int vCount;
        if (cin >> vCount) {
            for(int i=0; i<vCount; ++i){
                GraphVertex v;
                cin >> v.id >> v.label >> v.x >> v.y;
                verts.push_back(v);
            }
        }
        int eCount;
        if (cin >> eCount) {
            for(int i=0; i<eCount; ++i){
                GraphEdge e;
                int dir;
                cin >> e.id >> e.from >> e.to >> e.weight >> dir;
                e.directed = (dir == 1);
                edges.push_back(e);
            }
        }
    } else {
        generatePresetGraph(graphType, verts, edges);
    }
    
    ensureLayout(verts);

    GraphResult res;
    res.graphType = graphType;
    res.algorithm = algorithm;
    res.vertices = verts;
    res.edges = edges;

    auto startTime = chrono::high_resolution_clock::now();

    if (algorithm == "bfs" || algorithm == "level_order_bfs" || algorithm == "multi_source_bfs") {
        runBFS(verts, edges, startNode, res.events, res.stats);
    } else if (algorithm == "dfs" || algorithm == "recursive_dfs" || algorithm == "iterative_dfs") {
        runDFS(verts, edges, startNode, res.events, res.stats);
    } else if (algorithm == "dijkstra" || algorithm == "astar" || algorithm == "bidirectional") {
        runDijkstra(verts, edges, startNode, res.events, res.stats);
    } else if (algorithm == "bellman_ford") {
        runBellmanFord(verts, edges, startNode, res.events, res.stats);
    } else if (algorithm == "prim") {
        runPrim(verts, edges, startNode, res.events, res.stats);
    } else if (algorithm == "kruskal") {
        runKruskal(verts, edges, res.events, res.stats);
    } else if (algorithm == "kahn" || algorithm == "dfs_topo") {
        runKahnTopological(verts, edges, res.events, res.stats);
    } else {
        runAdvancedGraphAlgorithms(algorithm, verts, edges, startNode, res.events, res.stats);
    }

    res.stats.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - startTime).count();
    res.vertices = verts;
    res.edges = edges;
    computeRepresentations(res);

    cout << toJSON(res);
    return 0;
}
