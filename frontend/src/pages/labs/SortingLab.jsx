import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
};

const SortingLab = () => {
  const [algoKey, setAlgoKey] = useState('bubble');
  const [array, setArray] = useState([35, 75, 20, 90, 45, 10, 60, 80, 25, 50]);
  const [originalArray, setOriginalArray] = useState([35, 75, 20, 90, 45, 10, 60, 80, 25, 50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const currentAlgo = ALGORITHMS[algoKey];

  // Pre-generate steps for Bubble Sort simulation
  const generateBubbleSteps = (initial) => {
    let arr = [...initial];
    let steps = [];
    let n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({
          arr: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          line: 2,
          stats: { comparisons, swaps },
          desc: `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`
        });

        if (arr[j] > arr[j + 1]) {
          swaps++;
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          steps.push({
            arr: [...arr],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            line: 3,
            stats: { comparisons, swaps },
            desc: `Swapping ${arr[j+1]} and ${arr[j]}`
          });
        }
      }
    }
    steps.push({
      arr: [...arr],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      line: 0,
      stats: { comparisons, swaps },
      desc: 'Sorting complete!'
    });
    return steps;
  };

  useEffect(() => {
    const steps = generateBubbleSteps(originalArray);
    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
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
    setComparing(step.comparing);
    setSwapping(step.swapping);
    setSortedIndices(step.sorted);
    setActiveCodeLine(step.line);
    setStats(step.stats);
  };

  const handleNext = () => {
    if (stepIndex < events.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      applyStep(events[next]);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      const prev = stepIndex - 1;
      setStepIndex(prev);
      applyStep(events[prev]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
    if (events.length > 0) applyStep(events[0]);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 15);
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
              Visualize comparison and swap dynamics in real-time across classical algorithms.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-4 text-xs font-mono bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
            <div><span className="text-gray-400">Comparisons:</span> <span className="font-bold text-primary">{stats.comparisons}</span></div>
            <div><span className="text-gray-400">Swaps:</span> <span className="font-bold text-accent">{stats.swaps}</span></div>
            <div><span className="text-gray-400">Step:</span> <span className="font-bold text-gray-900">{stepIndex}/{events.length - 1}</span></div>
          </div>
        </div>

        {/* Main Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Algorithm Selector */}
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
          </div>

          {/* Center Column: Canvas & Controls */}
          <div className="lg:col-span-6 space-y-6">

            {/* Visualization Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[340px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>{currentAlgo.name.toUpperCase()} CANVAS</span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Compare
                  <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Swap
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Sorted
                </span>
              </div>

              {/* Bar Elements */}
              <div className="h-52 flex items-end justify-center gap-2 px-2 pt-4">
                {array.map((val, idx) => {
                  const isComparing = comparing.includes(idx);
                  const isSwapping = swapping.includes(idx);
                  const isSorted = sortedIndices.includes(idx);

                  let barBg = 'bg-gradient-to-t from-primary to-[#8E44AD]';
                  if (isComparing) barBg = 'bg-gradient-to-t from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30';
                  if (isSwapping) barBg = 'bg-gradient-to-t from-accent to-pink-500 shadow-lg shadow-accent/30';
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
              <div className="text-center pt-2">
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
                  onClick={handlePrev} 
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={stepIndex >= events.length - 1}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleReset}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleRandomize}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                  title="Randomize Array"
                >
                  <Shuffle className="w-4 h-4" />
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

            {/* Complexity Specs */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent" /> Complexity Specs
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Best Case:</span>
                  <span className="font-bold text-emerald-600">{currentAlgo.best}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Average:</span>
                  <span className="font-bold text-primary">{currentAlgo.avg}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Worst Case:</span>
                  <span className="font-bold text-danger">{currentAlgo.worst}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Space:</span>
                  <span className="font-bold text-gray-700">{currentAlgo.space}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Stable:</span>
                  <span className="font-bold text-gray-700">{currentAlgo.stable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default SortingLab;
