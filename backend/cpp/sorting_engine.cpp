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

// Event Structure for standardized JSON output
struct Event {
    string type;
    int i = -1;
    int j = -1;
    int value = 0;
    int line = 0;
    string desc;
    vector<int> currentArray;
};

// Result Structure
struct SortResult {
    string algorithm;
    vector<Event> events;
    int comparisons = 0;
    int swaps = 0;
    int writes = 0;
    int reads = 0;
    int recursiveCalls = 0;
    double runtimeMs = 0.0;
    string bestTime;
    string avgTime;
    string worstTime;
    string space;
    bool stable = false;
    bool inPlace = false;
    bool adaptive = false;
};

// JSON Serializer
string toJSON(const SortResult& res) {
    stringstream ss;
    ss << "{\n";
    ss << "  \"success\": true,\n";
    ss << "  \"algorithm\": \"" << res.algorithm << "\",\n";
    ss << "  \"statistics\": {\n";
    ss << "    \"comparisons\": " << res.comparisons << ",\n";
    ss << "    \"swaps\": " << res.swaps << ",\n";
    ss << "    \"writes\": " << res.writes << ",\n";
    ss << "    \"reads\": " << res.reads << ",\n";
    ss << "    \"recursiveCalls\": " << res.recursiveCalls << ",\n";
    ss << "    \"runtimeMs\": " << res.runtimeMs << ",\n";
    ss << "    \"sortedPercent\": 100\n";
    ss << "  },\n";
    ss << "  \"complexity\": {\n";
    ss << "    \"bestTime\": \"" << res.bestTime << "\",\n";
    ss << "    \"avgTime\": \"" << res.avgTime << "\",\n";
    ss << "    \"worstTime\": \"" << res.worstTime << "\",\n";
    ss << "    \"space\": \"" << res.space << "\",\n";
    ss << "    \"stable\": " << (res.stable ? "true" : "false") << ",\n";
    ss << "    \"inPlace\": " << (res.inPlace ? "true" : "false") << ",\n";
    ss << "    \"adaptive\": " << (res.adaptive ? "true" : "false") << "\n";
    ss << "  },\n";
    ss << "  \"events\": [\n";

    for (size_t k = 0; k < res.events.size(); ++k) {
        const auto& ev = res.events[k];
        ss << "    {\n";
        ss << "      \"type\": \"" << ev.type << "\",\n";
        ss << "      \"i\": " << ev.i << ",\n";
        ss << "      \"j\": " << ev.j << ",\n";
        ss << "      \"value\": " << ev.value << ",\n";
        ss << "      \"line\": " << ev.line << ",\n";
        ss << "      \"desc\": \"" << ev.desc << "\",\n";
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

// Helper to push event
void pushEvent(SortResult& res, const vector<int>& arr, string type, int i, int j, int val, int line, string desc) {
    res.events.push_back({type, i, j, val, line, desc, arr});
}

// 1. Bubble Sort
SortResult runBubbleSort(vector<int> arr) {
    SortResult res; res.algorithm = "bubble_sort";
    res.bestTime = "O(N)"; res.avgTime = "O(N^2)"; res.worstTime = "O(N^2)";
    res.space = "O(1)"; res.stable = true; res.inPlace = true; res.adaptive = true;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            res.comparisons++; res.reads += 2;
            pushEvent(res, arr, "compare", j, j + 1, 0, 2, "Comparing arr[" + to_string(j) + "] and arr[" + to_string(j+1) + "]");
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]); res.swaps++; res.writes += 2; swapped = true;
                pushEvent(res, arr, "swap", j, j + 1, 0, 3, "Swapped arr[" + to_string(j) + "] and arr[" + to_string(j+1) + "]");
            }
        }
        if (!swapped) break;
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 4, "Bubble Sort Completed");
    return res;
}

// 2. Selection Sort
SortResult runSelectionSort(vector<int> arr) {
    SortResult res; res.algorithm = "selection_sort";
    res.bestTime = "O(N^2)"; res.avgTime = "O(N^2)"; res.worstTime = "O(N^2)";
    res.space = "O(1)"; res.stable = false; res.inPlace = true; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        pushEvent(res, arr, "highlight", i, -1, 0, 1, "New min candidate at index " + to_string(i));
        for (int j = i + 1; j < n; ++j) {
            res.comparisons++; res.reads += 2;
            pushEvent(res, arr, "compare", j, minIdx, 0, 2, "Comparing arr[" + to_string(j) + "] with min arr[" + to_string(minIdx) + "]");
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]); res.swaps++; res.writes += 2;
            pushEvent(res, arr, "swap", i, minIdx, 0, 4, "Swapped min element to index " + to_string(i));
        }
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Selection Sort Completed");
    return res;
}

