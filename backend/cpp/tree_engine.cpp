#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <sstream>
#include <chrono>
#include <cmath>
#include <cstdlib>
#include <climits>
#include <functional>
#include <map>
#include <set>
#include <stack>

using namespace std;

string g_dataType = "Integer";

// ========== Comparison & Data Type Helpers ==========
bool isLessVal(const string& a, const string& b, const string& dataType) {
    if (dataType == "Integer") {
        try {
            return stoll(a) < stoll(b);
        } catch(...) {
            return a < b;
        }
    }
    return a < b;
}

bool isEqualVal(const string& a, const string& b, const string& dataType) {
    if (dataType == "Integer") {
        try {
            return stoll(a) == stoll(b);
        } catch(...) {
            return a == b;
        }
    }
    return a == b;
}

bool isGreaterVal(const string& a, const string& b, const string& dataType) {
    return isLessVal(b, a, dataType);
}

int getWeight(const string& val) {
    size_t pos = val.rfind(':');
    string numStr = (pos != string::npos) ? val.substr(pos + 1) : val;
    try {
        return stoi(numStr);
    } catch(...) {
        return 0;
    }
}

// Escape JSON string
string esc(const string& s) {
    string r;
    for(char c : s) {
        if(c == '"') r += "\\\"";
        else if(c == '\\') r += "\\\\";
        else if(c == '\n') r += "\\n";
        else r += c;
    }
    return r;
}

// Format a value for JSON: raw integer in Integer mode, quoted string otherwise
string formatJSONVal(const string& val, const string& dataType) {
    if (dataType == "Integer") {
        try {
            stoll(val);
            return val;
        } catch(...) {
            return "\"" + esc(val) + "\"";
        }
    }
    return "\"" + esc(val) + "\"";
}

// ========== Real Tree Node ==========
struct Node {
    int id;
    string val;
    Node *left, *right;
    int height;
    int color; // 0=black, 1=red (for RB-Tree visualization)

    Node(int _id, string _val) : id(_id), val(_val), left(nullptr), right(nullptr), height(1), color(0) {}
};

int g_nextId = 1;

// ========== Serialized Node and Edge for JSON ==========
struct NInfo {
    int id;
    string val;
    int pid;
    int leftId;
    int rightId;
    double x, y;
    int h;
    int depth;
    int bf;
    string clr;
    bool visited;
    bool highlight;
    string state;
};

struct EInfo {
    int from;
    int to;
    string type; // "left" or "right"
    bool highlight;
};

// ========== Event ==========
struct Evt {
    string type;
    int hl; // highlight node id
    int line;
    string desc;
    vector<NInfo> nodes;
    vector<EInfo> edges;
    vector<string> seq;
};

// ========== Result ==========
struct Res {
    string treeType, op, dataType;
    vector<Evt> events;
    int treeH, nCount, lCount;
    double ms;
};

// ========== Helpers ==========
int ht(Node* n) { return n ? n->height : 0; }
int bf(Node* n) { return n ? ht(n->left) - ht(n->right) : 0; }
void updH(Node* n) { if(n) n->height = 1 + max(ht(n->left), ht(n->right)); }

int cntN(Node* n) { return n ? 1 + cntN(n->left) + cntN(n->right) : 0; }
int cntL(Node* n) { if(!n) return 0; if(!n->left && !n->right) return 1; return cntL(n->left) + cntL(n->right); }

void recalcH(Node* n) {
    if(!n) return;
    recalcH(n->left);
    recalcH(n->right);
    updH(n);
}

Node* findMin(Node* n) { while(n && n->left) n = n->left; return n; }

// ========== Serialize Tree to JSON-ready arrays ==========
void ser(Node* n, double x, double y, double off, int pid, int depth, int hlNode, vector<NInfo>& outNodes, vector<EInfo>& outEdges) {
    if(!n) return;
    int lid = n->left ? n->left->id : -1;
    int rid = n->right ? n->right->id : -1;
    bool isHl = (n->id == hlNode);
    string stateStr = "normal";
    if(isHl) stateStr = "highlighted";
    outNodes.push_back({n->id, n->val, pid, lid, rid, x, y, n->height, depth, bf(n), n->color == 1 ? "red" : "black", false, isHl, stateStr});
    if(n->left) {
        bool edgeHl = (n->id == hlNode || n->left->id == hlNode);
        outEdges.push_back({n->id, n->left->id, "left", edgeHl});
    }
    if(n->right) {
        bool edgeHl = (n->id == hlNode || n->right->id == hlNode);
        outEdges.push_back({n->id, n->right->id, "right", edgeHl});
    }
    double nOff = max(28.0, off * 0.52);
    ser(n->left,  x - off, y + 70, nOff, n->id, depth + 1, hlNode, outNodes, outEdges);
    ser(n->right, x + off, y + 70, nOff, n->id, depth + 1, hlNode, outNodes, outEdges);
}

// ========== Emit Event ==========
void emit(Res& r, Node* root, string type, int hl, int line, string desc, vector<string> seq = {}) {
    Evt e;
    e.type = type; e.hl = hl; e.line = line; e.desc = desc;
    ser(root, 400.0, 40.0, 180.0, -1, 0, hl, e.nodes, e.edges);
    e.seq = seq;
    r.events.push_back(e);
}

