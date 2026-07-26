import React, { useState, useEffect } from 'react';
import { BarChart2, AlertCircle, RefreshCw } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MascotRole from '../../components/mascots/MascotRole';
import api from '../../api/axios';

import SortingConfigPanel from '../../components/sorting/SortingConfigPanel';
import SortingCanvas from '../../components/sorting/SortingCanvas';
import SortingPlaybackBar from '../../components/sorting/SortingPlaybackBar';
import SortingStatsPanel from '../../components/sorting/SortingStatsPanel';
import SortingConceptPanel from '../../components/sorting/SortingConceptPanel';
import SortingComparisonView from '../../components/sorting/SortingComparisonView';

const SORTING_SPECS = {
  bubble: {
    name: 'Bubble Sort',
    category: 'Elementary',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    adaptive: true,
    pseudocode: [
      'for i = 0 to n - 1:',
      '  for j = 0 to n - i - 2:',
      '    if array[j] > array[j+1]:',
      '      swap(array[j], array[j+1])'
    ],
    intuition: 'Repeatedly compares adjacent elements and swaps them if out of order, bubbling larger items to the top.',
    mistakes: 'Forgetting to exit early when no swaps occur in a pass.',
    interviewTip: 'Useful for nearly-sorted inputs when early termination is enabled.'
  },
  selection: {
    name: 'Selection Sort',
    category: 'Elementary',
    best: 'O(N²)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    adaptive: false,
    pseudocode: [
      'for i = 0 to n - 1:',
      '  minIdx = i',
      '  for j = i + 1 to n - 1:',
      '    if array[j] < array[minIdx]: minIdx = j',
      '  swap(array[i], array[minIdx])'
    ],
    intuition: 'Finds minimum element from unsorted portion and places it at beginning.',
    mistakes: 'Assuming Selection Sort is stable.',
    interviewTip: 'Makes exactly O(N) swaps, useful when memory writes are expensive.'
  },
  insertion: {
    name: 'Insertion Sort',
    category: 'Elementary',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    adaptive: true,
    pseudocode: [
      'for i = 1 to n - 1:',
      '  key = array[i]',
      '  j = i - 1',
      '  while j >= 0 and array[j] > key:',
      '    array[j+1] = array[j]',
      '    j = j - 1',
      '  array[j+1] = key'
    ],
    intuition: 'Builds sorted array one element at a time like sorting playing cards.',
    mistakes: 'Off-by-one errors when shifting left.',
    interviewTip: 'Fast for small arrays (N <= 20) and base case for hybrid algorithms like TimSort.'
  },
  merge: {
    name: 'Merge Sort',
    category: 'Divide & Conquer',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(N)',
    stable: true,
    inPlace: false,
    adaptive: false,
    pseudocode: [
      'function mergeSort(arr, l, r):',
      '  if l >= r: return',
      '  mid = (l + r) / 2',
      '  mergeSort(arr, l, mid)',
      '  mergeSort(arr, mid+1, r)',
      '  merge(arr, l, mid, r)'
    ],
    intuition: 'Recursively splits array in half, sorts subarrays, and merges them back.',
    mistakes: 'Ignoring O(N) auxiliary space requirement.',
    interviewTip: 'Preferred for sorting linked lists due to O(1) space pointer manipulations.'
  },
  quick: {
    name: 'Quick Sort',
    category: 'Divide & Conquer',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N²)',
    space: 'O(log N)',
    stable: false,
    inPlace: true,
    adaptive: false,
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    p = partition(arr, low, high)',
      '    quickSort(arr, low, p - 1)',
      '    quickSort(arr, p + 1, high)'
    ],
    intuition: 'Partitions array around a pivot element so smaller values go left and larger right.',
    mistakes: 'Choosing fixed pivot on already sorted array leading to O(N²) depth.',
    interviewTip: 'Randomized or Median-of-Three pivot selection avoids O(N²) worst case.'
  },
  heap: {
    name: 'Heap Sort',
    category: 'Heap & Trees',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    adaptive: false,
    pseudocode: [
      'buildMaxHeap(arr)',
      'for i = n - 1 down to 1:',
      '  swap(arr[0], arr[i])',
      '  heapify(arr, 0, i)'
    ],
    intuition: 'Builds a Max Binary Heap and repeatedly extracts the root max element.',
    mistakes: 'Confusing 0-based array indexing for parent/child nodes.',
    interviewTip: 'Guarantees O(N log N) worst case time with O(1) auxiliary space.'
  },
  shell: {
    name: 'Shell Sort',
    category: 'Specialized',
    best: 'O(N log N)',
    avg: 'O(N^(4/3))',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    adaptive: true,
    pseudocode: [
      'for gap = n/2 down to 1:',
      '  for i = gap to n - 1:',
      '    gappedInsertionSort(arr, i, gap)'
    ],
    intuition: 'Generalization of insertion sort that allows exchanges of far apart items.',
    mistakes: 'Choosing poor gap sequences.',
    interviewTip: 'Drastically reduces elements movement compared to standard insertion sort.'
  },
  counting: {
    name: 'Counting Sort',
    category: 'Distribution',
    best: 'O(N + K)',
    avg: 'O(N + K)',
    worst: 'O(N + K)',
    space: 'O(K)',
    stable: true,
    inPlace: false,
    adaptive: false,
    pseudocode: [
      'count = array of zeroes(max - min + 1)',
      'for x in input: count[x - min]++',
      'reconstruct output from count frequency'
    ],
    intuition: 'Non-comparison integer sorting algorithm based on keys frequency counting.',
    mistakes: 'Using when key range K is drastically larger than N.',
    interviewTip: 'Runs in O(N) linear time when input range K is small.'
  },
  radix: {
    name: 'Radix Sort',
    category: 'Distribution',
    best: 'O(N * K)',
    avg: 'O(N * K)',
    worst: 'O(N * K)',
    space: 'O(N + K)',
    stable: true,
    inPlace: false,
    adaptive: false,
    pseudocode: [
      'for digit position exp = 1 to maxDigit:',
      '  countingSortByDigit(arr, exp)'
    ],
    intuition: 'Sorts numbers digit by digit from least significant to most significant digit.',
    mistakes: 'Using non-stable intermediate sort.',
    interviewTip: 'Linear time complexity O(N) when maximum digit length K is constant.'
  },
  bucket: {
    name: 'Bucket Sort',
    category: 'Distribution',
    best: 'O(N + K)',
    avg: 'O(N + K)',
    worst: 'O(N²)',
    space: 'O(N)',
    stable: true,
    inPlace: false,
    adaptive: true,
    pseudocode: [
      'scatter elements into buckets',
      'sort each bucket individually',
      'gather sorted buckets into array'
    ],
    intuition: 'Distributes array elements into buckets and sorts each bucket individually.',
    mistakes: 'Non-uniform distribution causing single bucket overflow.',
    interviewTip: 'Ideal when input data is uniformly distributed over an interval.'
  }
};