// 3. Insertion Sort
SortResult runInsertionSort(vector<int> arr) {
    SortResult res; res.algorithm = "insertion_sort";
    res.bestTime = "O(N)"; res.avgTime = "O(N^2)"; res.worstTime = "O(N^2)";
    res.space = "O(1)"; res.stable = true; res.inPlace = true; res.adaptive = true;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i]; res.reads++;
        int j = i - 1;
        pushEvent(res, arr, "highlight", i, -1, key, 1, "Picked key element " + to_string(key) + " at index " + to_string(i));
        while (j >= 0 && arr[j] > key) {
            res.comparisons++; res.reads++;
            arr[j + 1] = arr[j]; res.writes++;
            pushEvent(res, arr, "overwrite", j + 1, j, arr[j], 3, "Shifted arr[" + to_string(j) + "] right to index " + to_string(j+1));
            j--;
        }
        arr[j + 1] = key; res.writes++;
        pushEvent(res, arr, "overwrite", j + 1, -1, key, 4, "Inserted key " + to_string(key) + " at index " + to_string(j+1));
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Insertion Sort Completed");
    return res;
}

// 4. Merge Sort
void mergeSortRec(vector<int>& arr, int l, int r, SortResult& res) {
    res.recursiveCalls++;
    if (l >= r) return;
    int m = l + (r - l) / 2;
    pushEvent(res, arr, "split", l, r, m, 1, "Splitting range [" + to_string(l) + ".." + to_string(r) + "] at midpoint " + to_string(m));

    mergeSortRec(arr, l, m, res);
    mergeSortRec(arr, m + 1, r, res);

    vector<int> leftArr(arr.begin() + l, arr.begin() + m + 1);
    vector<int> rightArr(arr.begin() + m + 1, arr.begin() + r + 1);
    size_t i = 0, j = 0; int k = l;

    while (i < leftArr.size() && j < rightArr.size()) {
        res.comparisons++; res.reads += 2;
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i]; res.writes++;
            pushEvent(res, arr, "merge", k, -1, leftArr[i], 3, "Merged left element " + to_string(leftArr[i]) + " into index [" + to_string(k) + "]");
            i++;
        } else {
            arr[k] = rightArr[j]; res.writes++;
            pushEvent(res, arr, "merge", k, -1, rightArr[j], 3, "Merged right element " + to_string(rightArr[j]) + " into index [" + to_string(k) + "]");
            j++;
        }
        k++;
    }
    while (i < leftArr.size()) {
        arr[k] = leftArr[i]; res.writes++;
        pushEvent(res, arr, "merge", k, -1, leftArr[i], 4, "Merged remaining left element " + to_string(leftArr[i]));
        i++; k++;
    }
    while (j < rightArr.size()) {
        arr[k] = rightArr[j]; res.writes++;
        pushEvent(res, arr, "merge", k, -1, rightArr[j], 4, "Merged remaining right element " + to_string(rightArr[j]));
        j++; k++;
    }
}

SortResult runMergeSort(vector<int> arr) {
    SortResult res; res.algorithm = "merge_sort";
    res.bestTime = "O(N log N)"; res.avgTime = "O(N log N)"; res.worstTime = "O(N log N)";
    res.space = "O(N)"; res.stable = true; res.inPlace = false; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    mergeSortRec(arr, 0, arr.size() - 1, res);

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Merge Sort Completed");
    return res;
}

// 5. Quick Sort
int partitionQuick(vector<int>& arr, int low, int high, string strategy, SortResult& res) {
    int pivotIdx = high;
    if (strategy == "first") pivotIdx = low;
    else if (strategy == "middle") pivotIdx = low + (high - low) / 2;
    else if (strategy == "random") pivotIdx = low + rand() % (high - low + 1);

    if (pivotIdx != high) {
        swap(arr[pivotIdx], arr[high]); res.swaps++;
    }

    int pivot = arr[high];
    pushEvent(res, arr, "pivot_select", high, -1, pivot, 1, "Selected pivot " + to_string(pivot) + " at index " + to_string(high));

    int i = low - 1;
    for (int j = low; j < high; ++j) {
        res.comparisons++;
        pushEvent(res, arr, "compare", j, high, 0, 2, "Comparing arr[" + to_string(j) + "] with pivot " + to_string(pivot));
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]); res.swaps++;
            pushEvent(res, arr, "swap", i, j, 0, 3, "Swapped element " + to_string(arr[i]) + " to partition index " + to_string(i));
        }
    }
    swap(arr[i + 1], arr[high]); res.swaps++;
    pushEvent(res, arr, "partition", i + 1, high, 0, 4, "Placed pivot at final sorted partition index " + to_string(i + 1));
    return i + 1;
}

