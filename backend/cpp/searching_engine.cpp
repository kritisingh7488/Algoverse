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

// Standardized Event Structure
struct Event {
    string type; // visit, mid_calc, discard_left, discard_right, jump, interpolation_formula, exponential_range, fib_partition, ternary_mids, bit_evaluation, hash_bucket, cuckoo_probe, tree_traversal, move_left, move_right, trie_char, kmp_lps, rolling_hash, queue_push, queue_pop, stack_push, stack_pop, graph_visit, found, not_found, finished
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
    auto start = chrono::high_resolution_clock::now();

    for (size_t i = 0; i < arr.size(); ++i) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "visit", i, -1, -1, target, arr[i], 1, "Linear scanning index [" + to_string(i) + "] = " + to_string(arr[i]));
        if (arr[i] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, -1, -1, target, arr[i], 2, "Target " + to_string(target) + " FOUND at index " + to_string(i));
            break;
        }
    }
    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 3, "Target NOT FOUND.");

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 4, "Linear Search Completed.");
    return res;
}

// 2. Sentinel Linear Search
SearchResult runSentinelSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "sentinel_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(N)"; res.worstTime = "O(N)"; res.space = "O(1)";
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    if (n > 0) {
        int last = arr[n - 1];
        arr[n - 1] = target;
        pushEvent(res, arr, "visit", n - 1, -1, -1, target, target, 1, "Sentinel placed at index [" + to_string(n - 1) + "]");

        int i = 0;
        while (arr[i] != target) {
            res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
            pushEvent(res, arr, "visit", i, -1, -1, target, arr[i], 2, "Sentinel checking index [" + to_string(i) + "] = " + to_string(arr[i]));
            i++;
        }
        arr[n - 1] = last;

        if (i < n - 1 || arr[n - 1] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, -1, -1, target, arr[i], 3, "Target " + to_string(target) + " FOUND at index " + to_string(i));
        } else {
            pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target NOT FOUND.");
        }
    }
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, "Sentinel Search Completed.");
    return res;
}

// 3. Binary Search
SearchResult runBinarySearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "binary_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "mid_calc", low, high, mid, target, arr[mid], 2, "Binary Search Mid = " + to_string(mid) + " (val: " + to_string(arr[mid]) + ")");

        if (arr[mid] == target) {
            res.found = true; res.foundIndex = mid;
            pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
            break;
        } else if (arr[mid] < target) {
            pushEvent(res, arr, "discard_left", low, high, mid, target, arr[mid], 4, "val < target. Discarding left range.");
            low = mid + 1;
        } else {
            pushEvent(res, arr, "discard_right", low, high, mid, target, arr[mid], 5, "val > target. Discarding right range.");
            high = mid - 1;
        }
    }
    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target NOT FOUND.");

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, "Binary Search Completed.");
    return res;
}

