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

// Event Structure for standardized C++ JSON output
struct DSEvent {
    string type;
    int highlight = -1;
    int pointer1 = -1;
    int pointer2 = -1;
    string ptrLabel1 = "";
    string ptrLabel2 = "";
    int value = 0;
    int line = 0;
    string desc;
    vector<int> currentItems;
    vector<int> sequence;
};

// Result Structure
struct DSResult {
    string structureKey;
    string operation;
    vector<DSEvent> events;
    int elementsCount = 0;
    int memoryUsedBytes = 0;
    double runtimeMs = 0.0;
};

// JSON Serializer
string toJSON(const DSResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"structureKey\": \"" << res.structureKey << "\",\n";
    ss << "  \"operation\": \"" << res.operation << "\",\n";
    ss << "  \"statistics\": {\n";
    ss << "    \"elementsCount\": " << res.elementsCount << ",\n";
    ss << "    \"memoryUsedBytes\": " << res.memoryUsedBytes << ",\n";
    ss << "    \"runtimeMs\": " << res.runtimeMs << "\n";
    ss << "  },\n";
    ss << "  \"events\": [\n";

    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "    {\n";
        ss << "      \"type\": \"" << ev.type << "\",\n";
        ss << "      \"highlight\": " << ev.highlight << ",\n";
        ss << "      \"pointers\": {\n";
        if (!ev.ptrLabel1.empty() && ev.pointer1 >= 0) {
            ss << "        \"" << ev.ptrLabel1 << "\": " << ev.pointer1;
            if (!ev.ptrLabel2.empty() && ev.pointer2 >= 0) ss << ",\n";
            else ss << "\n";
        }
        if (!ev.ptrLabel2.empty() && ev.pointer2 >= 0) {
            ss << "        \"" << ev.ptrLabel2 << "\": " << ev.pointer2 << "\n";
        }
        ss << "      },\n";
        ss << "      \"value\": " << ev.value << ",\n";
        ss << "      \"line\": " << ev.line << ",\n";
        ss << "      \"desc\": \"" << ev.desc << "\",\n";
        ss << "      \"items\": [";
        for (size_t m = 0; m < ev.currentItems.size(); ++m) {
            ss << ev.currentItems[m] << (m + 1 < ev.currentItems.size() ? "," : "");
        }
        ss << "],\n";
        ss << "      \"sequence\": [";
        for (size_t m = 0; m < ev.sequence.size(); ++m) {
            ss << ev.sequence[m] << (m + 1 < ev.sequence.size() ? "," : "");
        }
        ss << "]\n";
        ss << "    }" << (k + 1 < res.events.size() ? "," : "") << "\n";
    }

    ss << "  ]\n";
    ss << "}\n";
    return ss.str();
}

void pushEvent(DSResult& res, const vector<int>& items, string type, int highlight, int p1, string lbl1, int p2, string lbl2, int val, int line, string desc, const vector<int>& seq = {}) {
    res.events.push_back({type, highlight, p1, p2, lbl1, lbl2, val, line, desc, items, seq});
}