void quickSortRec(vector<int>& arr, int low, int high, string strategy, SortResult& res) {
    res.recursiveCalls++;
    if (low < high) {
        int pi = partitionQuick(arr, low, high, strategy, res);
        quickSortRec(arr, low, pi - 1, strategy, res);
        quickSortRec(arr, pi + 1, high, strategy, res);
    }
}

SortResult runQuickSort(vector<int> arr, string strategy = "last") {
    SortResult res; res.algorithm = "quick_sort";
    res.bestTime = "O(N log N)"; res.avgTime = "O(N log N)"; res.worstTime = "O(N^2)";
    res.space = "O(log N)"; res.stable = false; res.inPlace = true; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    quickSortRec(arr, 0, arr.size() - 1, strategy, res);

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Quick Sort Completed");
    return res;
}

// 6. Heap Sort
void heapify(vector<int>& arr, int n, int i, SortResult& res) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n) {
        res.comparisons++;
        if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
        res.comparisons++;
        if (arr[r] > arr[largest]) largest = r;
    }

    if (largest != i) {
        swap(arr[i], arr[largest]); res.swaps++;
        pushEvent(res, arr, "heap_swap", i, largest, arr[i], 3, "Sifted down node arr[" + to_string(i) + "] with child arr[" + to_string(largest) + "]");
        heapify(arr, n, largest, res);
    }
}

SortResult runHeapSort(vector<int> arr) {
    SortResult res; res.algorithm = "heap_sort";
    res.bestTime = "O(N log N)"; res.avgTime = "O(N log N)"; res.worstTime = "O(N log N)";
    res.space = "O(1)"; res.stable = false; res.inPlace = true; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i, res);

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); res.swaps++;
        pushEvent(res, arr, "heap_swap", 0, i, arr[0], 4, "Extracted Max Heap root arr[0] to position [" + to_string(i) + "]");
        heapify(arr, i, 0, res);
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Heap Sort Completed");
    return res;
}

// 7. Shell Sort
SortResult runShellSort(vector<int> arr) {
    SortResult res; res.algorithm = "shell_sort";
    res.bestTime = "O(N log N)"; res.avgTime = "O(N^(4/3))"; res.worstTime = "O(N^2)";
    res.space = "O(1)"; res.stable = false; res.inPlace = true; res.adaptive = true;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i += 1) {
            int temp = arr[i]; res.reads++;
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                res.comparisons++;
                arr[j] = arr[j - gap]; res.writes++;
                pushEvent(res, arr, "swap", j, j - gap, temp, 3, "Gapped insertion shift with gap=" + to_string(gap));
            }
            arr[j] = temp; res.writes++;
        }
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 5, "Shell Sort Completed");
    return res;
}

// 8. Counting Sort
SortResult runCountingSort(vector<int> arr) {
    SortResult res; res.algorithm = "counting_sort";
    res.bestTime = "O(N+K)"; res.avgTime = "O(N+K)"; res.worstTime = "O(N+K)";
    res.space = "O(K)"; res.stable = true; res.inPlace = false; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    if (!arr.empty()) {
        int maxVal = *max_element(arr.begin(), arr.end());
        int minVal = *min_element(arr.begin(), arr.end());
        int range = maxVal - minVal + 1;

        vector<int> count(range, 0);
        for (size_t i = 0; i < arr.size(); i++) {
            count[arr[i] - minVal]++;
            pushEvent(res, arr, "compare", i, -1, arr[i], 2, "Counted frequency of key " + to_string(arr[i]));
        }

        int idx = 0;
        for (int i = 0; i < range; i++) {
            while (count[i] > 0) {
                arr[idx] = i + minVal; res.writes++;
                pushEvent(res, arr, "overwrite", idx, -1, arr[idx], 3, "Placed key " + to_string(arr[idx]) + " from frequency count");
                idx++;
                count[i]--;
            }
        }
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 4, "Counting Sort Completed");
    return res;
}