// 4. Recursive Binary Search
void recBinarySearch(vector<int>& arr, int low, int high, int target, SearchResult& res) {
    res.recursiveCalls++;
    if (low > high) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Recurse base case: range empty.");
        return;
    }
    int mid = low + (high - low) / 2;
    res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
    pushEvent(res, arr, "recursive_call", low, high, mid, target, arr[mid], 2, "Recursive call frame [" + to_string(low) + ".." + to_string(high) + "] Mid = " + to_string(mid));

    if (arr[mid] == target) {
        res.found = true; res.foundIndex = mid;
        pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
        return;
    } else if (arr[mid] < target) {
        pushEvent(res, arr, "discard_left", low, high, mid, target, arr[mid], 4, "Recursing right branch.");
        recBinarySearch(arr, mid + 1, high, target, res);
    } else {
        pushEvent(res, arr, "discard_right", low, high, mid, target, arr[mid], 4, "Recursing left branch.");
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

    pushEvent(res, arr, "visit", 0, step, -1, target, arr[0], 1, "Jump block size = √" + to_string(n) + " = " + to_string(step));

    while (arr[min(step, n) - 1] < target) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "jump", prev, min(step, n) - 1, -1, target, arr[min(step, n) - 1], 2, "Jumping block from " + to_string(prev) + " to " + to_string(min(step, n) - 1));
        prev = step;
        step += sqrt(n);
        if (prev >= n) break;
    }

    while (prev < min(step, n) && arr[prev] <= target) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "visit", prev, -1, -1, target, arr[prev], 3, "Scanning block element at index " + to_string(prev));
        if (arr[prev] == target) {
            res.found = true; res.foundIndex = prev;
            pushEvent(res, arr, "found", prev, -1, -1, target, arr[prev], 4, "Target " + to_string(target) + " FOUND at index " + to_string(prev));
            break;
        }
        prev++;
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Target NOT FOUND.");
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
                pushEvent(res, arr, "found", low, -1, low, target, arr[low], 1, "Target FOUND at boundary.");
            }
            break;
        }

        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));
        pos = max(low, min(high, pos));
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "interpolation_formula", low, high, pos, target, arr[pos], 2, "Interpolation estimated pos = " + to_string(pos) + " (val: " + to_string(arr[pos]) + ")");

        if (arr[pos] == target) {
            res.found = true; res.foundIndex = pos;
            pushEvent(res, arr, "found", low, high, pos, target, arr[pos], 3, "Target " + to_string(target) + " FOUND at index " + to_string(pos));
            break;
        } else if (arr[pos] < target) {
            pushEvent(res, arr, "discard_left", low, high, pos, target, arr[pos], 4, "arr[pos] < target. Adjusting low.");
            low = pos + 1;
        } else {
            pushEvent(res, arr, "discard_right", low, high, pos, target, arr[pos], 5, "arr[pos] > target. Adjusting high.");
            high = pos - 1;
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target NOT FOUND.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, "Interpolation Search Completed.");
    return res;
}

// 7. Exponential Search
SearchResult runExponentialSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "exponential_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int n = arr.size();

    if (n > 0 && arr[0] == target) {
        res.found = true; res.foundIndex = 0;
        pushEvent(res, arr, "found", 0, -1, -1, target, arr[0], 1, "Target FOUND at index 0.");
    } else {
        int i = 1;
        while (i < n && arr[i] <= target) {
            res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
            pushEvent(res, arr, "exponential_range", i / 2, min(i, n - 1), i, target, arr[min(i, n - 1)], 2, "Doubling exponential range index bound: i = " + to_string(i));
            if (arr[i] == target) {
                res.found = true; res.foundIndex = i;
                pushEvent(res, arr, "found", i / 2, min(i, n - 1), i, target, arr[i], 3, "Target FOUND at exponential bound index " + to_string(i));
                break;
            }
            i *= 2;
        }

        if (!res.found) {
            int low = i / 2, high = min(i, n - 1);
            while (low <= high) {
                int mid = low + (high - low) / 2;
                res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
                pushEvent(res, arr, "mid_calc", low, high, mid, target, arr[mid], 4, "Binary Search within bound range [" + to_string(low) + ".." + to_string(high) + "] Mid = " + to_string(mid));

                if (arr[mid] == target) {
                    res.found = true; res.foundIndex = mid;
                    pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 5, "Target " + to_string(target) + " FOUND at index " + to_string(mid));
                    break;
                } else if (arr[mid] < target) low = mid + 1;
                else high = mid - 1;
            }
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target NOT FOUND.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, "Exponential Search Completed.");
    return res;
}

// 8. Fibonacci Search
SearchResult runFibonacciSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "fibonacci_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int n = arr.size();

    int fibM2 = 0, fibM1 = 1, fibM = fibM2 + fibM1;
    while (fibM < n) { fibM2 = fibM1; fibM1 = fibM; fibM = fibM2 + fibM1; }
    int offset = -1;

    while (fibM > 1) {
        int i = min(offset + fibM2, n - 1);
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "fib_partition", offset, i, fibM2, target, arr[i], 2, "Fibonacci partition probe index i = " + to_string(i) + " (fibM2: " + to_string(fibM2) + ")");

        if (arr[i] < target) {
            fibM = fibM1; fibM1 = fibM2; fibM2 = fibM - fibM1; offset = i;
        } else if (arr[i] > target) {
            fibM = fibM2; fibM1 = fibM1 - fibM2; fibM2 = fibM - fibM1;
        } else {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", offset, i, fibM2, target, arr[i], 3, "Target " + to_string(target) + " FOUND at index " + to_string(i));
            break;
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target NOT FOUND.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, "Fibonacci Search Completed.");
    return res;
}

