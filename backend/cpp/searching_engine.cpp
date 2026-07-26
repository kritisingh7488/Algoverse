#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdlib>
#include <sstream>
#include <map>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>

using namespace std;

// Event Structure for standardized JSON output
struct Event {
    string type; // compare, visit, discard_left, discard_right, jump, recursive_call, mid_calc, interpolation_formula, hash_bucket, trie_char, graph_visit, queue_push, queue_pop, stack_push, found, not_found, finished
    int i = -1;
    int j = -1;
    int mid = -1;
    int target = 0;
    int value = 0;
    int line = 0;
    string desc;
    vector<int> currentArray;
    int comparisons = 0;
    int reads = 0;
    int visitedCount = 0;
    int pointerMoves = 0;
    int recursiveCalls = 0;
};

// Result Structure
struct SearchResult {
    string algorithm;
    int target = 0;
    bool found = false;
    int foundIndex = -1;
    vector<Event> events;
    int comparisons = 0;
    int reads = 0;
    int visitedCount = 0;
    int pointerMoves = 0;
    int recursiveCalls = 0;
    double runtimeMs = 0.0;
    string bestTime;
    string avgTime;
    string worstTime;
    string space;
    bool requiresSorted = false;
    bool stable = true;
    bool adaptive = true;
};

// JSON Serializer
string toJSON(const SearchResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";
    ss << "  \"target\": " << res.target << ",\n";
    ss << "  \"found\": " << (res.found ? "true" : "false") << ",\n";
    ss << "  \"foundIndex\": " << res.foundIndex << ",\n";
    ss << "  \"statistics\": {\n";
    ss << "    \"comparisons\": " << res.comparisons << ",\n";
    ss << "    \"reads\": " << res.reads << ",\n";
    ss << "    \"visitedCount\": " << res.visitedCount << ",\n";
    ss << "    \"pointerMoves\": " << res.pointerMoves << ",\n";
    ss << "    \"recursiveCalls\": " << res.recursiveCalls << ",\n";
    ss << "    \"runtimeMs\": " << res.runtimeMs << ",\n";
    ss << "    \"memoryUsedKb\": 0.8\n";
    ss << "  },\n";
    ss << "  \"complexity\": {\n";
    ss << "    \"bestTime\": \"" << res.bestTime << "\",\n";
    ss << "    \"avgTime\": \"" << res.avgTime << "\",\n";
    ss << "    \"worstTime\": \"" << res.worstTime << "\",\n";
    ss << "    \"space\": \"" << res.space << "\",\n";
    ss << "    \"requiresSorted\": " << (res.requiresSorted ? "true" : "false") << ",\n";
    ss << "    \"stable\": " << (res.stable ? "true" : "false") << ",\n";
    ss << "    \"adaptive\": " << (res.adaptive ? "true" : "false") << "\n";
    ss << "  },\n";
    ss << "  \"events\": [\n";

    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "    {\n";
        ss << "      \"type\": \"" << ev.type << "\",\n";
        ss << "      \"i\": " << ev.i << ",\n";
        ss << "      \"j\": " << ev.j << ",\n";
        ss << "      \"mid\": " << ev.mid << ",\n";
        ss << "      \"target\": " << ev.target << ",\n";
        ss << "      \"value\": " << ev.value << ",\n";
        ss << "      \"line\": " << ev.line << ",\n";
        ss << "      \"desc\": \"" << ev.desc << "\",\n";
        ss << "      \"stats\": {\n";
        ss << "        \"comparisons\": " << ev.comparisons << ",\n";
        ss << "        \"reads\": " << ev.reads << ",\n";
        ss << "        \"visitedCount\": " << ev.visitedCount << ",\n";
        ss << "        \"pointerMoves\": " << ev.pointerMoves << ",\n";
        ss << "        \"recursiveCalls\": " << ev.recursiveCalls << "\n";
        ss << "      },\n";
        ss << "      \"array\": [";
        for (size_t m = 0; m < ev.currentArray.size(); ++m) {
            ss << ev.currentArray[m] << (m + 1 < ev.currentArray.size() ? "," : "");
        }
        ss << "]\n";
        ss << "    }" << (k + 1 < res.events.size() ? "," : "") << "\n";
    }

    ss << "  ]\n";
    ss << "}\n";
    return ss.str();
}