const SortingLab = () => {
  const [algoKey, setAlgoKey] = useState('bubble');
  const [array, setArray] = useState([45, 23, 89, 12, 67, 34, 90, 15, 56, 78]);
  const [datasetSize, setDatasetSize] = useState(10);
  const [pivotStrategy, setPivotStrategy] = useState('last');
  const [viewMode, setViewMode] = useState('bars_vertical');
  const [selectedCompareAlgos, setSelectedCompareAlgos] = useState(['bubble', 'quick', 'merge', 'heap']);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  // Playback & Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [backendStats, setBackendStats] = useState({});
  const [error, setError] = useState(null);

  const currentSpec = SORTING_SPECS[algoKey] || SORTING_SPECS.bubble;

  // Fetch execution steps from C++ Engine backend API
  const fetchCppSteps = async () => {
    try {
      setError(null);
      const algoNameMap = {
        bubble: 'bubble_sort',
        selection: 'selection_sort',
        insertion: 'insertion_sort',
        merge: 'merge_sort',
        quick: 'quick_sort',
        heap: 'heap_sort',
        shell: 'shell_sort',
        counting: 'counting_sort',
        radix: 'radix_sort',
        bucket: 'bucket_sort'
      };

      const algoCode = algoNameMap[algoKey] || `${algoKey}_sort`;
      const response = await api.post('/sorting/run', {
        algorithm: algoCode,
        input: array,
        pivotStrategy
      });

      if (response.data?.success) {
        setEvents(response.data.data.events || []);
        setBackendStats(response.data.data.statistics || {});
        setStepIndex(0);
      } else {
        setError(response.data?.message || 'Failed to fetch sorting steps from C++ engine.');
      }
    } catch (err) {
      console.error('Error fetching C++ sorting steps:', err);
      setError('C++ Sorting Engine Connection Failure.');
    }
  };

  useEffect(() => {
    if (!isComparisonMode) {
      fetchCppSteps();
    }
  }, [algoKey, array, pivotStrategy, isComparisonMode]);

  // Stepper playback effect
  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 600 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const handleGenerateDataset = (type, customSize = datasetSize) => {
    let newArr = [];
    if (type === 'random') {
      newArr = Array.from({ length: customSize }, () => Math.floor(Math.random() * 90) + 10);
    } else if (type === 'reverse') {
      newArr = Array.from({ length: customSize }, (_, i) => (customSize - i) * 8 + 10);
    } else if (type === 'nearly') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 8 + 10);
      if (newArr.length > 3) {
        let tmp = newArr[2]; newArr[2] = newArr[3]; newArr[3] = tmp;
      }
    } else if (type === 'duplicates') {
      newArr = Array.from({ length: customSize }, () => [15, 30, 45, 60][Math.floor(Math.random() * 4)]);
    }
    setArray(newArr);
    setIsPlaying(false);
  };

  const handleImportCSV = (imported) => {
    setArray(imported);
    setIsPlaying(false);
  };

  const currentStep = events[stepIndex] || {};

  // Compute live step statistics
  const liveStats = {
    comparisons: currentStep.stats?.comparisons ?? backendStats.comparisons ?? 0,
    swaps: currentStep.stats?.swaps ?? backendStats.swaps ?? 0,
    writes: currentStep.stats?.writes ?? backendStats.writes ?? 0,
    reads: currentStep.stats?.reads ?? backendStats.reads ?? 0,
    recursiveCalls: currentStep.stats?.recursiveCalls ?? backendStats.recursiveCalls ?? 0,
    runtimeMs: backendStats.runtimeMs || 0.15
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Top Header Card */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                <BarChart2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-heading font-bold text-textPrimary">Sorting Laboratory</h1>
            </div>
            <p className="text-sm font-body text-textSecondary mt-1">
              Deterministic C++ Sorting Engine with live statistics, step playback, and multi-algorithm comparison.
            </p>
          </div>
          <MascotRole role="teacher" activity="reading" dialogue={`Executing ${currentSpec.name} in C++!`} className="w-20 h-20" />
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-danger/15 border-2 border-danger/30 text-danger text-xs font-mono font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchCppSteps}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Connection
            </Button>
          </div>
        )}

        {isComparisonMode ? (
          <SortingComparisonView
            array={array}
            algorithms={SORTING_SPECS}
            selectedCompareAlgos={selectedCompareAlgos}
            onBackToSingle={() => setIsComparisonMode(false)}
          />
        ) : (
          <div className="space-y-6">

            {/* Live Stats Dashboard */}
            <SortingStatsPanel
              stats={liveStats}
              stepIndex={stepIndex}
              totalSteps={events.length}
            />

            {/* 3-Column Laboratory Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT: Engine Configuration */}
              <div className="lg:col-span-3">
                <SortingConfigPanel
                  algoKey={algoKey}
                  setAlgoKey={setAlgoKey}
                  algorithms={SORTING_SPECS}
                  pivotStrategy={pivotStrategy}
                  setPivotStrategy={setPivotStrategy}
                  datasetSize={datasetSize}
                  setDatasetSize={setDatasetSize}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  selectedCompareAlgos={selectedCompareAlgos}
                  setSelectedCompareAlgos={setSelectedCompareAlgos}
                  isComparisonMode={isComparisonMode}
                  setIsComparisonMode={setIsComparisonMode}
                  onRunComparison={() => setIsComparisonMode(true)}
                  onGenerateDataset={handleGenerateDataset}
                  onImportCSV={handleImportCSV}
                />
              </div>

              {/* CENTER: Canvas & Controls */}
              <div className="lg:col-span-6 space-y-4">
                <SortingCanvas
                  array={array}
                  events={events}
                  stepIndex={stepIndex}
                  viewMode={viewMode}
                  spec={currentSpec}
                />

                <SortingPlaybackBar
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  stepIndex={stepIndex}
                  totalSteps={events.length}
                  onStepChange={setStepIndex}
                  speed={speed}
                  setSpeed={setSpeed}
                  onRestart={() => setStepIndex(0)}
                />
              </div>

              {/* RIGHT: Pseudocode & Concepts */}
              <div className="lg:col-span-3">
                <SortingConceptPanel
                  spec={currentSpec}
                  stepLine={currentStep.line || 0}
                  stepDesc={currentStep.desc || ''}
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default SortingLab;