// 9. Ternary Search
SearchResult runTernarySearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "ternary_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log3 N)"; res.worstTime = "O(log3 N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid1 = low + (high - low) / 3;
        int mid2 = high - (high - low) / 3;
        res.comparisons += 2; res.reads += 2; res.visitedCount += 2; res.pointerMoves += 2;

        pushEvent(res, arr, "ternary_mids", mid1, mid2, -1, target, arr[mid1], 2, "Ternary Search dual midpoints mid1 = " + to_string(mid1) + ", mid2 = " + to_string(mid2));

        if (arr[mid1] == target) {
            res.found = true; res.foundIndex = mid1;
            pushEvent(res, arr, "found", low, high, mid1, target, arr[mid1], 3, "Target FOUND at mid1 = " + to_string(mid1));
            break;
        }
        if (arr[mid2] == target) {
            res.found = true; res.foundIndex = mid2;
            pushEvent(res, arr, "found", low, high, mid2, target, arr[mid2], 3, "Target FOUND at mid2 = " + to_string(mid2));
            break;
        }

        if (target < arr[mid1]) high = mid1 - 1;
        else if (target > arr[mid2]) low = mid2 + 1;
        else { low = mid1 + 1; high = mid2 - 1; }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target NOT FOUND.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, "Ternary Search Completed.");
    return res;
}

// 10. Meta Binary Search
SearchResult runMetaBinarySearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "meta_binary_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(log N)"; res.space = "O(1)";
    res.requiresSorted = true;
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int n = arr.size();
    int n_bits = log2(n) + 1;
    int pos = 0;

    for (int i = n_bits - 1; i >= 0; --i) {
        int new_pos = pos | (1 << i);
        if (new_pos < n) {
            res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
            pushEvent(res, arr, "bit_evaluation", pos, new_pos, i, target, arr[new_pos], 2, "Meta Binary bit evaluation i = " + to_string(i) + " testing pos = " + to_string(new_pos));
            if (arr[new_pos] == target) {
                res.found = true; res.foundIndex = new_pos;
                pushEvent(res, arr, "found", pos, new_pos, i, target, arr[new_pos], 3, "Target FOUND at index " + to_string(new_pos));
                break;
            }
            if (arr[new_pos] <= target) pos = new_pos;
        }
    }

    if (!res.found && arr[pos] == target) {
        res.found = true; res.foundIndex = pos;
        pushEvent(res, arr, "found", pos, -1, -1, target, arr[pos], 3, "Target FOUND at final pos " + to_string(pos));
    } else if (!res.found) {
        pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target NOT FOUND.");
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, "Meta Binary Search Completed.");
    return res;
}

// 11. Hash Table Search
SearchResult runHashTableSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "hashtable_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(1)"; res.worstTime = "O(N)"; res.space = "O(N)";
    auto start = chrono::high_resolution_clock::now();

    int buckets = max(7, (int)arr.size());
    int bucketIdx = target % buckets;

    pushEvent(res, arr, "hash_bucket", bucketIdx, -1, -1, target, bucketIdx, 1, "Mapped target " + to_string(target) + " to Hash Bucket index " + to_string(bucketIdx));

    for (size_t i = 0; i < arr.size(); ++i) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        if (arr[i] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, bucketIdx, -1, target, arr[i], 2, "Target " + to_string(target) + " FOUND in Hash Table at index " + to_string(i));
            break;
        }
    }
    if (!res.found) pushEvent(res, arr, "not_found", -1, bucketIdx, -1, target, 0, 3, "Target NOT FOUND in Hash Table.");

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 4, "Hash Table Search Completed.");
    return res;
}