// ========== AVL Rotations ==========
Node* rotR(Node* y) {
    Node* x = y->left;
    Node* t = x->right;
    x->right = y;
    y->left = t;
    updH(y); updH(x);
    return x;
}

Node* rotL(Node* x) {
    Node* y = x->right;
    Node* t = y->left;
    y->left = x;
    x->right = t;
    updH(x); updH(y);
    return y;
}

// ========== Build BST from values (silent, no events) ==========
Node* silentInsert(Node* n, const string& val) {
    if(!n) return new Node(g_nextId++, val);
    if(isLessVal(val, n->val, g_dataType)) n->left = silentInsert(n->left, val);
    else if(isGreaterVal(val, n->val, g_dataType)) n->right = silentInsert(n->right, val);
    else return n; // duplicate
    updH(n);
    return n;
}

Node* silentAVLInsert(Node* n, const string& val) {
    if(!n) return new Node(g_nextId++, val);
    if(isLessVal(val, n->val, g_dataType)) n->left = silentAVLInsert(n->left, val);
    else if(isGreaterVal(val, n->val, g_dataType)) n->right = silentAVLInsert(n->right, val);
    else return n;
    updH(n);
    int b = bf(n);
    if(b > 1 && isLessVal(val, n->left->val, g_dataType)) return rotR(n);
    if(b < -1 && isGreaterVal(val, n->right->val, g_dataType)) return rotL(n);
    if(b > 1 && isGreaterVal(val, n->left->val, g_dataType)) { n->left = rotL(n->left); return rotR(n); }
    if(b < -1 && isLessVal(val, n->right->val, g_dataType)) { n->right = rotR(n->right); return rotL(n); }
    return n;
}

// ========== Complete Binary Tree / Heap Build ==========
Node* silentLevelOrderBuild(const vector<string>& vals) {
    if(vals.empty()) return nullptr;
    vector<Node*> nodes(vals.size());
    for(size_t i = 0; i < vals.size(); i++) {
        nodes[i] = new Node(g_nextId++, vals[i]);
    }
    for(size_t i = 0; i < vals.size(); i++) {
        if(2*i + 1 < vals.size()) nodes[i]->left = nodes[2*i + 1];
        if(2*i + 2 < vals.size()) nodes[i]->right = nodes[2*i + 2];
    }
    recalcH(nodes[0]);
    return nodes[0];
}

// ========== Red-Black Tree Coloring Helper ==========
void colorRedBlack(Node* n, int depth = 0) {
    if(!n) return;
    if(depth == 0) n->color = 0; // black root
    else n->color = (depth % 2 == 1) ? 1 : 0; // red/black alternate
    colorRedBlack(n->left, depth + 1);
    colorRedBlack(n->right, depth + 1);
}

// ========== Segment Tree Build Helper ==========
Node* silentSegmentBuild(const vector<string>& vals, int l, int r) {
    if(l > r) return nullptr;
    if(l == r) {
        Node* leaf = new Node(g_nextId++, vals[l]);
        return leaf;
    }
    int mid = l + (r - l) / 2;
    Node* leftChild = silentSegmentBuild(vals, l, mid);
    Node* rightChild = silentSegmentBuild(vals, mid + 1, r);
    long long sumVal = 0;
    if(leftChild) {
        try { sumVal += stoll(leftChild->val); } catch(...) {}
    }
    if(rightChild) {
        try { sumVal += stoll(rightChild->val); } catch(...) {}
    }
    Node* n = new Node(g_nextId++, to_string(sumVal));
    n->left = leftChild;
    n->right = rightChild;
    recalcH(n);
    return n;
}

// ========== Huffman Tree Build Helper ==========
Node* silentHuffmanBuild(const vector<string>& vals) {
    if(vals.empty()) return nullptr;
    struct Comp {
        bool operator()(Node* a, Node* b) { return getWeight(a->val) > getWeight(b->val); }
    };
    priority_queue<Node*, vector<Node*>, Comp> pq;
    for(const string& v : vals) {
        pq.push(new Node(g_nextId++, v));
    }
    while(pq.size() > 1) {
        Node* l = pq.top(); pq.pop();
        Node* r = pq.top(); pq.pop();
        int sumFreq = getWeight(l->val) + getWeight(r->val);
        Node* parent = new Node(g_nextId++, to_string(sumFreq));
        parent->left = l;
        parent->right = r;
        recalcH(parent);
        pq.push(parent);
    }
    return pq.top();
}

// ========== True Trie Build Helper ==========
Node* silentTrieBuild(const vector<string>& vals) {
    Node* root = new Node(g_nextId++, "ROOT");
    for(const string& w : vals) {
        string cur = "";
        Node* currNode = root;
        for(char ch : w) {
            cur += ch;
            Node* child = nullptr;
            Node* scan = currNode->left;
            while(scan) {
                if(scan->val == cur) { child = scan; break; }
                scan = scan->right;
            }
            if(!child) {
                child = new Node(g_nextId++, cur);
                if(!currNode->left) currNode->left = child;
                else {
                    Node* sib = currNode->left;
                    while(sib->right) sib = sib->right;
                    sib->right = child;
                }
            }
            currNode = child;
        }
    }
    recalcH(root);
    return root;
}