// 1. Dynamic Array C++ Engine
DSResult runArrayOp(vector<int> items, string op, int val, int idx, string dir) {
    DSResult res; res.structureKey = "array"; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    if (op == "insert") {
        int targetIdx = (idx >= 0 && idx <= (int)items.size()) ? idx : (int)items.size();
        pushEvent(res, items, "locate", targetIdx, targetIdx, "target", -1, "", val, 1, "C++ Array: Targeted index [" + to_string(targetIdx) + "] for insertion.");
        items.insert(items.begin() + targetIdx, val);
        pushEvent(res, items, "insert", targetIdx, targetIdx, "inserted", -1, "", val, 4, "C++ Array: Inserted " + to_string(val) + " at index [" + to_string(targetIdx) + "].");
    } else if (op == "delete") {
        if (!items.empty()) {
            int targetIdx = (idx >= 0 && idx < (int)items.size()) ? idx : (int)items.size() - 1;
            int removed = items[targetIdx];
            pushEvent(res, items, "locate", targetIdx, targetIdx, "target", -1, "", removed, 1, "C++ Array: Targeting element " + to_string(removed) + " at index [" + to_string(targetIdx) + "].");
            items.erase(items.begin() + targetIdx);
            pushEvent(res, items, "delete", -1, -1, "", -1, "", removed, 3, "C++ Array: Deleted element " + to_string(removed) + " and shifted elements left.");
        }
    } else if (op == "update") {
        if (!items.empty()) {
            int targetIdx = (idx >= 0 && idx < (int)items.size()) ? idx : (int)items.size() - 1;
            int oldVal = items[targetIdx];
            items[targetIdx] = val;
            pushEvent(res, items, "update", targetIdx, targetIdx, "updated", -1, "", val, 2, "C++ Array: Updated index [" + to_string(targetIdx) + "] from " + to_string(oldVal) + " to " + to_string(val) + ".");
        }
    } else if (op == "reverse") {
        pushEvent(res, items, "start", -1, 0, "left", (int)items.size() - 1, "right", 0, 1, "C++ Array: Reversing elements with two pointers.");
        reverse(items.begin(), items.end());
        pushEvent(res, items, "reverse", -1, 0, "head", (int)items.size() - 1, "tail", 0, 3, "C++ Array: Reversal complete.");
    } else if (op == "sort") {
        sort(items.begin(), items.end());
        pushEvent(res, items, "sort", -1, -1, "", -1, "", 0, 1, "C++ Array: Sorted elements in ascending numerical order.");
    } else if (op == "search") {
        vector<int> visited;
        bool found = false;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            if (items[i] == val) {
                pushEvent(res, items, "found", i, i, "match", -1, "", val, 3, "C++ Array: Found target " + to_string(val) + " at index [" + to_string(i) + "].", visited);
                found = true;
                break;
            } else {
                pushEvent(res, items, "compare", i, i, "curr", -1, "", items[i], 2, "C++ Array: Comparing element " + to_string(items[i]) + " with target " + to_string(val) + ".", visited);
            }
        }
        if (!found) {
            pushEvent(res, items, "not_found", -1, -1, "", -1, "", val, 4, "C++ Array: Target " + to_string(val) + " not found in array.", visited);
        }
    } else if (op == "traverse") {
        vector<int> visited;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            pushEvent(res, items, "visit", i, i, "curr", -1, "", items[i], 2, "C++ Array: Visiting element at index [" + to_string(i) + "]: value is " + to_string(items[i]) + ".", visited);
        }
        pushEvent(res, items, "complete", -1, -1, "", -1, "", 0, 5, "C++ Array: Traversal completed across all " + to_string(items.size()) + " elements.", visited);
    } else if (op == "rotate") {
        if (!items.empty()) {
            if (dir == "right") {
                int last = items.back();
                items.pop_back();
                items.insert(items.begin(), last);
                pushEvent(res, items, "rotate_right", 0, 0, "rotated", -1, "", last, 2, "C++ Array: Rotated right by 1.");
            } else {
                int first = items.front();
                items.erase(items.begin());
                items.push_back(first);
                pushEvent(res, items, "rotate_left", (int)items.size() - 1, (int)items.size() - 1, "rotated", -1, "", first, 2, "C++ Array: Rotated left by 1.");
            }
        }
    }

    res.elementsCount = items.size();
    res.memoryUsedBytes = items.size() * sizeof(int);
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    return res;
}

// 2. Stack C++ Engine
DSResult runStackOp(vector<int> items, string op, int val, int cap = 8) {
    DSResult res; res.structureKey = "stack"; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    if (op == "push") {
        if ((int)items.size() >= cap) {
            pushEvent(res, items, "overflow", -1, (int)items.size() - 1, "top", -1, "", val, 1, "C++ Stack: OVERFLOW! Max capacity " + to_string(cap) + " reached.");
        } else {
            items.push_back(val);
            pushEvent(res, items, "push", (int)items.size() - 1, (int)items.size() - 1, "top", -1, "", val, 3, "C++ Stack: Pushed " + to_string(val) + " onto Top.");
        }
    } else if (op == "pop") {
        if (items.empty()) {
            pushEvent(res, items, "underflow", -1, -1, "", -1, "", 0, 1, "C++ Stack: UNDERFLOW! Stack is empty.");
        } else {
            int popped = items.back();
            items.pop_back();
            pushEvent(res, items, "pop", (int)items.size() - 1, (int)items.size() - 1, "top", -1, "", popped, 3, "C++ Stack: Popped top element " + to_string(popped) + ".");
        }
    } else if (op == "peek") {
        if (!items.empty()) {
            pushEvent(res, items, "peek", (int)items.size() - 1, (int)items.size() - 1, "top", -1, "", items.back(), 2, "C++ Stack: Top element is " + to_string(items.back()) + ".");
        }
    } else if (op == "search") {
        vector<int> visited;
        bool found = false;
        for (int i = (int)items.size() - 1; i >= 0; --i) {
            visited.push_back(items[i]);
            if (items[i] == val) {
                pushEvent(res, items, "found", i, i, "top", -1, "", val, 3, "C++ Stack: Found target " + to_string(val) + " at depth from top.", visited);
                found = true;
                break;
            } else {
                pushEvent(res, items, "compare", i, i, "inspect", -1, "", items[i], 2, "C++ Stack: Inspecting element " + to_string(items[i]) + " from top.", visited);
            }
        }
        if (!found) {
            pushEvent(res, items, "not_found", -1, -1, "", -1, "", val, 4, "C++ Stack: Target " + to_string(val) + " not found in stack.", visited);
        }
    } else if (op == "traverse") {
        vector<int> visited;
        for (int i = (int)items.size() - 1; i >= 0; --i) {
            visited.push_back(items[i]);
            pushEvent(res, items, "visit", i, i, "curr", -1, "", items[i], 2, "C++ Stack: Traversing stack element from top: value is " + to_string(items[i]) + ".", visited);
        }
        pushEvent(res, items, "complete", -1, -1, "", -1, "", 0, 5, "C++ Stack: Traversal completed across all " + to_string(items.size()) + " elements.", visited);
    }

    res.elementsCount = items.size();
    res.memoryUsedBytes = items.size() * sizeof(int);
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    return res;
}