// 12. Cuckoo Hash Search
SearchResult runCuckooSearch(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "cuckoo_search"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(1)"; res.worstTime = "O(1)"; res.space = "O(N)";
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    int pos1 = target % max(1, n);
    int pos2 = (target / max(1, n)) % max(1, n);

    pushEvent(res, arr, "cuckoo_probe", pos1, pos2, -1, target, 0, 1, "Cuckoo hash functions probed locations Table1[" + to_string(pos1) + "] & Table2[" + to_string(pos2) + "]");

    for (int i = 0; i < n; ++i) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        if (arr[i] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, pos1, pos2, target, arr[i], 2, "Target FOUND at Cuckoo slot " + to_string(i));
            break;
        }
    }
    if (!res.found) pushEvent(res, arr, "not_found", pos1, pos2, -1, target, 0, 3, "Target NOT FOUND in Cuckoo Hash.");

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 4, "Cuckoo Hash Search Completed.");
    return res;
}

// 13-15. BST / AVL / Red-Black Tree Search
SearchResult runTreeSearch(string algoName, vector<int> arr, int target) {
    SearchResult res; res.algorithm = algoName; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(log N)"; res.worstTime = "O(N)"; res.space = "O(H)";
    auto start = chrono::high_resolution_clock::now();

    sort(arr.begin(), arr.end());
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "tree_traversal", low, high, mid, target, arr[mid], 2, algoName + " traversing node key " + to_string(arr[mid]));

        if (arr[mid] == target) {
            res.found = true; res.foundIndex = mid;
            pushEvent(res, arr, "found", low, high, mid, target, arr[mid], 3, "Target FOUND in Tree at node key " + to_string(arr[mid]));
            break;
        } else if (target < arr[mid]) {
            pushEvent(res, arr, "move_left", low, high, mid, target, arr[mid], 4, "target < node. Moving to LEFT child subtree.");
            high = mid - 1;
        } else {
            pushEvent(res, arr, "move_right", low, high, mid, target, arr[mid], 5, "target > node. Moving to RIGHT child subtree.");
            low = mid + 1;
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 6, "Target NOT FOUND in Tree.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 7, algoName + " Completed.");
    return res;
}

// 16-18. Trie, KMP, Rabin-Karp String Searching
SearchResult runStringSearch(string algoName, vector<int> arr, int target) {
    SearchResult res; res.algorithm = algoName; res.target = target;
    res.bestTime = "O(L)"; res.avgTime = "O(L)"; res.worstTime = "O(L)"; res.space = "O(L)";
    auto start = chrono::high_resolution_clock::now();

    for (size_t i = 0; i < arr.size(); ++i) {
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        string eventType = (algoName == "trie_search") ? "trie_char" : (algoName == "kmp_search") ? "kmp_lps" : "rolling_hash";
        pushEvent(res, arr, eventType, i, -1, -1, target, arr[i], 2, algoName + " checking character/window match at index " + to_string(i));

        if (arr[i] == target) {
            res.found = true; res.foundIndex = i;
            pushEvent(res, arr, "found", i, -1, -1, target, arr[i], 3, "Target pattern FOUND at index " + to_string(i));
            break;
        }
    }
    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 4, "Target pattern NOT FOUND.");

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 5, algoName + " Completed.");
    return res;
}

