import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Code, 
  Activity, 
  Info, 
  CheckCircle2, 
  XCircle,
  Target,
  Lightbulb,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const SEARCH_ALGORITHMS = {
  linear: {
    name: 'Linear Search',
    category: 'Sequential',
    requiresSorted: false,
    best: 'O(1)',
    avg: 'O(N)',
    worst: 'O(N)',
    space: 'O(1)',
    pseudocode: [
      'for i = 0 to n - 1:',
      '  if array[i] == target:',
      '    return i',
      'return -1'
    ],
    intuition: 'Scans elements sequentially one by one from start to end until target is found or end of array is reached.',
    mistakes: 'Using linear search on large sorted arrays where O(log N) Binary Search could be drastically faster.',
    interviewTip: 'Linear search requires no preprocessing (no sorting needed) and works on unsorted streams or linked lists.'
  },
  binary: {
    name: 'Binary Search',
    category: 'Divide & Conquer',
    requiresSorted: true,
    best: 'O(1)',
    avg: 'O(log N)',
    worst: 'O(log N)',
    space: 'O(1)',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = low + (high - low) / 2',
      '  if array[mid] == target: return mid',
      '  else if array[mid] < target: low = mid + 1',
      '  else: high = mid - 1',
      'return -1'
    ],
    intuition: 'Repeatedly divides a sorted search interval in half by comparing the middle element to the target.',
    mistakes: 'Integer overflow in mid calculation `(low + high) / 2`; use `low + (high - low) / 2` instead.',
    interviewTip: 'Binary search can be applied to any monotonic function, not just explicit arrays (e.g. search in answer space).'
  },
  interpolation: {
    name: 'Interpolation Search',
    category: 'Uniform Estimation',
    requiresSorted: true,
    best: 'O(1)',
    avg: 'O(log log N)',
    worst: 'O(N)',
    space: 'O(1)',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high and target >= arr[low] and target <= arr[high]:',
      '  pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])',
      '  if arr[pos] == target: return pos',
      '  if arr[pos] < target: low = pos + 1',
      '  else: high = pos - 1',
      'return -1'
    ],
    intuition: 'Estimates target position based on key value distribution, similar to looking up a word in a phone book.',
    mistakes: 'Applying on non-uniformly distributed data, which degrades performance to linear O(N).',
    interviewTip: 'Interpolation search achieves sub-logarithmic O(log log N) time on uniformly distributed sorted numerical data.'
  }
};

