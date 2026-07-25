import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Sliders, 
  Code, 
  Activity, 
  Info, 
  BarChart2,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  FileText
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    category: 'Elementary',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    pseudocode: [
      'for i = 0 to n - 1:',
      '  for j = 0 to n - i - 2:',
      '    if array[j] > array[j+1]:',
      '      swap(array[j], array[j+1])'
    ],
    intuition: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements "bubble" up to the end.',
    mistakes: 'Forgetting to stop early if no swaps occur in an inner pass (optimized bubble sort).',
    interviewTip: 'Bubble sort is rarely practical due to O(N²) quadratic time, but useful for nearly sorted arrays if optimized.'
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
    pseudocode: [
      'for i = 0 to n - 1:',
      '  minIdx = i',
      '  for j = i + 1 to n - 1:',
      '    if array[j] < array[minIdx]: minIdx = j',
      '  swap(array[i], array[minIdx])'
    ],
    intuition: 'Divides input into sorted and unsorted regions. Continuously finds the minimum element from the unsorted region and appends it to the sorted region.',
    mistakes: 'Assuming Selection Sort is stable (swapping min element can disrupt relative order of equal elements).',
    interviewTip: 'Selection sort makes exactly O(N) swaps, which can be useful when memory write operations are extremely costly.'
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
    pseudocode: [
      'for i = 1 to n - 1:',
      '  key = array[i]',
      '  j = i - 1',
      '  while j >= 0 and array[j] > key:',
      '    array[j+1] = array[j]',
      '    j = j - 1',
      '  array[j+1] = key'
    ],
    intuition: 'Builds the final sorted array one item at a time, similar to how playing cards are sorted in hand.',
    mistakes: 'Failing to handle 0-index boundary checks when shifting elements left.',
    interviewTip: 'Insertion sort is extremely fast for small datasets (N <= 20) and is used as the base case in hybrid algorithms like Timsort.'
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
    pseudocode: [
      'function mergeSort(arr, l, r):',
      '  if l >= r: return',
      '  mid = (l + r) / 2',
      '  mergeSort(arr, l, mid)',
      '  mergeSort(arr, mid+1, r)',
      '  merge(arr, l, mid, r)'
    ],
    intuition: 'Recursively divides array into halves until subarrays contain single elements, then merges sorted subarrays back together.',
    mistakes: 'Ignoring the O(N) auxiliary space overhead required for temporary arrays during the merge step.',
    interviewTip: 'Merge Sort is preferred for sorting Linked Lists because pointer manipulations allow in-place O(1) extra space.'
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
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    p = partition(arr, low, high)',
      '    quickSort(arr, low, p - 1)',
      '    quickSort(arr, p + 1, high)'
    ],
    intuition: 'Picks a pivot element and partitions the array such that all elements smaller than pivot go left and larger go right.',
    mistakes: 'Using first or last element as pivot on already-sorted arrays, causing quadratic O(N²) worst-case recursion.',
    interviewTip: 'Randomized pivot selection or Median-of-Three pivot choice prevents O(N²) worst-case performance.'
  }
};