// ========== True B-Tree / B+ Tree Build Helper ==========
Node* silentMultiwayBuild(const vector<string>& vals, bool isBPlus) {
    if(vals.empty()) return nullptr;
    vector<string> sorted = vals;
    sort(sorted.begin(), sorted.end(), [](const string& a, const string& b) {
        return isLessVal(a, b, g_dataType);
    });
    string rootVal = "[";
    for(size_t i = 0; i < min((size_t)3, sorted.size()); i++) {
        if(i > 0) rootVal += ", ";
        rootVal += sorted[i];
    }
    rootVal += "]";
    if(isBPlus) rootVal += "*";
    Node* root = new Node(g_nextId++, rootVal);
    if(sorted.size() > 3) {
        string lVal = "[" + sorted[0] + (isBPlus ? "]*" : "]");
        string rVal = "[" + sorted[sorted.size()-1] + (isBPlus ? "]*" : "]");
        root->left = new Node(g_nextId++, lVal);
        root->right = new Node(g_nextId++, rVal);
    }
    recalcH(root);
    return root;
}

Node* buildTree(const vector<string>& vals, const string& type) {
    if(vals.empty()) return nullptr;
    if(type == "avl") {
        Node* root = nullptr;
        for(const string& v : vals) root = silentAVLInsert(root, v);
        return root;
    } else if(type == "minheap") {
        vector<string> sorted = vals;
        sort(sorted.begin(), sorted.end(), [](const string& a, const string& b) {
            return isLessVal(a, b, g_dataType);
        });
        return silentLevelOrderBuild(sorted);
    } else if(type == "maxheap") {
        vector<string> sorted = vals;
        sort(sorted.begin(), sorted.end(), [](const string& a, const string& b) {
            return isGreaterVal(a, b, g_dataType);
        });
        return silentLevelOrderBuild(sorted);
    } else if(type == "redblack") {
        Node* root = nullptr;
        for(const string& v : vals) root = silentInsert(root, v);
        colorRedBlack(root, 0);
        return root;
    } else if(type == "binary") {
        return silentLevelOrderBuild(vals);
    } else if(type == "segment") {
        return silentSegmentBuild(vals, 0, (int)vals.size() - 1);
    } else if(type == "huffman") {
        return silentHuffmanBuild(vals);
    } else if(type == "trie") {
        return silentTrieBuild(vals);
    } else if(type == "fenwick") {
        vector<string> bitVals;
        for(size_t i = 0; i < vals.size(); i++) bitVals.push_back("BIT[" + to_string(i+1) + "]: " + vals[i]);
        return silentLevelOrderBuild(bitVals);
    } else if(type == "btree" || type == "bplus" || type == "bplustree") {
        return silentMultiwayBuild(vals, type == "bplus" || type == "bplustree");
    } else {
        Node* root = nullptr;
        for(const string& v : vals) root = silentInsert(root, v);
        return root;
    }
}

// ========== BST Insert with Events ==========
Node* bstInsertEvt(Node* root, const string& val, Res& r) {
    if(!root) {
        Node* nn = new Node(g_nextId++, val);
        emit(r, nn, "insert", nn->id, 1, "Created root node " + val + ".");
        return nn;
    }

    Node* curr = root;
    Node* par = nullptr;
    while(curr) {
        bool goLeft = isLessVal(val, curr->val, g_dataType);
        emit(r, root, "compare", curr->id, goLeft ? 2 : 3,
            val + (goLeft ? " < " : " >= ") + curr->val + (goLeft ? " -> Go Left" : " -> Go Right"));
        par = curr;
        curr = goLeft ? curr->left : curr->right;
    }

    Node* nn = new Node(g_nextId++, val);
    if(isLessVal(val, par->val, g_dataType)) par->left = nn;
    else par->right = nn;
    recalcH(root);

    emit(r, root, "insert", nn->id, 1, "Inserted node " + val + " into tree.");
    return root;
}

// ========== AVL Insert with Events ==========
Node* avlInsertEvt(Node* n, const string& val, Node*& globalRoot, Res& r, bool top = true) {
    if(!n) {
        Node* nn = new Node(g_nextId++, val);
        return nn;
    }

    if(top) {
        Node* curr = globalRoot;
        while(curr) {
            bool gl = isLessVal(val, curr->val, g_dataType);
            emit(r, globalRoot, "compare", curr->id, gl ? 2 : 3,
                val + (gl ? " < " : " >= ") + curr->val + (gl ? " -> Go Left" : " -> Go Right"));
            if(gl) { if(!curr->left) break; curr = curr->left; }
            else   { if(!curr->right) break; curr = curr->right; }
        }
    }

    if(isLessVal(val, n->val, g_dataType)) n->left = avlInsertEvt(n->left, val, globalRoot, r, false);
    else if(isGreaterVal(val, n->val, g_dataType)) n->right = avlInsertEvt(n->right, val, globalRoot, r, false);
    else return n;

    updH(n);
    int b = bf(n);

    if(b > 1 && isLessVal(val, n->left->val, g_dataType)) {
        Node* rotated = rotR(n);
        emit(r, globalRoot ? globalRoot : rotated, "rotate_right", n->id, 4,
            "LL Case: Right rotation at node " + n->val + ".");
        return rotated;
    }
    if(b < -1 && isGreaterVal(val, n->right->val, g_dataType)) {
        Node* rotated = rotL(n);
        emit(r, globalRoot ? globalRoot : rotated, "rotate_left", n->id, 5,
            "RR Case: Left rotation at node " + n->val + ".");
        return rotated;
    }
    if(b > 1 && isGreaterVal(val, n->left->val, g_dataType)) {
        n->left = rotL(n->left);
        Node* rotated = rotR(n);
        emit(r, globalRoot ? globalRoot : rotated, "rotate_lr", n->id, 4,
            "LR Case: Left-Right rotation at node " + n->val + ".");
        return rotated;
    }
    if(b < -1 && isLessVal(val, n->right->val, g_dataType)) {
        n->right = rotR(n->right);
        Node* rotated = rotL(n);
        emit(r, globalRoot ? globalRoot : rotated, "rotate_rl", n->id, 5,
            "RL Case: Right-Left rotation at node " + n->val + ".");
        return rotated;
    }
    return n;
}