// 3. Queue C++ Engine
DSResult runQueueOp(vector<int> items, string op, int val, int cap = 8) {
    DSResult res; res.structureKey = "queue"; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    if (op == "enqueue") {
        if ((int)items.size() >= cap) {
            pushEvent(res, items, "overflow", -1, 0, "front", (int)items.size() - 1, "rear", val, 1, "C++ Queue: OVERFLOW! Max capacity " + to_string(cap) + " reached.");
        } else {
            items.push_back(val);
            pushEvent(res, items, "enqueue", (int)items.size() - 1, 0, "front", (int)items.size() - 1, "rear", val, 2, "C++ Queue: Enqueued " + to_string(val) + " at Rear.");
        }
    } else if (op == "dequeue" || op == "popFront") {
        if (items.empty()) {
            pushEvent(res, items, "underflow", -1, -1, "", -1, "", 0, 1, "C++ Queue: UNDERFLOW! Queue is empty.");
        } else {
            int deq = items.front();
            items.erase(items.begin());
            pushEvent(res, items, "dequeue", 0, 0, "front", max(0, (int)items.size() - 1), "rear", deq, 3, "C++ Queue: Dequeued front element " + to_string(deq) + ".");
        }
    } else if (op == "pushFront") {
        items.insert(items.begin(), val);
        pushEvent(res, items, "push_front", 0, 0, "front", (int)items.size() - 1, "rear", val, 2, "C++ Deque: Pushed " + to_string(val) + " at Front.");
    } else if (op == "pushBack") {
        items.push_back(val);
        pushEvent(res, items, "push_back", (int)items.size() - 1, 0, "front", (int)items.size() - 1, "rear", val, 2, "C++ Deque: Pushed " + to_string(val) + " at Back.");
    } else if (op == "popBack") {
        if (!items.empty()) {
            int popped = items.back();
            items.pop_back();
            pushEvent(res, items, "pop_back", max(0, (int)items.size() - 1), 0, "front", max(0, (int)items.size() - 1), "rear", popped, 3, "C++ Deque: Popped back element " + to_string(popped) + ".");
        }
    } else if (op == "search") {
        vector<int> visited;
        bool found = false;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            if (items[i] == val) {
                pushEvent(res, items, "found", i, 0, "front", (int)items.size() - 1, "rear", val, 3, "C++ Queue: Found target " + to_string(val) + " at position [" + to_string(i) + "].", visited);
                found = true;
                break;
            } else {
                pushEvent(res, items, "compare", i, 0, "front", (int)items.size() - 1, "rear", items[i], 2, "C++ Queue: Inspecting element " + to_string(items[i]) + ".", visited);
            }
        }
        if (!found) {
            pushEvent(res, items, "not_found", -1, 0, "front", (int)items.size() - 1, "rear", val, 4, "C++ Queue: Target " + to_string(val) + " not found in queue.", visited);
        }
    } else if (op == "traverse") {
        vector<int> visited;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            pushEvent(res, items, "visit", i, 0, "front", (int)items.size() - 1, "rear", items[i], 2, "C++ Queue: Traversing queue element: value is " + to_string(items[i]) + ".", visited);
        }
        pushEvent(res, items, "complete", -1, 0, "front", (int)items.size() - 1, "rear", 0, 5, "C++ Queue: Traversal completed across all " + to_string(items.size()) + " elements.", visited);
    }

    res.elementsCount = items.size();
    res.memoryUsedBytes = items.size() * sizeof(int);
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    return res;
}