// 9. Radix Sort
SortResult runRadixSort(vector<int> arr) {
    SortResult res; res.algorithm = "radix_sort";
    res.bestTime = "O(N*K)"; res.avgTime = "O(N*K)"; res.worstTime = "O(N*K)";
    res.space = "O(N+K)"; res.stable = true; res.inPlace = false; res.adaptive = false;
    auto start = chrono::high_resolution_clock::now();

    if (!arr.empty()) {
        int maxVal = *max_element(arr.begin(), arr.end());
        for (int exp = 1; maxVal / exp > 0; exp *= 10) {
            vector<int> output(arr.size());
            int count[10] = {0};

            for (size_t i = 0; i < arr.size(); i++) {
                count[(arr[i] / exp) % 10]++;
                pushEvent(res, arr, "compare", i, -1, arr[i], 2, "Digit bucket lookup for " + to_string(arr[i]) + " at exp=" + to_string(exp));
            }

            for (int i = 1; i < 10; i++) count[i] += count[i - 1];

            for (int i = arr.size() - 1; i >= 0; i--) {
                output[count[(arr[i] / exp) % 10] - 1] = arr[i];
                count[(arr[i] / exp) % 10]--;
            }

            for (size_t i = 0; i < arr.size(); i++) {
                arr[i] = output[i]; res.writes++;
                pushEvent(res, arr, "overwrite", i, -1, arr[i], 3, "Sorted by digit exp=" + to_string(exp));
            }
        }
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 4, "Radix Sort Completed");
    return res;
}

// 10. Bucket Sort
SortResult runBucketSort(vector<int> arr) {
    SortResult res; res.algorithm = "bucket_sort";
    res.bestTime = "O(N+K)"; res.avgTime = "O(N+K)"; res.worstTime = "O(N^2)";
    res.space = "O(N)"; res.stable = true; res.inPlace = false; res.adaptive = true;
    auto start = chrono::high_resolution_clock::now();

    int n = arr.size();
    if (n > 0) {
        int maxVal = *max_element(arr.begin(), arr.end());
        int minVal = *min_element(arr.begin(), arr.end());
        int bucketCount = 5;
        vector<vector<int>> buckets(bucketCount);

        for (int i = 0; i < n; i++) {
            int bIdx = min(bucketCount - 1, (arr[i] - minVal) * bucketCount / (maxVal - minVal + 1));
            buckets[bIdx].push_back(arr[i]);
            pushEvent(res, arr, "compare", i, bIdx, arr[i], 2, "Scattered " + to_string(arr[i]) + " into bucket [" + to_string(bIdx) + "]");
        }

        int idx = 0;
        for (int i = 0; i < bucketCount; i++) {
            sort(buckets[i].begin(), buckets[i].end());
            for (int val : buckets[i]) {
                arr[idx] = val; res.writes++;
                pushEvent(res, arr, "overwrite", idx, i, val, 3, "Gathered " + to_string(val) + " from bucket [" + to_string(i) + "]");
                idx++;
            }
        }
    }

    res.runtimeMs = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start).count();
    pushEvent(res, arr, "finished", -1, -1, 0, 4, "Bucket Sort Completed");
    return res;
}

// Main Driver
int main(int argc, char* argv[]) {
    string algo = "bubble_sort";
    string strat = "last";
    if (argc > 1) algo = argv[1];
    if (argc > 2) strat = argv[2];

    vector<int> input;
    int val;
    while (cin >> val) input.push_back(val);
    if (input.empty()) input = {45, 23, 89, 12, 67, 34, 90, 15};

    SortResult res;
    if (algo == "selection_sort") res = runSelectionSort(input);
    else if (algo == "insertion_sort") res = runInsertionSort(input);
    else if (algo == "merge_sort") res = runMergeSort(input);
    else if (algo == "quick_sort") res = runQuickSort(input, strat);
    else if (algo == "heap_sort") res = runHeapSort(input);
    else if (algo == "shell_sort") res = runShellSort(input);
    else if (algo == "counting_sort") res = runCountingSort(input);
    else if (algo == "radix_sort") res = runRadixSort(input);
    else if (algo == "bucket_sort") res = runBucketSort(input);
    else res = runBubbleSort(input);

    cout << toJSON(res);
    return 0;
}
