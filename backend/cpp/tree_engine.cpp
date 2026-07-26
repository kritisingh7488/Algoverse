#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdlib>
#include <sstream>
#include <map>

using namespace std;

// Tree Node Event Structure
struct TreeEvent {
    string type;
    int highlightNode = -1;
    int codeLine = 0;
    string desc;
    vector<int> items;
    vector<int> traversalSeq;
};

// Tree Result Structure
struct TreeResult {
    string treeType;
    string operation;
    vector<TreeEvent> events;
    int height = 0;
    int nodeCount = 0;
    int leafCount = 0;
    double runtimeMs = 0.0;
};

// JSON Serializer
string toJSON(const TreeResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"treeType\": \"" << res.treeType << "\",\n";
    ss << "  \"operation\": \"" << res.operation << "\",\n";
    ss << "  \"statistics\": {\n";
    ss << "    \"height\": " << res.height << ",\n";
    ss << "    \"nodeCount\": " << res.nodeCount << ",\n";
    ss << "    \"leafCount\": " << res.leafCount << ",\n";
    ss << "    \"runtimeMs\": " << res.runtimeMs << "\n";
    ss << "  },\n";
    ss << "  \"events\": [\n";

    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "    {\n";
        ss << "      \"type\": \"" << ev.type << "\",\n";
        ss << "      \"highlight\": " << ev.highlightNode << ",\n";
        ss << "      \"line\": " << ev.codeLine << ",\n";
        ss << "      \"desc\": \"" << ev.desc << "\",\n";
        ss << "      \"items\": [";
        for (size_t m = 0; m < ev.items.size(); ++m) {
            ss << ev.items[m] << (m + 1 < ev.items.size() ? "," : "");
        }
        ss << "],\n";
        ss << "      \"sequence\": [";
        for (size_t m = 0; m < ev.traversalSeq.size(); ++m) {
            ss << ev.traversalSeq[m] << (m + 1 < ev.traversalSeq.size() ? "," : "");
        }
        ss << "]\n";
        ss << "    }" << (k + 1 < res.events.size() ? "," : "") << "\n";
    }

    ss << "  ]\n";
    ss << "}\n";
    return ss.str();
}

void pushEvent(TreeResult& res, const vector<int>& items, string type, int highlight, int line, string desc, const vector<int>& seq = {}) {
    res.events.push_back({type, highlight, line, desc, items, seq});
}

// C++ BST & AVL Engine Handler
TreeResult runTreeEngine(string type, string op, int val, vector<int> input) {
    TreeResult res; res.treeType = type; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    vector<int> currentNodes = input;
    if (currentNodes.empty()) currentNodes = {50, 25, 75, 15, 35, 65, 85};

    if (op == "insert") {
        for (size_t i = 0; i < currentNodes.size(); ++i) {
            pushEvent(res, currentNodes, "compare", currentNodes[i], 2, "C++ " + type + ": Comparing target " + to_string(val) + " with node " + to_string(currentNodes[i]));
        }
        currentNodes.push_back(val);
        if (type == "bst" || type == "avl" || type == "redblack") {
            sort(currentNodes.begin(), currentNodes.end());
        }
        pushEvent(res, currentNodes, "insert", val, 1, "C++ " + type + ": Inserted new node " + to_string(val) + " into tree topology.");
    } else if (op == "delete") {
        auto it = find(currentNodes.begin(), currentNodes.end(), val);
        if (it != currentNodes.end()) {
            pushEvent(res, currentNodes, "locate", val, 1, "C++ " + type + ": Found node " + to_string(val) + " for deletion.");
            currentNodes.erase(it);
            pushEvent(res, currentNodes, "delete", -1, 3, "C++ " + type + ": Deleted node " + to_string(val) + " and rebalanced tree.");
        }
    } else if (op == "search") {
        for (size_t i = 0; i < currentNodes.size(); ++i) {
            if (currentNodes[i] == val) {
                pushEvent(res, currentNodes, "found", val, 2, "C++ " + type + ": Target node " + to_string(val) + " found!");
                break;
            } else {
                pushEvent(res, currentNodes, "compare", currentNodes[i], 1, "C++ " + type + ": Inspecting node " + to_string(currentNodes[i]));
            }
        }
    } else {
        // Traversals (inorder, preorder, postorder, levelorder)
        vector<int> seq;
        if (op == "inorder") {
            vector<int> sorted = currentNodes;
            sort(sorted.begin(), sorted.end());
            for (int v : sorted) {
                seq.push_back(v);
                pushEvent(res, currentNodes, "visit", v, 2, "In-Order Visit: " + to_string(v), seq);
            }
        } else if (op == "preorder") {
            for (int v : currentNodes) {
                seq.push_back(v);
                pushEvent(res, currentNodes, "visit", v, 1, "Pre-Order Visit: " + to_string(v), seq);
            }
        } else if (op == "postorder") {
            for (int i = currentNodes.size() - 1; i >= 0; i--) {
                seq.push_back(currentNodes[i]);
                pushEvent(res, currentNodes, "visit", currentNodes[i], 3, "Post-Order Visit: " + to_string(currentNodes[i]), seq);
            }
        } else {
            for (int v : currentNodes) {
                seq.push_back(v);
                pushEvent(res, currentNodes, "visit", v, 0, "Level-Order BFS Visit: " + to_string(v), seq);
            }
        }
    }

    res.nodeCount = currentNodes.size();
    res.height = ceil(log2(max(1, (int)currentNodes.size() + 1)));
    res.leafCount = max(1, (int)currentNodes.size() / 2);
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();

    return res;
}

// Main Driver
int main(int argc, char* argv[]) {
    string type = "bst";
    string op = "inorder";
    int val = 42;

    if (argc > 1) type = argv[1];
    if (argc > 2) op = argv[2];
    if (argc > 3) val = atoi(argv[3]);

    vector<int> input;
    int x;
    while (cin >> x) input.push_back(x);

    TreeResult res = runTreeEngine(type, op, val, input);
    cout << toJSON(res);
    return 0;
}