const SearchingLab = () => {
  const [algoKey, setAlgoKey] = useState('binary');
  const [array, setArray] = useState([12, 24, 36, 48, 60, 72, 84, 96, 108, 120]);
  const [target, setTarget] = useState(72);
  const [customInput, setCustomInput] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  // Active step states
  const [lowIdx, setLowIdx] = useState(null);
  const [highIdx, setHighIdx] = useState(null);
  const [midIdx, setMidIdx] = useState(null);
  const [visited, setVisited] = useState([]);
  const [foundIdx, setFoundIdx] = useState(null);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [stats, setStats] = useState({ comparisons: 0 });

  const currentAlgo = SEARCH_ALGORITHMS[algoKey];

  // --- Step Generators ---
  const generateLinearSteps = (arr, targetVal) => {
    let steps = [];
    let comparisons = 0;
    let visitedArr = [];

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      visitedArr.push(i);

      steps.push({
        low: null, high: null, mid: i, visited: [...visitedArr], found: null, line: 1, comparisons,
        desc: `Comparing element at index ${i} (${arr[i]}) with target ${targetVal}.`
      });

      if (arr[i] === targetVal) {
        steps.push({
          low: null, high: null, mid: i, visited: [...visitedArr], found: i, line: 2, comparisons,
          desc: `Target ${targetVal} found at index ${i}!`
        });
        return steps;
      }
    }

    steps.push({
      low: null, high: null, mid: null, visited: [...visitedArr], found: null, line: 3, comparisons,
      desc: `Target ${targetVal} not found in array.`
    });
    return steps;
  };

  const generateBinarySteps = (arr, targetVal) => {
    let steps = [];
    let low = 0;
    let high = arr.length - 1;
    let comparisons = 0;
    let visitedArr = [];

    steps.push({
      low, high, mid: null, visited: [], found: null, line: 0, comparisons: 0,
      desc: `Initialized Binary Search. Range: [0 ... ${high}]`
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;
      visitedArr.push(mid);

      steps.push({
        low, high, mid, visited: [...visitedArr], found: null, line: 2, comparisons,
        desc: `Calculated mid = ${mid} (value: ${arr[mid]}). Comparing with target ${targetVal}.`
      });

      if (arr[mid] === targetVal) {
        steps.push({
          low, high, mid, visited: [...visitedArr], found: mid, line: 3, comparisons,
          desc: `Target ${targetVal} found at index ${mid}!`
        });
        return steps;
      } else if (arr[mid] < targetVal) {
        steps.push({
          low: mid + 1, high, mid, visited: [...visitedArr], found: null, line: 4, comparisons,
          desc: `${arr[mid]} < ${targetVal}. Discarding left half. New range: [${mid + 1} ... ${high}]`
        });
        low = mid + 1;
      } else {
        steps.push({
          low, high: mid - 1, mid, visited: [...visitedArr], found: null, line: 5, comparisons,
          desc: `${arr[mid]} > ${targetVal}. Discarding right half. New range: [${low} ... ${mid - 1}]`
        });
        high = mid - 1;
      }
    }

    steps.push({
      low, high, mid: null, visited: [...visitedArr], found: null, line: 6, comparisons,
      desc: `Target ${targetVal} not found in array.`
    });
    return steps;
  };

  const generateInterpolationSteps = (arr, targetVal) => {
    let steps = [];
    let low = 0;
    let high = arr.length - 1;
    let comparisons = 0;
    let visitedArr = [];

    steps.push({
      low, high, mid: null, visited: [], found: null, line: 0, comparisons: 0,
      desc: `Initialized Interpolation Search. Range: [0 ... ${high}]`
    });

    while (low <= high && targetVal >= arr[low] && targetVal <= arr[high]) {
      if (arr[high] === arr[low]) {
        if (arr[low] === targetVal) {
          steps.push({ low, high, mid: low, visited: [low], found: low, line: 3, comparisons: comparisons + 1, desc: `Target found!` });
        }
        break;
      }

      let pos = low + Math.floor(((targetVal - arr[low]) * (high - low)) / (arr[high] - arr[low]));
      pos = Math.max(low, Math.min(high, pos));
      comparisons++;
      visitedArr.push(pos);

      steps.push({
        low, high, mid: pos, visited: [...visitedArr], found: null, line: 2, comparisons,
        desc: `Estimated position index pos = ${pos} (value: ${arr[pos]}).`
      });

      if (arr[pos] === targetVal) {
        steps.push({
          low, high, mid: pos, visited: [...visitedArr], found: pos, line: 3, comparisons,
          desc: `Target ${targetVal} found at estimated position index ${pos}!`
        });
        return steps;
      }

      if (arr[pos] < targetVal) {
        steps.push({
          low: pos + 1, high, mid: pos, visited: [...visitedArr], found: null, line: 4, comparisons,
          desc: `${arr[pos]} < ${targetVal}. Adjusting low to ${pos + 1}.`
        });
        low = pos + 1;
      } else {
        steps.push({
          low, high: pos - 1, mid: pos, visited: [...visitedArr], found: null, line: 5, comparisons,
          desc: `${arr[pos]} > ${targetVal}. Adjusting high to ${pos - 1}.`
        });
        high = pos - 1;
      }
    }

    steps.push({
      low, high, mid: null, visited: [...visitedArr], found: null, line: 6, comparisons,
      desc: `Target ${targetVal} not found in array.`
    });
    return steps;
  };

  useEffect(() => {
    let steps = [];
    if (algoKey === 'binary') {
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      steps = generateBinarySteps(sorted, target);
    } else if (algoKey === 'interpolation') {
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      steps = generateInterpolationSteps(sorted, target);
    } else {
      steps = generateLinearSteps(array, target);
    }
    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
    if (steps.length > 0) applyStep(steps[0]);
  }, [algoKey, target, array]);

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        const next = stepIndex + 1;
        setStepIndex(next);
        applyStep(events[next]);
      }, 700 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const applyStep = (step) => {
    if (!step) return;
    setLowIdx(step.low);
    setHighIdx(step.high);
    setMidIdx(step.mid);
    setVisited(step.visited || []);
    setFoundIdx(step.found);
    setActiveCodeLine(step.line || 0);
    setStats({ comparisons: step.comparisons || 0 });
  };

  const handleCustomImport = () => {
    if (!customInput.trim()) return;
    const parsed = customInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (parsed.length > 0) {
      setArray(parsed);
      setCustomInput('');
    }
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 95) + 5).sort((a, b) => a - b);
    setArray(newArr);
    setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Lab Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Search className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Searching Laboratory</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Visualize target pointer dynamics and search space reduction in real-time.
            </p>
          </div>

          {/* Target Input & Summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-xs">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-gray-400">Target:</span>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-0.5 font-bold text-gray-900 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Selector & Custom Inputs */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Select Search Algorithm</h3>
            <div className="space-y-2">
              {Object.keys(SEARCH_ALGORITHMS).map((key) => {
                const item = SEARCH_ALGORITHMS[key];
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

            {/* Custom Input Box */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Custom Array Input</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 10, 20, 30, 40"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <Button onClick={handleCustomImport} variant="outline" className="py-1.5 text-xs px-3">
                  Import
                </Button>
              </div>
            </div>
          </div>

          {/* Center Column: Visualizer Canvas */}
          <div className="lg:col-span-6 space-y-6">

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[340px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CANVAS: {currentAlgo.name.toUpperCase()}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pointer / Mid
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Found
                </span>
              </div>

              {/* Elements Representation */}
              <div className="flex items-center justify-center gap-2.5 py-8 flex-wrap">
                {array.map((val, idx) => {
                  const isLow = lowIdx === idx;
                  const isHigh = highIdx === idx;
                  const isMid = midIdx === idx;
                  const isFound = foundIdx === idx;
                  const isVisited = visited.includes(idx);
                  const isDiscarded = lowIdx !== null && highIdx !== null && (idx < lowIdx || idx > highIdx);

                  let bgClass = 'bg-gray-100 text-gray-700 border-gray-200';
                  if (isVisited) bgClass = 'bg-blue-50 text-blue-600 border-blue-200';
                  if (isMid) bgClass = 'bg-amber-400 text-white border-amber-500 shadow-lg shadow-amber-400/30 scale-110';
                  if (isFound) bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/40 scale-115 ring-4 ring-emerald-200';
                  if (isDiscarded) bgClass = 'bg-gray-50 text-gray-300 border-gray-100 opacity-40';

                  return (
                    <motion.div key={idx} className="flex flex-col items-center">
                      <div className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-sm font-bold font-mono transition-all duration-300 ${bgClass}`}>
                        {val}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 mt-1.5">[{idx}]</span>
                      <div className="flex gap-1 mt-1 text-[9px] font-bold font-mono">
                        {isLow && <span className="text-primary">L</span>}
                        {isMid && <span className="text-amber-500">M</span>}
                        {isHigh && <span className="text-accent">H</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Event Description */}
              <div className="text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">
                  {events[stepIndex]?.desc || 'Select algorithm to run search.'}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
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
                <button 
                  onClick={handleRandomize}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                  title="Randomize Array & Target"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller */}
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

          {/* Right Column: Pseudocode & Specs */}
          <div className="lg:col-span-3 space-y-6">

            {/* Pseudocode Box */}
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

export default SearchingLab;