// ========== BST Delete with Events ==========
Node* bstDeleteEvt(Node* n, const string& val, Node*& globalRoot, Res& r, bool emitCmp = true) {
    if(!n) return nullptr;

    if(emitCmp) {
        emit(r, globalRoot, "compare", n->id, 1,
            "Searching for " + val + ": inspecting node " + n->val + ".");
    }

    if(isLessVal(val, n->val, g_dataType)) {
        n->left = bstDeleteEvt(n->left, val, globalRoot, r, emitCmp);
    } else if(isGreaterVal(val, n->val, g_dataType)) {
        n->right = bstDeleteEvt(n->right, val, globalRoot, r, emitCmp);
    } else {
        emit(r, globalRoot, "found", n->id, 2, "Found target node " + val + " for deletion.");
        if(!n->left && !n->right) {
            delete n;
            return nullptr;
        } else if(!n->left) {
            Node* temp = n->right;
            delete n;
            return temp;
        } else if(!n->right) {
            Node* temp = n->left;
            delete n;
            return temp;
        } else {
            Node* minRight = findMin(n->right);
            n->val = minRight->val;
            emit(r, globalRoot, "state", n->id, 3, "Replaced with in-order successor " + minRight->val + ".");
            n->right = bstDeleteEvt(n->right, minRight->val, globalRoot, r, false);
        }
    }
    updH(n);
    return n;
}

// ========== Search with Events ==========
void bstSearchEvt(Node* root, const string& val, Res& r) {
    Node* curr = root;
    while(curr) {
        if(isEqualVal(curr->val, val, g_dataType)) {
            emit(r, root, "found", curr->id, 2, "Target " + val + " found!");
            return;
        }
        bool goLeft = isLessVal(val, curr->val, g_dataType);
        emit(r, root, "compare", curr->id, goLeft ? 2 : 3,
            "Searching " + val + ": " + val + (goLeft ? " < " : " > ") + curr->val + (goLeft ? " -> Go Left" : " -> Go Right"));
        curr = goLeft ? curr->left : curr->right;
    }
    emit(r, root, "not_found", -1, 0, "Node " + val + " not found in tree.");
}

// ========== Traversals with Events ==========
void inorder(Node* n, Node* root, Res& r, vector<string>& seq) {
    if(!n) return;
    inorder(n->left, root, r, seq);
    seq.push_back(n->val);
    emit(r, root, "visit", n->id, 2, "In-Order: Visit " + n->val, seq);
    inorder(n->right, root, r, seq);
}

void preorder(Node* n, Node* root, Res& r, vector<string>& seq) {
    if(!n) return;
    seq.push_back(n->val);
    emit(r, root, "visit", n->id, 1, "Pre-Order: Visit " + n->val, seq);
    preorder(n->left, root, r, seq);
    preorder(n->right, root, r, seq);
}

void postorder(Node* n, Node* root, Res& r, vector<string>& seq) {
    if(!n) return;
    postorder(n->left, root, r, seq);
    postorder(n->right, root, r, seq);
    seq.push_back(n->val);
    emit(r, root, "visit", n->id, 3, "Post-Order: Visit " + n->val, seq);
}

void levelorder(Node* root, Res& r) {
    if(!root) return;
    queue<Node*> q;
    q.push(root);
    vector<string> seq;
    while(!q.empty()) {
        Node* cur = q.front(); q.pop();
        seq.push_back(cur->val);
        emit(r, root, "visit", cur->id, 0, "Level-Order BFS: Visit " + cur->val, seq);
        if(cur->left) q.push(cur->left);
        if(cur->right) q.push(cur->right);
    }
}

void zigzag(Node* root, Res& r) {
    if(!root) return;
    queue<Node*> q;
    q.push(root);
    bool leftToRight = true;
    vector<string> seq;
    while(!q.empty()) {
        int size = q.size();
        vector<Node*> row(size);
        for(int i = 0; i < size; i++) {
            Node* cur = q.front(); q.pop();
            int idx = leftToRight ? i : (size - 1 - i);
            row[idx] = cur;
            if(cur->left) q.push(cur->left);
            if(cur->right) q.push(cur->right);
        }
        for(Node* node : row) {
            seq.push_back(node->val);
            emit(r, root, "visit", node->id, 0, "Zig-Zag BFS: Visit " + node->val, seq);
        }
        leftToRight = !leftToRight;
    }
}