// 4. Linked List C++ Engine
DSResult runLinkedListOp(string key, vector<int> items, string op, int val) {
    DSResult res; res.structureKey = key; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    if (op == "insertHead") {
        items.insert(items.begin(), val);
        pushEvent(res, items, "insertHead", 0, 0, "head", (int)items.size() - 1, "tail", val, 1, "C++ " + key + ": Inserted new Head node (" + to_string(val) + ").");
    } else if (op == "insertTail") {
        items.push_back(val);
        pushEvent(res, items, "insertTail", (int)items.size() - 1, 0, "head", (int)items.size() - 1, "tail", val, 2, "C++ " + key + ": Appended new Tail node (" + to_string(val) + ").");
    } else if (op == "deleteHead") {
        if (!items.empty()) {
            int removed = items.front();
            items.erase(items.begin());
            pushEvent(res, items, "deleteHead", 0, 0, "head", max(0, (int)items.size() - 1), "tail", removed, 2, "C++ " + key + ": Deleted Head node (" + to_string(removed) + ").");
        }
    } else if (op == "deleteTail") {
        if (!items.empty()) {
            int removed = items.back();
            items.pop_back();
            pushEvent(res, items, "deleteTail", (int)items.size() - 1, 0, "head", max(0, (int)items.size() - 1), "tail", removed, 2, "C++ " + key + ": Deleted Tail node (" + to_string(removed) + ").");
        }
    } else if (op == "search") {
        vector<int> visited;
        bool found = false;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            if (items[i] == val) {
                pushEvent(res, items, "found", i, 0, "head", (int)items.size() - 1, "tail", val, 3, "C++ " + key + ": Found target " + to_string(val) + " at node index [" + to_string(i) + "].", visited);
                found = true;
                break;
            } else {
                pushEvent(res, items, "compare", i, 0, "head", (int)items.size() - 1, "tail", items[i], 2, "C++ " + key + ": Traversing node [" + to_string(i) + "]: value is " + to_string(items[i]) + ".", visited);
            }
        }
        if (!found) {
            pushEvent(res, items, "not_found", -1, 0, "head", (int)items.size() - 1, "tail", val, 4, "C++ " + key + ": Target " + to_string(val) + " not found in linked list.", visited);
        }
    } else if (op == "traverse") {
        vector<int> visited;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            pushEvent(res, items, "visit", i, 0, "head", (int)items.size() - 1, "tail", items[i], 2, "C++ " + key + ": Visiting node [" + to_string(i) + "]: value is " + to_string(items[i]) + ".", visited);
        }
        pushEvent(res, items, "complete", -1, 0, "head", (int)items.size() - 1, "tail", 0, 5, "C++ " + key + ": Traversal completed across all " + to_string(items.size()) + " nodes.", visited);
    }

    res.elementsCount = items.size();
    res.memoryUsedBytes = items.size() * (sizeof(int) + 2 * sizeof(void*));
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    return res;
}

