import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Activity, 
  Search, 
  Sparkles,
  Layers
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';
import StringAutoVerifier from '../../components/string/StringAutoVerifier';
import { ShieldCheck } from 'lucide-react';

const STRING_ALGORITHMS = {
  naive: {
    name: 'Naive Pattern Search',
    category: 'Basic',
    time: 'O(N × M)',
    space: 'O(1)',
    pseudocode: [
      'for i = 0 to N - M:',
      '  for j = 0 to M - 1:',
      '    if text[i + j] != pattern[j]: break',
      '  if j == M: match_found at i'
    ]
  },
  kmp: {
    name: 'Knuth-Morris-Pratt (KMP)',
    category: 'Prefix-Based',
    time: 'O(N + M)',
    space: 'O(M)',
    pseudocode: [
      'lps = computeLPSArray(pattern)',
      'while i < N:',
      '  if pattern[j] == text[i]: i++, j++',
      '  if j == M: match_found, j = lps[j-1]',
      '  else if i < N and pattern[j] != text[i]:',
      '    if j != 0: j = lps[j-1]',
      '    else: i++'
    ]
  }
};

const StringLab = () => {
  const [algoKey, setAlgoKey] = useState('kmp');
  const [textInput, setTextInput] = useState('ABABDABACDABABCABAB');
  const [patternInput, setPatternInput] = useState('ABABCABAB');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  const [textIndex, setTextIndex] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [lpsTable, setLpsTable] = useState([]);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [desc, setDesc] = useState('');

  const currentSpec = STRING_ALGORITHMS[algoKey];

  const fetchEvents = async () => {
    try {
      const res = await api.post('/string/run', {
        algorithm: algoKey,
        text: textInput,
        pattern: patternInput
      });
      if (res.data?.success && res.data?.data?.events) {
        setEvents(res.data.data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Failed to fetch string events:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [algoKey, textInput, patternInput]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
    if (events.length > 0) applyStep(events[0]);
  }, [events]);



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
    setTextIndex(step.i);
    setPatternIndex(step.j);
    setMatchedIndices(step.matches);
    setLpsTable(step.lps);
    setActiveCodeLine(step.line);
    setDesc(step.desc);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Type className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">String Algorithms Laboratory</h1>
            </div>
            <p className="text-sm font-body text-gray-500 mt-1">
              Visualize exact substring matching with prefix tables and live pointers.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVerifierOpen(true)}
            className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 shrink-0"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" />
            Verify Engine Reliability
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Algorithm & Inputs Panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Algorithm & Input</h3>
            
            <div className="space-y-2">
              {Object.keys(STRING_ALGORITHMS).map((key) => {
                const item = STRING_ALGORITHMS[key];
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
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-mono">{item.time}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block font-inter">{item.category}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 font-poppins">Target Text</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 font-poppins">Search Pattern</label>
                <input
                  type="text"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[360px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CANVAS: {currentSpec.name.toUpperCase()}</span>
                <span>MATCHES: {matchedIndices.length}</span>
              </div>

              {/* String Character Row Display */}
              <div className="space-y-6 my-auto">
                
                {/* Target Text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400">TEXT:</span>
                  <div className="flex gap-1 overflow-x-auto py-2">
                    {textInput.split('').map((char, idx) => {
                      const isCurrent = textIndex === idx;
                      const isMatched = matchedIndices.some(m => idx >= m && idx < m + patternInput.length);

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-9 h-11 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 ${
                            isCurrent
                              ? 'bg-amber-400 text-white border-amber-500 scale-105 shadow-md ring-2 ring-amber-200'
                              : isMatched
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-400 font-extrabold'
                              : 'bg-white text-gray-800 border-gray-200'
                          }`}>
                            {char}
                          </div>
                          <span className="text-[9px] font-mono text-gray-400 mt-1">{idx}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LPS Table (KMP) */}
                {algoKey === 'kmp' && (
                  <div className="space-y-1 pt-2 border-t border-gray-50">
                    <span className="text-[10px] font-mono text-gray-400">LPS TABLE (PATTERN PREFIX):</span>
                    <div className="flex gap-1 overflow-x-auto py-1">
                      {patternInput.split('').map((char, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-9 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-xs font-bold text-primary">
                            {lpsTable[idx] !== undefined ? lpsTable[idx] : 0}
                          </div>
                          <span className="text-[9px] font-mono text-gray-400 mt-0.5">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Event Description */}
              <div className="text-center pt-2 border-t border-gray-50">
                <p className="text-xs font-mono text-gray-600 truncate">{desc || 'Ready to run string search.'}</p>
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

        </div>

        {isVerifierOpen && <StringAutoVerifier onClose={() => setIsVerifierOpen(false)} />}
      </div>
    </AppLayout>
  );
};

export default StringLab;
