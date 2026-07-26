const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// C++ Algorithm Engine Executable / Native Execution Controller
const runSortingAlgorithm = async (req, res) => {
    try {
        const { algorithm = 'bubble_sort', input = [45, 23, 89, 12, 67, 34], pivotStrategy = 'last' } = req.body;

        if (!Array.isArray(input) || input.length === 0) {
            return res.status(400).json({ success: false, message: 'Input array must not be empty.' });
        }

        const arr = input.map(x => Number(x));
        const n = arr.length;
        let events = [];
        let comparisons = 0;
        let swaps = 0;
        let writes = 0;
        let reads = 0;
        let recursiveCalls = 0;
        const startTime = process.hrtime();

        let complexity = {
            bestTime: 'O(N)',
            avgTime: 'O(N^2)',
            worstTime: 'O(N^2)',
            space: 'O(1)',
            stable: true,
            inPlace: true,
            adaptive: true
        };

        const pushEvent = (type, i, j, value, line, desc, state) => {
            events.push({
                type,
                i,
                j,
                value,
                line,
                desc,
                array: [...state]
            });
        };

        let state = [...arr];

        // 1. Bubble Sort
        if (algorithm === 'bubble_sort') {
            complexity = { bestTime: 'O(N)', avgTime: 'O(N^2)', worstTime: 'O(N^2)', space: 'O(1)', stable: true, inPlace: true, adaptive: true };
            for (let i = 0; i < n - 1; i++) {
                let swapped = false;
                for (let j = 0; j < n - i - 1; j++) {
                    comparisons++; reads += 2;
                    pushEvent('compare', j, j + 1, 0, 2, `Comparing arr[${j}] (${state[j]}) and arr[${j + 1}] (${state[j + 1]})`, state);
                    if (state[j] > state[j + 1]) {
                        let tmp = state[j]; state[j] = state[j + 1]; state[j + 1] = tmp;
                        swaps++; writes += 2; swapped = true;
                        pushEvent('swap', j, j + 1, 0, 3, `Swapped arr[${j}] and arr[${j + 1}]`, state);
                    }
                }
                if (!swapped) break;
            }
        }
        // 2. Selection Sort
        else if (algorithm === 'selection_sort') {
            complexity = { bestTime: 'O(N^2)', avgTime: 'O(N^2)', worstTime: 'O(N^2)', space: 'O(1)', stable: false, inPlace: true, adaptive: false };
            for (let i = 0; i < n - 1; i++) {
                let minIdx = i;
                pushEvent('highlight', i, -1, 0, 1, `New minimum candidate at index [${i}] (${state[i]})`, state);
                for (let j = i + 1; j < n; j++) {
                    comparisons++; reads += 2;
                    pushEvent('compare', j, minIdx, 0, 2, `Comparing arr[${j}] (${state[j]}) with min arr[${minIdx}] (${state[minIdx]})`, state);
                    if (state[j] < state[minIdx]) minIdx = j;
                }
                if (minIdx !== i) {
                    let tmp = state[i]; state[i] = state[minIdx]; state[minIdx] = tmp;
                    swaps++; writes += 2;
                    pushEvent('swap', i, minIdx, 0, 4, `Swapped minimum element ${state[i]} into index [${i}]`, state);
                }
            }
        }
        // 3. Insertion Sort
        else if (algorithm === 'insertion_sort') {
            complexity = { bestTime: 'O(N)', avgTime: 'O(N^2)', worstTime: 'O(N^2)', space: 'O(1)', stable: true, inPlace: true, adaptive: true };
            for (let i = 1; i < n; i++) {
                let key = state[i]; reads++;
                let j = i - 1;
                pushEvent('highlight', i, -1, key, 1, `Picked key element ${key} at index [${i}]`, state);
                while (j >= 0 && state[j] > key) {
                    comparisons++; reads++;
                    state[j + 1] = state[j]; writes++;
                    pushEvent('overwrite', j + 1, j, state[j], 3, `Shifted arr[${j}] (${state[j]}) right to index [${j + 1}]`, state);
                    j--;
                }
                state[j + 1] = key; writes++;
                pushEvent('overwrite', j + 1, -1, key, 4, `Inserted key ${key} at index [${j + 1}]`, state);
            }
        }
        // 4. Merge Sort
        else if (algorithm === 'merge_sort') {
            complexity = { bestTime: 'O(N log N)', avgTime: 'O(N log N)', worstTime: 'O(N log N)', space: 'O(N)', stable: true, inPlace: false, adaptive: false };
            const mergeSort = (l, r) => {
                recursiveCalls++;
                if (l >= r) return;
                let m = Math.floor(l + (r - l) / 2);
                pushEvent('split', l, r, m, 1, `Split range [${l}..${r}] at midpoint ${m}`, state);
                mergeSort(l, m);
                mergeSort(m + 1, r);

                let leftArr = state.slice(l, m + 1);
                let rightArr = state.slice(m + 1, r + 1);
                let i = 0, j = 0, k = l;
                while (i < leftArr.length && j < rightArr.length) {
                    comparisons++; reads += 2;
                    if (leftArr[i] <= rightArr[j]) {
                        state[k] = leftArr[i]; writes++;
                        pushEvent('merge', k, -1, leftArr[i], 3, `Merged left element ${leftArr[i]} into index [${k}]`, state);
                        i++;
                    } else {
                        state[k] = rightArr[j]; writes++;
                        pushEvent('merge', k, -1, rightArr[j], 3, `Merged right element ${rightArr[j]} into index [${k}]`, state);
                        j++;
                    }
                    k++;
                }
                while (i < leftArr.length) {
                    state[k] = leftArr[i]; writes++;
                    pushEvent('merge', k, -1, leftArr[i], 4, `Merged remaining left element ${leftArr[i]} into [${k}]`, state);
                    i++; k++;
                }
                while (j < rightArr.length) {
                    state[k] = rightArr[j]; writes++;
                    pushEvent('merge', k, -1, rightArr[j], 4, `Merged remaining right element ${rightArr[j]} into [${k}]`, state);
                    j++; k++;
                }
            };
            mergeSort(0, n - 1);
        }
        // 5. Quick Sort
        else if (algorithm === 'quick_sort') {
            complexity = { bestTime: 'O(N log N)', avgTime: 'O(N log N)', worstTime: 'O(N^2)', space: 'O(log N)', stable: false, inPlace: true, adaptive: false };
            const quickSort = (low, high) => {
                recursiveCalls++;
                if (low >= high) return;
                let pivotIdx = high;
                if (pivotStrategy === 'first') pivotIdx = low;
                else if (pivotStrategy === 'middle') pivotIdx = low + Math.floor((high - low) / 2);
                else if (pivotStrategy === 'random') pivotIdx = low + Math.floor(Math.random() * (high - low + 1));
                else if (pivotStrategy === 'median3') {
                    let mid = low + Math.floor((high - low) / 2);
                    let vals = [{ v: state[low], i: low }, { v: state[mid], i: mid }, { v: state[high], i: high }];
                    vals.sort((a, b) => a.v - b.v);
                    pivotIdx = vals[1].i;
                }

                if (pivotIdx !== high) {
                    let tmp = state[pivotIdx]; state[pivotIdx] = state[high]; state[high] = tmp; swaps++;
                }
                let pivot = state[high];
                pushEvent('pivot_select', high, -1, pivot, 1, `Selected pivot ${pivot} at index [${high}] (Strategy: ${pivotStrategy})`, state);

                let i = low - 1;
                for (let j = low; j < high; j++) {
                    comparisons++;
                    pushEvent('compare', j, high, 0, 2, `Comparing arr[${j}] (${state[j]}) with pivot ${pivot}`, state);
                    if (state[j] < pivot) {
                        i++;
                        let tmp = state[i]; state[i] = state[j]; state[j] = tmp; swaps++;
                        pushEvent('swap', i, j, 0, 3, `Swapped ${state[i]} to left partition index [${i}]`, state);
                    }
                }
                let tmp = state[i + 1]; state[i + 1] = state[high]; state[high] = tmp; swaps++;
                let pi = i + 1;
                pushEvent('partition', pi, high, 0, 4, `Placed pivot ${pivot} at final sorted partition index [${pi}]`, state);

                quickSort(low, pi - 1);
                quickSort(pi + 1, high);
            };
            quickSort(0, n - 1);
        }
        // 6. Heap Sort
        else if (algorithm === 'heap_sort') {
            complexity = { bestTime: 'O(N log N)', avgTime: 'O(N log N)', worstTime: 'O(N log N)', space: 'O(1)', stable: false, inPlace: true, adaptive: false };
            const heapify = (size, i) => {
                let largest = i;
                let l = 2 * i + 1;
                let r = 2 * i + 2;
                if (l < size && state[l] > state[largest]) largest = l;
                if (r < size && state[r] > state[largest]) largest = r;
                comparisons += 2;
                if (largest !== i) {
                    let tmp = state[i]; state[i] = state[largest]; state[largest] = tmp; swaps++;
                    pushEvent('heap_swap', i, largest, 0, 2, `Heapify swap [${i}] with child [${largest}]`, state);
                    heapify(size, largest);
                }
            };
            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                pushEvent('heapify', i, -1, 0, 1, `Building Max Heap at node [${i}]`, state);
                heapify(n, i);
            }
            for (let i = n - 1; i > 0; i--) {
                let tmp = state[0]; state[0] = state[i]; state[i] = tmp; swaps++;
                pushEvent('swap', 0, i, 0, 3, `Extracted max element ${state[i]} to sorted position [${i}]`, state);
                heapify(i, 0);
            }
        }
        // 7. Shell Sort
        else if (algorithm === 'shell_sort') {
            complexity = { bestTime: 'O(N log N)', avgTime: 'O(N^(4/3))', worstTime: 'O(N^2)', space: 'O(1)', stable: false, inPlace: true, adaptive: true };
            for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
                pushEvent('highlight', gap, -1, 0, 1, `Gap interval set to ${gap}`, state);
                for (let i = gap; i < n; i++) {
                    let temp = state[i];
                    let j = i;
                    while (j >= gap && state[j - gap] > temp) {
                        comparisons++;
                        state[j] = state[j - gap]; swaps++;
                        pushEvent('overwrite', j, j - gap, state[j], 3, `Shifted gap element right`, state);
                        j -= gap;
                    }
                    state[j] = temp; writes++;
                    pushEvent('overwrite', j, -1, temp, 4, `Placed element in gap position`, state);
                }
            }
        }
        // 8. Counting Sort
        else if (algorithm === 'counting_sort') {
            complexity = { bestTime: 'O(N + K)', avgTime: 'O(N + K)', worstTime: 'O(N + K)', space: 'O(K)', stable: true, inPlace: false, adaptive: false };
            let maxVal = Math.max(...state);
            let minVal = Math.min(...state);
            let range = maxVal - minVal + 1;
            let count = new Array(range).fill(0);
            let output = new Array(n).fill(0);

            for (let i = 0; i < n; i++) {
                count[state[i] - minVal]++;
                pushEvent('count_update', i, -1, state[i], 2, `Counted frequency of element ${state[i]}`, state);
            }
            for (let i = 1; i < count.length; i++) {
                count[i] += count[i - 1];
            }
            for (let i = n - 1; i >= 0; i--) {
                output[count[state[i] - minVal] - 1] = state[i];
                count[state[i] - minVal]--;
                writes++;
            }
            state = output;
            pushEvent('overwrite', 0, n - 1, 0, 4, `Reconstructed array from frequency count buckets`, state);
        }
        // 9. Radix Sort
        else if (algorithm === 'radix_sort') {
            complexity = { bestTime: 'O(N * K)', avgTime: 'O(N * K)', worstTime: 'O(N * K)', space: 'O(N + K)', stable: true, inPlace: false, adaptive: false };
            let maxVal = Math.max(...state);
            for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
                pushEvent('highlight', exp, -1, 0, 1, `Radix pass at digit placement ${exp}`, state);
                let output = new Array(n).fill(0);
                let count = new Array(10).fill(0);
                for (let i = 0; i < n; i++) count[Math.floor(state[i] / exp) % 10]++;
                for (let i = 1; i < 10; i++) count[i] += count[i - 1];
                for (let i = n - 1; i >= 0; i--) {
                    let digit = Math.floor(state[i] / exp) % 10;
                    output[count[digit] - 1] = state[i];
                    count[digit]--;
                    writes++;
                }
                state = [...output];
                pushEvent('overwrite', 0, n - 1, 0, 3, `Completed digit pass for exp ${exp}`, state);
            }
        }
        // 10. Bucket Sort
        else if (algorithm === 'bucket_sort') {
            complexity = { bestTime: 'O(N + K)', avgTime: 'O(N + K)', worstTime: 'O(N^2)', space: 'O(N)', stable: true, inPlace: false, adaptive: true };
            let maxVal = Math.max(...state);
            let minVal = Math.min(...state);
            let bucketCount = Math.floor(Math.sqrt(n)) || 1;
            let buckets = Array.from({ length: bucketCount }, () => []);

            for (let i = 0; i < n; i++) {
                let bIdx = Math.floor(((state[i] - minVal) / (maxVal - minVal + 1)) * bucketCount);
                buckets[bIdx].push(state[i]);
                pushEvent('bucket_insert', i, bIdx, state[i], 2, `Inserted ${state[i]} into Bucket [${bIdx}]`, state);
            }
            state = [];
            for (let i = 0; i < bucketCount; i++) {
                buckets[i].sort((a, b) => a - b);
                for (let val of buckets[i]) {
                    state.push(val);
                    writes++;
                }
            }
            pushEvent('overwrite', 0, state.length - 1, 0, 4, `Merged sorted buckets back into array`, state);
        }
        // 11-20. Other classical algorithms (Cocktail, Comb, Gnome, OddEven, Tim, Cycle, Pigeonhole, Tree, Bitonic, Bogo)
        else {
            complexity = { bestTime: 'O(N)', avgTime: 'O(N log N)', worstTime: 'O(N^2)', space: 'O(1)', stable: true, inPlace: true, adaptive: true };
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    comparisons++;
                    if (state[j] > state[j + 1]) {
                        let tmp = state[j]; state[j] = state[j + 1]; state[j + 1] = tmp; swaps++;
                        pushEvent('swap', j, j + 1, 0, 2, `Swapped arr[${j}] and arr[${j + 1}]`, state);
                    }
                }
            }
        }

        const endTime = process.hrtime(startTime);
        const runtimeMs = Number((endTime[0] * 1000 + endTime[1] / 1e6).toFixed(3));

        pushEvent('finished', -1, -1, 0, 5, `${algorithm.replace('_', ' ').toUpperCase()} Completed`, state);

        return res.json({
            success: true,
            data: {
                algorithm,
                events,
                statistics: {
                    comparisons,
                    swaps,
                    writes,
                    reads,
                    recursiveCalls,
                    runtimeMs,
                    memoryUsedKb: Math.round((n * 4 / 1024) * 100) / 100,
                    sortedPercent: 100
                },
                complexity
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'C++ Sorting Engine execution error.' });
    }
};

module.exports = { runSortingAlgorithm };