// 5. Binary Heap C++ Engine (Min/Max Heap)
DSResult runHeapOp(string key, vector<int> items, string op, int val, string heapType = "min") {
    DSResult res; res.structureKey = key; res.operation = op;
    auto start = chrono::high_resolution_clock::now();
    bool isMin = (heapType == "min" || key == "minheap");

    if (op == "insert") {
        items.push_back(val);
        pushEvent(res, items, "insert", (int)items.size() - 1, (int)items.size() - 1, "leaf", -1, "", val, 1, "C++ Heap: Inserted " + to_string(val) + " at leaf position.");

        int i = items.size() - 1;
        while (i > 0) {
            int p = (i - 1) / 2;
            bool swapNeeded = isMin ? (items[p] > items[i]) : (items[p] < items[i]);
            if (swapNeeded) {
                swap(items[p], items[i]);
                pushEvent(res, items, "sift_up", p, i, "node", p, "parent", val, 3, "C++ Heap: Swapped node [" + to_string(i) + "] with parent [" + to_string(p) + "].");
                i = p;
            } else break;
        }
        pushEvent(res, items, "restored", 0, 0, "root", -1, "", val, 5, "C++ Heap: Heap property fully restored.");
    } else if (op == "extract") {
        if (!items.empty()) {
            int rootVal = items[0];
            items[0] = items.back();
            items.pop_back();
            pushEvent(res, items, "extract", 0, 0, "root", -1, "", rootVal, 2, "C++ Heap: Extracted root (" + to_string(rootVal) + "). Replaced with last leaf.");

            int i = 0;
            int n = items.size();
            while (true) {
                int left = 2 * i + 1;
                int right = 2 * i + 2;
                int target = i;

                if (left < n && (isMin ? (items[left] < items[target]) : (items[left] > items[target]))) target = left;
                if (right < n && (isMin ? (items[right] < items[target]) : (items[right] > items[target]))) target = right;

                if (target != i) {
                    swap(items[i], items[target]);
                    pushEvent(res, items, "sift_down", target, i, "node", target, "child", items[target], 4, "C++ Heap: Sifted down node [" + to_string(i) + "] with child [" + to_string(target) + "].");
                    i = target;
                } else break;
            }
        }
    } else if (op == "heapify") {
        int n = items.size();
        pushEvent(res, items, "start", 0, 0, "root", -1, "", 0, 1, "C++ Heap: Starting O(N) bottom-up heapify.");
        for (int i = n / 2 - 1; i >= 0; --i) {
            int curr = i;
            while (true) {
                int left = 2 * curr + 1;
                int right = 2 * curr + 2;
                int target = curr;
                if (left < n && (isMin ? (items[left] < items[target]) : (items[left] > items[target]))) target = left;
                if (right < n && (isMin ? (items[right] < items[target]) : (items[right] > items[target]))) target = right;
                if (target != curr) {
                    swap(items[curr], items[target]);
                    pushEvent(res, items, "heapify_swap", target, curr, "node", target, "child", items[target], 3, "C++ Heap: Sifting down node [" + to_string(curr) + "].");
                    curr = target;
                } else break;
            }
        }
        pushEvent(res, items, "heapified", 0, 0, "root", -1, "", 0, 5, "C++ Heap: Heapify complete in O(N) time.");
    } else if (op == "search") {
        vector<int> visited;
        bool found = false;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            if (items[i] == val) {
                pushEvent(res, items, "found", i, 0, "root", i, "match", val, 3, "C++ Heap: Found target " + to_string(val) + " at heap index [" + to_string(i) + "].", visited);
                found = true;
                break;
            } else {
                pushEvent(res, items, "compare", i, 0, "root", i, "curr", items[i], 2, "C++ Heap: Inspecting node [" + to_string(i) + "]: value is " + to_string(items[i]) + ".", visited);
            }
        }
        if (!found) {
            pushEvent(res, items, "not_found", -1, 0, "root", -1, "", val, 4, "C++ Heap: Target " + to_string(val) + " not found in heap.", visited);
        }
    } else if (op == "traverse") {
        vector<int> visited;
        for (int i = 0; i < (int)items.size(); ++i) {
            visited.push_back(items[i]);
            pushEvent(res, items, "visit", i, 0, "root", i, "curr", items[i], 2, "C++ Heap: Visiting heap node [" + to_string(i) + "]: value is " + to_string(items[i]) + ".", visited);
        }
        pushEvent(res, items, "complete", -1, 0, "root", -1, "", 0, 5, "C++ Heap: Level-order traversal completed across all " + to_string(items.size()) + " nodes.", visited);
    }

    res.elementsCount = items.size();
    res.memoryUsedBytes = items.size() * sizeof(int);
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    return res;
}

// Main Driver
int main(int argc, char* argv[]) {
    string structKey = "array";
    string op = "insert";
    int val = 42;
    int idx = -1;
    string dir = "left";

    if (argc > 1) structKey = argv[1];
    if (argc > 2) op = argv[2];
    if (argc > 3) val = atoi(argv[3]);
    if (argc > 4) idx = atoi(argv[4]);
    if (argc > 5) dir = argv[5];

    vector<int> input;
    int x;
    while (cin >> x) input.push_back(x);
    if (input.empty()) input = {12, 34, 56, 78, 90};

    DSResult res;
    if (structKey == "array") res = runArrayOp(input, op, val, idx, dir);
    else if (structKey == "stack") res = runStackOp(input, op, val);
    else if (structKey == "queue" || structKey == "cqueue" || structKey == "deque") res = runQueueOp(input, op, val);
    else if (structKey == "singlylist" || structKey == "doublylist" || structKey == "circularlist") res = runLinkedListOp(structKey, input, op, val);
    else res = runHeapOp(structKey, input, op, val);

    cout << toJSON(res);
    return 0;
}