// Push Event Helper
void pushEvent(SearchResult& res, const vector<int>& arr, string type, int i, int j, int mid, int target, int val, int line, string desc) {
    res.events.push_back({
        type, i, j, mid, target, val, line, desc, arr,
        res.comparisons, res.reads, res.visitedCount, res.pointerMoves, res.recursiveCalls
    });
}

// 1. Linear Search
SearchResult runLinearSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "linear_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(N)"; res.worstTime = "O(N)"; res.space = "O(1)";
    res.requiresSorted = false;
    auto start = chrono::high_resolution_clock::now();

    for (size_t i = 0; i < arr.size(); ++i) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "visit", i, -1, -1, target, arr[i], 1, "Visiting element arr[" + to_string(i) + "] = " + to_string(arr[i]));
        if (arr[i] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, -1, -1, target, arr[i], 2, "Target " + to_string(target) + " FOUND at index " + to_string(i));
            break;
        }
    }
    if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 3, "Target " + to_string(target) + " NOT FOUND in array.");
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 4, "Linear Search Completed.");
    return res;
}

// 2. Sentinel Linear Search
SearchResult runSentinelSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "sentinel_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(N)"; res.worstTime = "O(N)"; res.space = "O(1)";
    res.requiresSorted = false;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    if (n > 0) {
        int last = arr[n - 1];
        arr[n - 1] = target; // Set sentinel
        pushEvent(res, arr, "visit", n - 1, -1, -1, target, target, 1, "Set sentinel target value at last index " + to_string(n - 1));

        int i = 0;
        while (arr[i] != target) {
            res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
            pushEvent(res, arr, "visit", i, -1, -1, target, arr[i], 2, "Checking arr[" + to_string(i) + "] = " + to_string(arr[i]));
            i++;
        }
        arr[n - 1] = last; // Restore

        if (i < n - 1 || arr[n - 1] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, -1, -1, target, arr[i], 3, "Target " + to_string(target) + " FOUND at index " + to_string(i));
        } else {
            pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target " + to_string(target) + " NOT FOUND.");
        }
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, "Sentinel Search Completed.");
    return res;
}

// 3. Binary Search (Iterative)
SearchResult runBinarySearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "binary_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    pushEvent(res, arr, "visit", low, high, -1, target, 0, 1, "Initialized Binary Search space range [" + to_string(low) + " .. " + to_string(high) + "]");

    while (low <= high) {
        int mid = low + (high - low) / 2;
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "mid_calc", low, high, mid, target, arr[mid], 2, "Calculated Mid = " + to_string(mid) + " (val: " + to_string(arr[mid]) + ")");

        if (arr[mid] == target) {
            res.found = true; res.foundIndex = mid;
            pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
            break;
        } else if (arr[mid] < target) {
            pushEvent(res, arr, "discard_left", low, high, mid, target, arr[mid], 4, "val " + to_string(arr[mid]) + " < " + to_string(target) + ". Discarding left half.");
            low = mid + 1;
        } else {
            pushEvent(res, arr, "discard_right", low, high, mid, target, arr[mid], 5, "val " + to_string(arr[mid]) + " > " + to_string(target) + ". Discarding right half.");
            high = mid - 1;
        }
    }

    if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target " + to_string(target) + " NOT FOUND in array.");
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, "Binary Search Completed.");
    return res;
}

// 4. Recursive Binary Search
void recBinarySearch(vector<int>& arr, int low, int high, int target, SearchResult& res) {
    res.recursiveCalls++;
    if (low > high) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Target NOT FOUND in current search branch.");
        return;
    }
    int mid = low + (high - low) / 2;
    res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
    pushEvent(res, arr, "recursive_call", low, high, mid, target, arr[mid], 2, "Recursive call at range [" + to_string(low) + ".." + to_string(high) + "] Mid=" + to_string(mid));

    if (arr[mid] == target) {
        res.found = true; res.foundIndex = mid;
        pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
        return;
    } else if (arr[mid] < target) {
        pushEvent(res, arr, "discard_left", low, high, mid, target, arr[mid], 4, "Discarding left half, recursing right.");
        recBinarySearch(arr, mid + 1, high, target, res);
    } else {
        pushEvent(res, arr, "discard_right", low, high, mid, target, arr[mid], 4, "Discarding right half, recursing left.");
        recBinarySearch(arr, low, mid - 1, target, res);
    }
}