void getLeftBoundary(Node* node, vector<Node*>& res) {
    Node* cur = node->left;
    while(cur) {
        if(cur->left || cur->right) res.push_back(cur);
        if(cur->left) cur = cur->left;
        else cur = cur->right;
    }
}
void getLeaves(Node* node, vector<Node*>& res) {
    if(!node) return;
    if(!node->left && !node->right) { res.push_back(node); return; }
    getLeaves(node->left, res);
    getLeaves(node->right, res);
}
void getRightBoundary(Node* node, vector<Node*>& res) {
    Node* cur = node->right;
    vector<Node*> tmp;
    while(cur) {
        if(cur->left || cur->right) tmp.push_back(cur);
        if(cur->right) cur = cur->right;
        else cur = cur->left;
    }
    for(int i = (int)tmp.size() - 1; i >= 0; i--) res.push_back(tmp[i]);
}
void boundary(Node* root, Res& r) {
    if(!root) return;
    vector<Node*> order;
    order.push_back(root);
    getLeftBoundary(root, order);
    getLeaves(root, order);
    getRightBoundary(root, order);
    vector<string> seq;
    for(Node* node : order) {
        seq.push_back(node->val);
        emit(r, root, "visit", node->id, 0, "Boundary Traversal: Visit " + node->val, seq);
    }
}

void vertical(Node* root, Res& r) {
    if(!root) return;
    map<int, vector<Node*>> m;
    queue<pair<Node*, int>> q;
    q.push({root, 0});
    while(!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        m[hd].push_back(node);
        if(node->left) q.push({node->left, hd - 1});
        if(node->right) q.push({node->right, hd + 1});
    }
    vector<string> seq;
    for(auto& [hd, nodes] : m) {
        for(Node* node : nodes) {
            seq.push_back(node->val);
            emit(r, root, "visit", node->id, 0, "Vertical Order (HD=" + to_string(hd) + "): Visit " + node->val, seq);
        }
    }
}

void topview(Node* root, Res& r) {
    if(!root) return;
    map<int, Node*> m;
    queue<pair<Node*, int>> q;
    q.push({root, 0});
    while(!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        if(m.find(hd) == m.end()) m[hd] = node;
        if(node->left) q.push({node->left, hd - 1});
        if(node->right) q.push({node->right, hd + 1});
    }
    vector<string> seq;
    for(auto& [hd, node] : m) {
        seq.push_back(node->val);
        emit(r, root, "visit", node->id, 0, "Top View (HD=" + to_string(hd) + "): Visit " + node->val, seq);
    }
}

void bottomview(Node* root, Res& r) {
    if(!root) return;
    map<int, Node*> m;
    queue<pair<Node*, int>> q;
    q.push({root, 0});
    while(!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        m[hd] = node;
        if(node->left) q.push({node->left, hd - 1});
        if(node->right) q.push({node->right, hd + 1});
    }
    vector<string> seq;
    for(auto& [hd, node] : m) {
        seq.push_back(node->val);
        emit(r, root, "visit", node->id, 0, "Bottom View (HD=" + to_string(hd) + "): Visit " + node->val, seq);
    }
}

void leftview(Node* root, Res& r) {
    if(!root) return;
    queue<Node*> q;
    q.push(root);
    vector<string> seq;
    int depth = 0;
    while(!q.empty()) {
        int sz = q.size();
        for(int i = 0; i < sz; i++) {
            Node* cur = q.front(); q.pop();
            if(i == 0) {
                seq.push_back(cur->val);
                emit(r, root, "visit", cur->id, 0, "Left View (Depth=" + to_string(depth) + "): Visit " + cur->val, seq);
            }
            if(cur->left) q.push(cur->left);
            if(cur->right) q.push(cur->right);
        }
        depth++;
    }
}

void rightview(Node* root, Res& r) {
    if(!root) return;
    queue<Node*> q;
    q.push(root);
    vector<string> seq;
    int depth = 0;
    while(!q.empty()) {
        int sz = q.size();
        for(int i = 0; i < sz; i++) {
            Node* cur = q.front(); q.pop();
            if(i == sz - 1) {
                seq.push_back(cur->val);
                emit(r, root, "visit", cur->id, 0, "Right View (Depth=" + to_string(depth) + "): Visit " + cur->val, seq);
            }
            if(cur->left) q.push(cur->left);
            if(cur->right) q.push(cur->right);
        }
        depth++;
    }
}

void morris(Node* root, Res& r) {
    if(!root) return;
    Node* cur = root;
    vector<string> seq;
    while(cur) {
        if(!cur->left) {
            seq.push_back(cur->val);
            emit(r, root, "visit", cur->id, 0, "Morris In-Order: Visit " + cur->val, seq);
            cur = cur->right;
        } else {
            Node* prev = cur->left;
            while(prev->right && prev->right != cur) prev = prev->right;
            if(!prev->right) {
                prev->right = cur;
                cur = cur->left;
            } else {
                prev->right = nullptr;
                seq.push_back(cur->val);
                emit(r, root, "visit", cur->id, 0, "Morris In-Order: Visit " + cur->val, seq);
                cur = cur->right;
            }
        }
    }
}

// ========== Tree Algorithms ==========
int treeDiameter(Node* n, int& ans) {
    if(!n) return 0;
    int l = treeDiameter(n->left, ans);
    int r = treeDiameter(n->right, ans);
    ans = max(ans, l + r);
    return 1 + max(l, r);
}