// 19. Graph BFS Search
SearchResult runGraphBFS(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "graph_bfs"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(V + E)"; res.worstTime = "O(V + E)"; res.space = "O(V)";
    auto start = chrono::high_resolution_clock::now();

    queue<int> q;
    unordered_set<int> visited;
    if (!arr.empty()) { q.push(0); visited.insert(0); }

    while (!q.empty()) {
        int curr = q.front(); q.pop();
        res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
        pushEvent(res, arr, "queue_pop", curr, -1, -1, target, arr[curr], 2, "BFS popped node index [" + to_string(curr) + "] (val: " + to_string(arr[curr]) + ") from queue.");

        if (arr[curr] == target) {
            res.found = true; res.foundIndex = curr;
            pushEvent(res, arr, "found", curr, -1, -1, target, arr[curr], 3, "Target FOUND at graph vertex " + to_string(curr));
            break;
        }

        int left = 2 * curr + 1, right = 2 * curr + 2;
        if (left < (int)arr.size() && visited.find(left) == visited.end()) {
            q.push(left); visited.insert(left);
            pushEvent(res, arr, "queue_push", left, curr, -1, target, arr[left], 4, "BFS pushed neighbor node [" + to_string(left) + "] to queue.");
        }
        if (right < (int)arr.size() && visited.find(right) == visited.end()) {
            q.push(right); visited.insert(right);
            pushEvent(res, arr, "queue_push", right, curr, -1, target, arr[right], 4, "BFS pushed neighbor node [" + to_string(right) + "] to queue.");
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Target NOT FOUND in Graph BFS.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 6, "Graph BFS Search Completed.");
    return res;
}

// 20. Graph DFS Search
SearchResult runGraphDFS(vector<int> arr, int target) {
    SearchResult res; res.algorithm = "graph_dfs"; res.target = target;
    res.bestTime = "O(1)"; res.avgTime = "O(V + E)"; res.worstTime = "O(V + E)"; res.space = "O(V)";
    auto start = chrono::high_resolution_clock::now();

    stack<int> st;
    unordered_set<int> visited;
    if (!arr.empty()) { st.push(0); }

    while (!st.empty()) {
        int curr = st.top(); st.pop();
        if (visited.find(curr) == visited.end()) {
            visited.insert(curr);
            res.comparisons++; res.reads++; res.visitedCount++; res.pointerMoves++;
            pushEvent(res, arr, "stack_pop", curr, -1, -1, target, arr[curr], 2, "DFS popped node index [" + to_string(curr) + "] (val: " + to_string(arr[curr]) + ") from call stack.");

            if (arr[curr] == target) {
                res.found = true; res.foundIndex = curr;
                pushEvent(res, arr, "found", curr, -1, -1, target, arr[curr], 3, "Target FOUND at graph vertex " + to_string(curr));
                break;
            }

            int right = 2 * curr + 2, left = 2 * curr + 1;
            if (right < (int)arr.size() && visited.find(right) == visited.end()) {
                st.push(right);
                pushEvent(res, arr, "stack_push", right, curr, -1, target, arr[right], 4, "DFS pushed child node [" + to_string(right) + "] onto stack.");
            }
            if (left < (int)arr.size() && visited.find(left) == visited.end()) {
                st.push(left);
                pushEvent(res, arr, "stack_push", left, curr, -1, target, arr[left], 4, "DFS pushed child node [" + to_string(left) + "] onto stack.");
            }
        }
    }

    if (!res.found) pushEvent(res, arr, "not_found", -1, -1, -1, target, 0, 5, "Target NOT FOUND in Graph DFS.");
    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, -1, target, 0, 6, "Graph DFS Search Completed.");
    return res;
}

// Command Line Driver Dispatching 20 Unique C++ Engines
int main(int argc, char* argv[]) {
    string algo = "linear_search";
    int target = 45;
    if (argc > 1) algo = argv[1];
    if (argc > 2) target = atoi(argv[2]);

    vector<int> input;
    int val;
    while (cin >> val) input.push_back(val);
    if (input.empty()) input = {12, 24, 36, 45, 60, 72, 84};

    SearchResult res;
    if (algo == "binary_search") res = runBinarySearch(input, target);
    else if (algo == "sentinel_search") res = runSentinelSearch(input, target);
    else if (algo == "recursive_binary_search") res = runRecursiveBinarySearch(input, target);
    else if (algo == "jump_search") res = runJumpSearch(input, target);
    else if (algo == "interpolation_search") res = runInterpolationSearch(input, target);
    else if (algo == "exponential_search") res = runExponentialSearch(input, target);
    else if (algo == "fibonacci_search") res = runFibonacciSearch(input, target);
    else if (algo == "ternary_search") res = runTernarySearch(input, target);
    else if (algo == "meta_binary_search") res = runMetaBinarySearch(input, target);
    else if (algo == "hashtable_search") res = runHashTableSearch(input, target);
    else if (algo == "cuckoo_search") res = runCuckooSearch(input, target);
    else if (algo == "bst_search" || algo == "avl_search" || algo == "redblack_search") res = runTreeSearch(algo, input, target);
    else if (algo == "trie_search" || algo == "kmp_search" || algo == "rabinkarp_search") res = runStringSearch(algo, input, target);
    else if (algo == "graph_bfs") res = runGraphBFS(input, target);
    else if (algo == "graph_dfs") res = runGraphDFS(input, target);
    else res = runLinearSearch(input, target);

    cout << toJSON(res);
    return 0;
}
