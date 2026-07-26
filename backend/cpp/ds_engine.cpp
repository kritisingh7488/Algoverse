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
    int pointer1 = -1; // e.g. head / top / front / i
    int pointer2 = -1; // e.g. tail / rear / j
    string ptrLabel1 = "";
    string ptrLabel2 = "";
    int value = 0;
    int line = 0;
    string desc;
    vector<int> currentItems;
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
        ss << "]\n";
        ss << "    }" << (k + 1 < res.events.size() ? "," : "") << "\n";
    }

    ss << "  ]\n";
    ss << "}\n";
    return ss.str();
}

void pushEvent(DSResult& res, const vector<int>& items, string type, int highlight, int p1, string lbl1, int p2, string lbl2, int val, int line, string desc) {
    res.events.push_back({type, highlight, p1, p2, lbl1, lbl2, val, line, desc, items});
}

// 1. Dynamic Array C++ Engine
DSResult runArrayOp(vector<int> items, string op, int val, int idx, string dir) {
    DSResult res; res.structureKey = "array"; res.operation = op;
    auto start = chrono::high_resolution_clock::now();

    if (op == "insert") {
        int targetIdx = max(0, min((int)items.size(), idx >= 0 ? idx : (int)items.size()));
        pushEvent(res, items, "locate", targetIdx, targetIdx, "target", -1, "", val, 1, "C++ Array: Targeted index [" + to_string(targetIdx) + "] for insertion.");
        items.insert(items.begin() + targetIdx, val);
        pushEvent(res, items, "insert", targetIdx, targetIdx, "inserted", -1, "", val, 4, "C++ Array: Inserted " + to_string(val) + " at index [" + to_string(targetIdx) + "].");
    } else if (op == "delete") {
        if (!items.empty()) {
            int targetIdx = max(0, min((int)items.size() - 1, idx >= 0 ? idx : (int)items.size() - 1));
            int removed = items[targetIdx];
            pushEvent(res, items, "locate", targetIdx, targetIdx, "target", -1, "", removed, 1, "C++ Array: Targeting element " + to_string(removed) + " at index [" + to_string(targetIdx) + "].");
            items.erase(items.begin() + targetIdx);
            pushEvent(res, items, "delete", -1, -1, "", -1, "", removed, 3, "C++ Array: Deleted element " + to_string(removed) + " and shifted elements left.");
        }
    } else if (op == "reverse") {
        pushEvent(res, items, "start", -1, 0, "left", (int)items.size() - 1, "right", 0, 1, "C++ Array: Reversing elements with two pointers.");
        reverse(items.begin(), items.end());
        pushEvent(res, items, "reverse", -1, 0, "head", (int)items.size() - 1, "tail", 0, 3, "C++ Array: Reversal complete.");
    } else if (op == "sort") {
        sort(items.begin(), items.end());
        pushEvent(res, items, "sort", -1, -1, "", -1, "", 0, 1, "C++ Array: Sorted elements in ascending numerical order.");
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
    } else if (op == "dequeue") {
        if (items.empty()) {
            pushEvent(res, items, "underflow", -1, -1, "", -1, "", 0, 1, "C++ Queue: UNDERFLOW! Queue is empty.");
        } else {
            int deq = items.front();
            items.erase(items.begin());
            pushEvent(res, items, "dequeue", 0, 0, "front", max(0, (int)items.size() - 1), "rear", deq, 3, "C++ Queue: Dequeued front element " + to_string(deq) + ".");
        }
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

        // Sift Up / Bubble Up
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

            // Sift Down
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