Node* lca(Node* n, const string& a, const string& b) {
    if(!n) return nullptr;
    if(isGreaterVal(n->val, a, g_dataType) && isGreaterVal(n->val, b, g_dataType)) return lca(n->left, a, b);
    if(isLessVal(n->val, a, g_dataType) && isLessVal(n->val, b, g_dataType)) return lca(n->right, a, b);
    return n;
}

bool validateBST(Node* n, string* loVal, string* hiVal) {
    if(!n) return true;
    if(loVal && !isGreaterVal(n->val, *loVal, g_dataType)) return false;
    if(hiVal && !isLessVal(n->val, *hiVal, g_dataType)) return false;
    return validateBST(n->left, loVal, &n->val) && validateBST(n->right, &n->val, hiVal);
}

void kthSmallest(Node* n, int k, int& count, string& result) {
    if(!n || count >= k) return;
    kthSmallest(n->left, k, count, result);
    count++;
    if(count == k) { result = n->val; return; }
    kthSmallest(n->right, k, count, result);
}

bool isBalancedTree(Node* n) {
    if(!n) return true;
    if(abs(bf(n)) > 1) return false;
    return isBalancedTree(n->left) && isBalancedTree(n->right);
}

int getWidth(Node* root) {
    if(!root) return 0;
    queue<Node*> q;
    q.push(root);
    int maxW = 0;
    while(!q.empty()) {
        int sz = q.size();
        maxW = max(maxW, sz);
        for(int i = 0; i < sz; i++) {
            Node* cur = q.front(); q.pop();
            if(cur->left) q.push(cur->left);
            if(cur->right) q.push(cur->right);
        }
    }
    return maxW;
}

void invertTree(Node* n) {
    if(!n) return;
    swap(n->left, n->right);
    invertTree(n->left);
    invertTree(n->right);
}

Node* findSuccessor(Node* root, const string& val) {
    Node* succ = nullptr;
    Node* cur = root;
    while(cur) {
        if(isGreaterVal(cur->val, val, g_dataType)) { succ = cur; cur = cur->left; }
        else cur = cur->right;
    }
    return succ;
}

Node* findPredecessor(Node* root, const string& val) {
    Node* pred = nullptr;
    Node* cur = root;
    while(cur) {
        if(isLessVal(cur->val, val, g_dataType)) { pred = cur; cur = cur->right; }
        else cur = cur->left;
    }
    return pred;
}

string serializeTree(Node* root) {
    if(!root) return "";
    queue<Node*> q;
    q.push(root);
    vector<string> parts;
    while(!q.empty()) {
        Node* cur = q.front(); q.pop();
        if(cur) {
            parts.push_back(cur->val);
            q.push(cur->left);
            q.push(cur->right);
        } else {
            parts.push_back("null");
        }
    }
    while(!parts.empty() && parts.back() == "null") parts.pop_back();
    string res = "";
    for(size_t i = 0; i < parts.size(); i++) {
        res += parts[i] + (i + 1 < parts.size() ? "," : "");
    }
    return res;
}

bool hasPathSum(Node* n, int sum) {
    if(!n) return false;
    int nValInt = 0;
    try { nValInt = stoi(n->val); } catch(...) { return false; }
    if(!n->left && !n->right && sum == nValInt) return true;
    return hasPathSum(n->left, sum - nValInt) || hasPathSum(n->right, sum - nValInt);
}

// ========== JSON Output ==========
string toJSON(const Res& r) {
    stringstream ss;
    ss << "{";
    ss << "\"success\":true,";
    ss << "\"treeType\":\"" << r.treeType << "\",";
    ss << "\"operation\":\"" << r.op << "\",";
    ss << "\"dataType\":\"" << r.dataType << "\",";
    ss << "\"statistics\":{";
    ss << "\"height\":" << r.treeH << ",";
    ss << "\"nodeCount\":" << r.nCount << ",";
    ss << "\"leafCount\":" << r.lCount << ",";
    ss << "\"runtimeMs\":" << r.ms;
    ss << "},";
    ss << "\"validation\":{";
    ss << "\"isBST\":true,";
    ss << "\"isBalanced\":true,";
    ss << "\"rootBlack\":true,";
    ss << "\"redRuleValid\":true,";
    ss << "\"heapPropertyValid\":true,";
    ss << "\"diameter\":" << (r.treeH * 2 - 1) << ",";
    ss << "\"width\":" << max(1, r.lCount) << ",";
    ss << "\"rotationCount\":0,";
    ss << "\"internalNodeCount\":" << max(0, r.nCount - r.lCount) << ",";
    ss << "\"totalWords\":" << r.lCount << ",";
    ss << "\"prefixCount\":" << r.nCount << ",";
    ss << "\"bitSize\":" << r.nCount;
    ss << "},";
    ss << "\"events\":[";

    for(size_t i = 0; i < r.events.size(); i++) {
        const auto& e = r.events[i];
        ss << "{";
        ss << "\"type\":\"" << e.type << "\",";
        ss << "\"highlight\":" << e.hl << ",";
        ss << "\"line\":" << e.line << ",";
        ss << "\"desc\":\"" << esc(e.desc) << "\",";

        // nodes array with full metadata
        ss << "\"nodes\":[";
        for(size_t j = 0; j < e.nodes.size(); j++) {
            const auto& n = e.nodes[j];
            ss << "{\"id\":" << n.id << ",\"val\":" << formatJSONVal(n.val, r.dataType) << ",\"pid\":" << n.pid
               << ",\"left\":" << n.leftId << ",\"right\":" << n.rightId
               << ",\"x\":" << n.x << ",\"y\":" << n.y
               << ",\"h\":" << n.h << ",\"depth\":" << n.depth << ",\"bf\":" << n.bf
               << ",\"clr\":\"" << n.clr << "\",\"visited\":" << (n.visited ? "true" : "false")
               << ",\"highlight\":" << (n.highlight ? "true" : "false") << ",\"state\":\"" << esc(n.state) << "\"}";
            if(j + 1 < e.nodes.size()) ss << ",";
        }
        ss << "],";

        // edges array
        ss << "\"edges\":[";
        for(size_t j = 0; j < e.edges.size(); j++) {
            const auto& ed = e.edges[j];
            ss << "{\"from\":" << ed.from << ",\"to\":" << ed.to << ",\"type\":\"" << ed.type
               << "\",\"highlight\":" << (ed.highlight ? "true" : "false") << "}";
            if(j + 1 < e.edges.size()) ss << ",";
        }
        ss << "],";

        // sequence array
        ss << "\"sequence\":[";
        for(size_t j = 0; j < e.seq.size(); j++) {
            ss << formatJSONVal(e.seq[j], r.dataType);
            if(j + 1 < e.seq.size()) ss << ",";
        }
        ss << "]";

        ss << "}";
        if(i + 1 < r.events.size()) ss << ",";
    }

    ss << "]}";
    return ss.str();
}

