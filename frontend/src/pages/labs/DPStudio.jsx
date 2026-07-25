import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Activity, 
  Sparkles, 
  Layers, 
  Zap,
  Grid
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const DP_PROBLEMS = {
  fibonacci: {
    name: 'Fibonacci Sequence',
    category: '1D DP',
    difficulty: 'Easy',
    time: 'O(N)',
    space: 'O(N)',
    pseudocode: [
      'dp[0] = 0, dp[1] = 1',
      'for i = 2 to n:',
      '  dp[i] = dp[i-1] + dp[i-2]',
      'return dp[n]'
    ]
  },
  climbing: {
    name: 'Climbing Stairs',
    category: '1D DP',
    difficulty: 'Easy',
    time: 'O(N)',
    space: 'O(N)',
    pseudocode: [
      'dp[1] = 1, dp[2] = 2',
      'for i = 3 to n:',
      '  dp[i] = dp[i-1] + dp[i-2]',
      'return dp[n]'
    ]
  },
  knapsack: {
    name: '0/1 Knapsack Problem',
    category: '2D DP',
    difficulty: 'Medium',
    time: 'O(N × W)',
    space: 'O(N × W)',
    pseudocode: [
      'for i = 1 to n:',
      '  for w = 1 to W:',
      '    if wt[i-1] <= w:',
      '      dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])',
      '    else: dp[i][w] = dp[i-1][w]'
    ]
  }
};

const DPStudio = () => {
  const [problemKey, setProblemKey] = useState('fibonacci');
  const [approach, setApproach] = useState('tabulation'); // memoization, tabulation, space
  const [inputValue, setInputValue] = useState(6);
  const [dpTable, setDpTable] = useState([0, 1, 1, 2, 3, 5, 8]);
  const [activeCell, setActiveCell] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [stats, setStats] = useState({ calls: 0, memoHits: 0, updates: 0 });

  const currentProblem = DP_PROBLEMS[problemKey];

  // Generate Tabulation Events for Fibonacci
  const generateFibEvents = (n) => {
    let steps = [];
    let table = Array(n + 1).fill(null);
    table[0] = 0;
    table[1] = 1;
    let updates = 2;

    steps.push({
      table: [...table], active: 0, line: 0, updates: 1,
      desc: 'Base case initialized: dp[0] = 0'
    });
    steps.push({
      table: [...table], active: 1, line: 0, updates: 2,
      desc: 'Base case initialized: dp[1] = 1'
    });

    for (let i = 2; i <= n; i++) {
      table[i] = table[i - 1] + table[i - 2];
      updates++;
      steps.push({
        table: [...table], active: i, line: 2, updates,
        desc: `Computing dp[${i}] = dp[${i-1}] (${table[i-1]}) + dp[${i-2}] (${table[i-2]}) = ${table[i]}`
      });
    }

    return steps;
  };

  useEffect(() => {
    const steps = generateFibEvents(inputValue);
    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(false);
    if (steps.length > 0) applyStep(steps[0]);
  }, [problemKey, inputValue, approach]);

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
    setDpTable(step.table);
    setActiveCell(step.active);
    setActiveCodeLine(step.line);
    setStats({ calls: step.updates * 2, memoHits: Math.floor(step.updates / 2), updates: step.updates });
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Cpu className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Dynamic Programming Studio</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Discover optimal substructure, recurrence relations, and DP table state transitions visually.
            </p>
          </div>

          {/* Approach Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100/70 p-1.5 rounded-2xl border border-gray-200/50">
            {['memoization', 'tabulation', 'space'].map((app) => (
              <button
                key={app}
                onClick={() => setApproach(app)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-poppins capitalize transition-all ${
                  approach === app ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Problem Selector */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Select DP Problem</h3>
            <div className="space-y-2">
              {Object.keys(DP_PROBLEMS).map((key) => {
                const item = DP_PROBLEMS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setProblemKey(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      problemKey === key
                        ? 'border-primary bg-primary/5 text-primary font-semibold shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-poppins font-bold">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-mono">{item.difficulty}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block font-inter">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column: DP Table Visualization Canvas */}
          <div className="lg:col-span-6 space-y-6">

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[340px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>DP TABLE STATE: {currentProblem.name.toUpperCase()}</span>
                <span>N = {inputValue}</span>
              </div>

              {/* Live DP Table Grid */}
              <div className="flex items-center justify-center gap-3 py-10 flex-wrap">
                {dpTable.map((val, idx) => {
                  const isActive = activeCell === idx;
                  const isFilled = val !== null;

                  return (
                    <motion.div key={idx} className="flex flex-col items-center">
                      <div className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-accent to-pink-500 text-white border-accent shadow-lg shadow-accent/30 scale-110 ring-4 ring-accent/20'
                          : isFilled
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-gray-50 text-gray-300 border-gray-200'
                      }`}>
                        {val !== null ? val : '?'}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 mt-2">dp[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Event Description */}
              <div className="text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">
                  {events[stepIndex]?.desc || 'Initializing DP Table...'}
                </p>
              </div>
            </div>

            {/* Playback Toolbar */}
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

              {/* Speed Switcher */}
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

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Recurrence & Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1.5 overflow-x-auto">
                {currentProblem.pseudocode.map((line, idx) => (
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

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent" /> DP Efficiency
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-bold text-primary">{currentProblem.time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Space:</span>
                  <span className="font-bold text-emerald-600">{currentProblem.space}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Table Updates:</span>
                  <span className="font-bold text-accent">{stats.updates}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Memo Hits:</span>
                  <span className="font-bold text-amber-500">{stats.memoHits}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default DPStudio;