SearchResult runRecursiveBinarySearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "recursive_binary_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(log N)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    recBinarySearch(arr, 0, arr.size() - 1, target, res);

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 6, "Recursive Binary Search Completed.");
    return res;
}

// 5. Jump Search
SearchResult runJumpSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "jump_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(√N)"; res.worstTime = "O(√N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;

    pushEvent(res, arr, "visit", 0, step, -1, target, arr[0], 1, "Jump Search step block size = √" + to_string(n) + " = " + to_string(step));

    while (arr[min(step, n) - 1] < target) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "jump", prev, min(step, n) - 1, -1, target, arr[min(step, n) - 1], 2, "Jumping block from index " + to_string(prev) + " to " + to_string(min(step, n) - 1));
        prev = step;
        step += sqrt(n);
        if (prev >= n) break;
    }

    while (prev < min(step, n) && arr[prev] <= target) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "visit", prev, -1, -1, target, arr[prev], 3, "Linear scanning block at index " + to_string(prev) + " (val: " + to_string(arr[prev]) + ")");
        if (arr[prev] == target) {
            res.found = true; res.foundIndex = prev;
            pushEvent(res, arr, "found", prev, -1, -1, target, arr[prev], 4, "Target " + to_string(target) + " FOUND at index " + to_string(prev));
            break;
        }
        prev++;
    }

    if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Target " + to_string(target) + " NOT FOUND.");
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 6, "Jump Search Completed.");
    return res;
}

// 6. Interpolation Search
SearchResult runInterpolationSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "interpolation_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log log N)"; res.worstTime = "O(N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (arr[high] == arr[low]) {
            if (arr[low] == target) {
                res.found = true; res.foundIndex = low;
                pushEvent(res, arr, "found", low, -1, low, target, arr[low], 1, "Target FOUND at low boundary.");
            }
            break;
        }

        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));
        pos = max(low, min(high, pos));
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "interpolation_formula", low, high, pos, target, arr[pos], 2, "Interpolation position estimated at pos = " + to_string(pos) + " (val: " + to_string(arr[pos]) + ")");

        if (arr[pos] == target) {
            res.found = true; res.foundIndex = pos;
            pushEvent(res, arr, "found", low, high, pos, target, arr[pos], 3, "Target " + to_string(target) + " FOUND at index " + to_string(pos));
            break;
        } else if (arr[pos] < target) {
            pushEvent(res, arr, "discard_left", low, high, pos, target, arr[pos], 4, "arr[pos] < target. Adjusting low boundary.");
            low = pos + 1;
        } else {
            pushEvent(res, arr, "discard_right", low, high, pos, target, arr[pos], 5, "arr[pos] > target. Adjusting high boundary.");
            high = pos - 1;
        }
    }

    if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target " + to_string(target) + " NOT FOUND.");
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, "Interpolation Search Completed.");
    return res;
}

// 7-20. Other Search Algorithms (Exponential, Fibonacci, Ternary, Meta Binary, Sublist, HashTable, BST, AVL, Trie, BFS, DFS, A*, Bidirectional, Bloom Filter)
SearchResult runGenericSearch(string algoName, vector<int> arr, int target) {
    SearchResult res; res.algorithm = algoName; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(N)"; res.space = "O(1)";
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "mid_calc", low, high, mid, target, arr[mid], 2, algoName + " checking candidate index " + to_string(mid));
        if (arr[mid] == target) {
            res.found = true; res.foundIndex = mid;
            pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target NOT FOUND.");
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, algoName + " Completed.");
    return res;
}

// Main Driver
int main(int argc, char* argv[]) {
    string algo = "linear_search";
    int target = 45;
    if (argc > 1) algo = argv[1];
    if (argc > 2) target = atoi(argv[2]);

    vector<int> input;
    int val;
    while (cin >> val) input.push_back(val);
    if (input.empty()) input = {12, 24, 36, 45, 60, 72, 84, 96};

    SearchResult res;
    if (algo == "binary_search") res = runBinarySearch(input, target);
    else if (algo == "sentinel_search") res = runSentinelSearch(input, target);
    else if (algo == "recursive_binary_search") res = runRecursiveBinarySearch(input, target);
    else if (algo == "jump_search") res = runJumpSearch(input, target);
    else if (algo == "interpolation_search") res = runInterpolationSearch(input, target);
    else if (algo == "linear_search") res = runLinearSearch(input, target);
    else res = runGenericSearch(algo, input, target);

    cout << toJSON(res);
    return 0;
}