const SortingLab = () => {
  const [algoKey, setAlgoKey] = useState('bubble');
  const [array, setArray] = useState([35, 75, 20, 90, 45, 10, 60, 80, 25, 50]);
  const [originalArray, setOriginalArray] = useState([35, 75, 20, 90, 45, 10, 60, 80, 25, 50]);
  const [customInput, setCustomInput] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [pivotIdx, setPivotIdx] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const currentAlgo = ALGORITHMS[algoKey];

  // --- Step Generators ---
  const generateBubbleSteps = (initial) => {
    let arr = [...initial];
    let steps = [];
    let n = arr.length;
    let comparisons = 0, swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          arr: [...arr], comparing: [j, j + 1], swapping: [], sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          line: 2, stats: { comparisons, swaps }, desc: `Comparing index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]})`
        });

        if (arr[j] > arr[j + 1]) {
          swaps++;
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          steps.push({
            arr: [...arr], comparing: [], swapping: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            line: 3, stats: { comparisons, swaps }, desc: `Swapping ${arr[j+1]} and ${arr[j]}`
          });
        }
      }
    }
    steps.push({
      arr: [...arr], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, k) => k),
      line: 0, stats: { comparisons, swaps }, desc: 'Bubble Sort Completed!'
    });
    return steps;
  };

  const generateSelectionSteps = (initial) => {
    let arr = [...initial];
    let steps = [];
    let n = arr.length;
    let comparisons = 0, swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        arr: [...arr], comparing: [i], swapping: [], sorted: Array.from({ length: i }, (_, k) => k),
        line: 1, stats: { comparisons, swaps }, desc: `Current min set to index ${i} (${arr[i]})`
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push({
          arr: [...arr], comparing: [minIdx, j], swapping: [], sorted: Array.from({ length: i }, (_, k) => k),
          line: 3, stats: { comparisons, swaps }, desc: `Comparing arr[${j}] (${arr[j]}) with min arr[${minIdx}] (${arr[minIdx]})`
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            arr: [...arr], comparing: [minIdx], swapping: [], sorted: Array.from({ length: i }, (_, k) => k),
            line: 3, stats: { comparisons, swaps }, desc: `New minimum found: ${arr[minIdx]} at index ${minIdx}`
          });
        }
      }

      if (minIdx !== i) {
        swaps++;
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        steps.push({
          arr: [...arr], comparing: [], swapping: [i, minIdx], sorted: Array.from({ length: i + 1 }, (_, k) => k),
          line: 4, stats: { comparisons, swaps }, desc: `Swapped arr[${i}] and arr[${minIdx}]`
        });
      }
    }
    steps.push({
      arr: [...arr], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, k) => k),
      line: 0, stats: { comparisons, swaps }, desc: 'Selection Sort Completed!'
    });
    return steps;
  };

  const generateInsertionSteps = (initial) => {
    let arr = [...initial];
    let steps = [];
    let n = arr.length;
    let comparisons = 0, swaps = 0;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      steps.push({
        arr: [...arr], comparing: [i], swapping: [], sorted: Array.from({ length: i }, (_, k) => k),
        line: 1, stats: { comparisons, swaps }, desc: `Picked key element ${key} at index ${i}`
      });

      while (j >= 0 && arr[j] > key) {
        comparisons++;
        swaps++;
        arr[j + 1] = arr[j];
        steps.push({
          arr: [...arr], comparing: [j, j + 1], swapping: [j + 1], sorted: Array.from({ length: i }, (_, k) => k),
          line: 4, stats: { comparisons, swaps }, desc: `Shifted element ${arr[j]} right to index ${j + 1}`
        });
        j--;
      }
      arr[j + 1] = key;
      steps.push({
        arr: [...arr], comparing: [], swapping: [j + 1], sorted: Array.from({ length: i + 1 }, (_, k) => k),
        line: 6, stats: { comparisons, swaps }, desc: `Placed key ${key} at index ${j + 1}`
      });
    }
    steps.push({
      arr: [...arr], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, k) => k),
      line: 0, stats: { comparisons, swaps }, desc: 'Insertion Sort Completed!'
    });
    return steps;
  };

  const generateQuickSteps = (initial) => {
    let arr = [...initial];
    let steps = [];
    let comparisons = 0, swaps = 0;

    const partition = (low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      steps.push({
        arr: [...arr], comparing: [high], swapping: [], pivot: high, sorted: [],
        line: 2, stats: { comparisons, swaps }, desc: `Selected pivot ${pivot} at index ${high}`
      });

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          arr: [...arr], comparing: [j, high], swapping: [], pivot: high, sorted: [],
          line: 2, stats: { comparisons, swaps }, desc: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot})`
        });

        if (arr[j] < pivot) {
          i++;
          swaps++;
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          steps.push({
            arr: [...arr], comparing: [], swapping: [i, j], pivot: high, sorted: [],
            line: 2, stats: { comparisons, swaps }, desc: `Swapped arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]})`
          });
        }
      }

      swaps++;
      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      steps.push({
        arr: [...arr], comparing: [], swapping: [i + 1, high], pivot: i + 1, sorted: [],
        line: 2, stats: { comparisons, swaps }, desc: `Placed pivot ${pivot} into correct sorted position ${i + 1}`
      });
      return i + 1;
    };

    const quickSort = (low, high) => {
      if (low < high) {
        let p = partition(low, high);
        quickSort(low, p - 1);
        quickSort(p + 1, high);
      }
    };

    quickSort(0, arr.length - 1);
    steps.push({
      arr: [...arr], comparing: [], swapping: [], pivot: null, sorted: Array.from({ length: arr.length }, (_, k) => k),
      line: 0, stats: { comparisons, swaps }, desc: 'Quick Sort Completed!'
    });
    return steps;
  };

  useEffect(() => {
    let steps = [];
    if (algoKey === 'bubble') steps = generateBubbleSteps(originalArray);
    else if (algoKey === 'selection') steps = generateSelectionSteps(originalArray);
    else if (algoKey === 'insertion') steps = generateInsertionSteps(originalArray);
    else steps = generateQuickSteps(originalArray);

    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
    if (steps.length > 0) applyStep(steps[0]);
  }, [originalArray, algoKey]);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        const next = stepIndex + 1;
        setStepIndex(next);
        applyStep(events[next]);
      }, 600 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const applyStep = (step) => {
    if (!step) return;
    setArray(step.arr);
    setComparing(step.comparing || []);
    setSwapping(step.swapping || []);
    setPivotIdx(step.pivot !== undefined ? step.pivot : null);
    setSortedIndices(step.sorted || []);
    setActiveCodeLine(step.line || 0);
    setStats(step.stats || { comparisons: 0, swaps: 0 });
  };

  const handleCustomImport = () => {
    if (!customInput.trim()) return;
    const parsed = customInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (parsed.length > 0) {
      setOriginalArray(parsed);
      setCustomInput('');
    }
  };

  const handlePreset = (type) => {
    setIsPlaying(false);
    let newArr = [];
    if (type === 'random') newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 80) + 15);
    else if (type === 'reverse') newArr = [90, 80, 70, 60, 50, 40, 30, 20, 10];
    else if (type === 'nearly') newArr = [10, 20, 30, 50, 40, 60, 70, 80, 90];
    setOriginalArray(newArr);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">
        
        {/* Lab Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <BarChart2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Sorting Laboratory</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Visualize comparison, swap, and partitioning dynamics in real-time across classical algorithms.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-4 text-xs font-mono bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
            <div><span className="text-gray-400">Comparisons:</span> <span className="font-bold text-primary">{stats.comparisons}</span></div>
            <div><span className="text-gray-400">Swaps:</span> <span className="font-bold text-accent">{stats.swaps}</span></div>
            <div><span className="text-gray-400">Step:</span> <span className="font-bold text-gray-900">{stepIndex}/{events.length > 0 ? events.length - 1 : 0}</span></div>
          </div>
        </div>

        {/* Main Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Algorithm & Dataset Controls */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Select Algorithm</h3>
            <div className="space-y-2">
              {Object.keys(ALGORITHMS).map((key) => {
                const item = ALGORITHMS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setAlgoKey(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      algoKey === key
                        ? 'border-primary bg-primary/5 text-primary font-semibold shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-poppins font-bold">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-mono">{item.avg}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block font-inter">{item.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Box & Presets */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Custom Array Input</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 40, 10, 80, 30"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <Button onClick={handleCustomImport} variant="outline" className="py-1.5 text-xs px-3">
                  Import
                </Button>
              </div>

              <div className="flex gap-1.5 pt-1">
                <button onClick={() => handlePreset('random')} className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-mono text-gray-700">Random</button>
                <button onClick={() => handlePreset('reverse')} className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-mono text-gray-700">Reverse</button>
                <button onClick={() => handlePreset('nearly')} className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-mono text-gray-700">Nearly Sorted</button>
              </div>
            </div>
          </div>

          {/* Center Column: Canvas & Playback Controls */}
          <div className="lg:col-span-6 space-y-6">

            {/* Visualization Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[340px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>{currentAlgo.name.toUpperCase()} CANVAS</span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Compare
                  <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Swap
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pivot
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Sorted
                </span>
              </div>

              {/* Bar Elements */}
              <div className="h-52 flex items-end justify-center gap-2 px-2 pt-4">
                {array.map((val, idx) => {
                  const isComparing = comparing.includes(idx);
                  const isSwapping = swapping.includes(idx);
                  const isPivot = pivotIdx === idx;
                  const isSorted = sortedIndices.includes(idx);

                  let barBg = 'bg-gradient-to-t from-primary to-[#8E44AD]';
                  if (isComparing) barBg = 'bg-gradient-to-t from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30';
                  if (isSwapping) barBg = 'bg-gradient-to-t from-accent to-pink-500 shadow-lg shadow-accent/30';
                  if (isPivot) barBg = 'bg-gradient-to-t from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/30';
                  if (isSorted) barBg = 'bg-gradient-to-t from-emerald-500 to-teal-400';

                  return (
                    <motion.div
                      key={idx}
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t-xl ${barBg} flex items-center justify-center text-[10px] font-mono font-bold text-white relative group`}
                    >
                      <span className="hidden sm:inline">{val}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Step Description */}
              <div className="text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">
                  {events[stepIndex]?.desc || 'Ready to sort.'}
                </p>
              </div>
            </div>

            {/* Playback Control Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => { if (stepIndex > 0) { setStepIndex(stepIndex - 1); applyStep(events[stepIndex - 1]); } }} 
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if (stepIndex < events.length - 1) { setStepIndex(stepIndex + 1); applyStep(events[stepIndex + 1]); } }}
                  disabled={stepIndex >= events.length - 1}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setStepIndex(0); if (events.length > 0) applyStep(events[0]); }}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      speed === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pseudocode & Complexity */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Pseudocode Highlight Box */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1.5 overflow-x-auto">
                {currentAlgo.pseudocode.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`px-2 py-1 rounded transition-colors ${
                      activeCodeLine === idx ? 'bg-primary/40 text-white font-bold border-l-2 border-primary' : 'opacity-70'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Intuition & Educational Notes */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <Lightbulb className="w-3.5 h-3.5" /> Conceptual Intuition
              </h3>
              <p className="text-xs text-gray-600 font-inter leading-relaxed">{currentAlgo.intuition}</p>
              
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-red-500 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Common Mistake
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentAlgo.mistakes}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-emerald-600 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interview Tip
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentAlgo.interviewTip}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default SortingLab;