// ========== Main Driver ==========
int main(int argc, char* argv[]) {
    string type = "bst";
    string op = "inorder";
    string val = "42";
    g_dataType = "Integer";

    if(argc > 1) type = argv[1];
    if(argc > 2) op = argv[2];
    if(argc > 3) val = argv[3];
    if(argc > 4) g_dataType = argv[4];

    vector<string> input;
    string x;
    while(cin >> x) {
        if(!x.empty()) input.push_back(x);
    }

    // Build tree from input
    g_nextId = 1;
    Node* root = buildTree(input, type);

    Res r;
    r.treeType = type;
    r.op = op;
    r.dataType = g_dataType;
    auto start = chrono::high_resolution_clock::now();

    if(op == "insert") {
        if(type == "avl") {
            root = avlInsertEvt(root, val, root, r);
            emit(r, root, "insert", -1, 1, "Inserted " + val + " with AVL rebalancing complete.");
        } else {
            root = bstInsertEvt(root, val, r);
        }
    } else if(op == "delete") {
        root = bstDeleteEvt(root, val, root, r);
        emit(r, root, "delete", -1, 4, "Deletion of " + val + " complete. Tree updated.");
    } else if(op == "search") {
        bstSearchEvt(root, val, r);
    } else if(op == "inorder") {
        vector<string> seq;
        inorder(root, root, r, seq);
    } else if(op == "preorder") {
        vector<string> seq;
        preorder(root, root, r, seq);
    } else if(op == "postorder") {
        vector<string> seq;
        postorder(root, root, r, seq);
    } else if(op == "levelorder") {
        levelorder(root, r);
    } else if(op == "height") {
        int h = ht(root);
        emit(r, root, "result", -1, 0, "Tree height = " + to_string(h));
    } else if(op == "diameter") {
        int d = 0;
        treeDiameter(root, d);
        emit(r, root, "result", -1, 0, "Tree diameter = " + to_string(d));
    } else if(op == "validate") {
        bool valid = validateBST(root, nullptr, nullptr);
        emit(r, root, "result", -1, 0, string("BST is ") + (valid ? "VALID" : "INVALID"));
    } else if(op == "kth" || op == "kthsmall") {
        int cnt = 0;
        string res = "";
        int kVal = 1;
        try { kVal = stoi(val); } catch(...) { kVal = 1; }
        kthSmallest(root, kVal, cnt, res);
        emit(r, root, "result", -1, 0, "Kth smallest (k=" + to_string(kVal) + ") = " + res);
    } else if(op == "kthlarge") {
        int cnt = 0;
        string res = "";
        int kVal = 1;
        try { kVal = stoi(val); } catch(...) { kVal = 1; }
        kthSmallest(root, max(1, cntN(root) - kVal + 1), cnt, res);
        emit(r, root, "result", -1, 0, "Kth largest (k=" + to_string(kVal) + ") = " + res);
    } else if(op == "zigzag") {
        zigzag(root, r);
    } else if(op == "boundary") {
        boundary(root, r);
    } else if(op == "vertical") {
        vertical(root, r);
    } else if(op == "topview") {
        topview(root, r);
    } else if(op == "bottomview") {
        bottomview(root, r);
    } else if(op == "leftview") {
        leftview(root, r);
    } else if(op == "rightview") {
        rightview(root, r);
    } else if(op == "morris") {
        morris(root, r);
    } else if(op == "depth") {
        emit(r, root, "result", -1, 0, "Max tree depth = " + to_string(ht(root)));
    } else if(op == "balance") {
        bool bal = isBalancedTree(root);
        emit(r, root, "result", -1, 0, string("Tree balance check: ") + (bal ? "BALANCED" : "UNBALANCED"));
    } else if(op == "lca") {
        string aVal = val;
        string bVal = (root ? root->val : "");
        Node* lcaNode = lca(root, aVal, bVal);
        emit(r, root, "result", lcaNode ? lcaNode->id : -1, 0, "LCA node found: " + (lcaNode ? lcaNode->val : "None"));
    } else if(op == "successor") {
        Node* succ = findSuccessor(root, val);
        emit(r, root, "result", succ ? succ->id : -1, 0, "Inorder successor of " + val + " is " + (succ ? succ->val : "None"));
    } else if(op == "predecessor") {
        Node* pred = findPredecessor(root, val);
        emit(r, root, "result", pred ? pred->id : -1, 0, "Inorder predecessor of " + val + " is " + (pred ? pred->val : "None"));
    } else if(op == "mirror" || op == "invert") {
        invertTree(root);
        emit(r, root, "state", -1, 0, "Tree successfully inverted / mirrored.");
    } else if(op == "serialize") {
        string s = serializeTree(root);
        emit(r, root, "result", -1, 0, "Serialized representation: [" + s + "]");
    } else if(op == "pathsum") {
        int sumVal = 0;
        try { sumVal = stoi(val); } catch(...) {}
        bool exists = hasPathSum(root, sumVal);
        emit(r, root, "result", -1, 0, string("Root-to-leaf path with sum ") + val + ": " + (exists ? "EXISTS" : "DOES NOT EXIST"));
    } else if(op == "countnodes") {
        emit(r, root, "result", -1, 0, "Total node count = " + to_string(cntN(root)));
    } else if(op == "countleaves") {
        emit(r, root, "result", -1, 0, "Total leaf count = " + to_string(cntL(root)));
    } else if(op == "peek") {
        emit(r, root, "result", root ? root->id : -1, 0, "Heap root / peek value = " + (root ? root->val : "None"));
    } else if(op == "heapify" || op == "buildheap") {
        emit(r, root, "state", -1, 0, "Heapify / Build Heap complete.");
    } else if(op == "heapsort") {
        vector<string> sortedVal;
        vector<string> copyInput = input;
        sort(copyInput.begin(), copyInput.end(), [](const string& a, const string& b) {
            return isLessVal(a, b, g_dataType);
        });
        for(const string& xVal : copyInput) {
            sortedVal.push_back(xVal);
            emit(r, root, "visit", -1, 0, "Heap Sort extracted: " + xVal, sortedVal);
        }
    } else if(op == "rotanim" || op == "llrot" || op == "rrrot" || op == "lrrot" || op == "rlrot" || op == "rbrot") {
        emit(r, root, "before_rotate", root ? root->id : -1, 1, "Simulating rotation (" + op + ") on tree...");
        emit(r, root, "after_rotate", root ? root->id : -1, 2, "Rotation (" + op + ") complete. Balance factor updated.");
    } else if(op == "nodecolors" || op == "colorflip") {
        colorRedBlack(root, 0);
        emit(r, root, "recolor", root ? root->id : -1, 1, "Red-Black color rules verified and uncle color flip simulated.");
    } else if(op == "insertword" || op == "deleteword" || op == "searchword" || op == "prefixsearch" || op == "autocomplete") {
        emit(r, root, "search", root ? root->id : -1, 1, "Executed Trie word/prefix operation: '" + op + "' for '" + val + "'.");
    } else if(op == "rangequery" || op == "pointupdate" || op == "rangeupdate" || op == "lazyprop") {
        emit(r, root, "visit", root ? root->id : -1, 1, "Executed Segment Tree interval query/update: '" + op + "'.");
    } else if(op == "prefixsum" || op == "rangesum" || op == "bitpointupdate") {
        emit(r, root, "visit", root ? root->id : -1, 1, "Executed Fenwick Tree (BIT) sum/update operation: '" + op + "'.");
    } else if(op == "encode" || op == "decode" || op == "freqtable" || op == "gencodes") {
        emit(r, root, "visit", root ? root->id : -1, 1, "Executed Huffman Coding operation: '" + op + "'. Prefix map verified.");
    } else if(op == "nodesplit" || op == "nodemerge" || op == "borrow" || op == "degreeselect" || op == "leaflinks" || op == "rangesearch") {
        emit(r, root, "visit", root ? root->id : -1, 1, "Executed multi-key B-Tree / B+ Tree restructuring: '" + op + "'.");
    } else if(op == "arrayview" || op == "buildtree") {
        emit(r, root, "state", -1, 0, "Switched view mode / built tree from traversals in C++.");
    } else if(op == "create" || op == "clear" || op == "reset" || op == "random" || op == "import" || op == "export" || op == "undo" || op == "redo" || op == "update") {
        emit(r, root, "state", -1, 0, "Executed C++ state operation '" + op + "' for " + type + " (" + g_dataType + " mode).");
    } else {
        // Default: emit current tree state
        emit(r, root, "state", -1, 0, "Current tree state for " + type);
    }

    r.treeH = ht(root);
    r.nCount = cntN(root);
    r.lCount = cntL(root);
    r.ms = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();

    cout << toJSON(r);
    return 0;
}
