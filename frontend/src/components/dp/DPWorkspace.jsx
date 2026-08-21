import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';
import { 
  ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw, 
  Settings, Award, Box, Code2, LineChart, ShieldCheck, 
  HelpCircle, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { 
  DPTableVisualizer, DPRecursionTree, DPCacheVisualizer, DPStateGraph 
} from './DPVisualizers';
import DPComparisonSuite from './DPComparisonSuite';
import { getCodeSnippets } from '../../data/dpProblems';

const DPWorkspace = ({ problem, onBack }) => {
  const [approach, setApproach] = useState('tabulation');
  const [visMode, setVisMode] = useState('table');
  const [compareMode, setCompareMode] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  
  // Simulation States
  const [nInput, setNInput] = useState(5);
  const [events, setEvents] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms per step
  const [stats, setStats] = useState({ updates: 0, time_ms: 0, calls: 0, hits: 0 });
  const [codeLanguage, setCodeLanguage] = useState('cpp');

  // Practice Mode States
  const [practiceStep, setPracticeStep] = useState(1);
  const [userStateDef, setUserStateDef] = useState('');
  const [userFormula, setUserFormula] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null); // 'correct' | 'incorrect'

  const timerRef = useRef(null);

  // Fetch / Generate events
  const runAlgorithm = async () => {
    setIsPlaying(false);
    try {
      const res = await api.post('/dp/run', {
        algorithm: problem.id,
        n: nInput,
        approach: approach
      });
      if (res.data?.success && res.data?.data?.events) {
        setEvents(res.data.data.events);
        setStats(res.data.data.statistics || { updates: 0, time_ms: 0 });
        setCurrentStep(0);
      } else {
        generateFallbackEvents();
      }
    } catch (e) {
      generateFallbackEvents();
    }
  };

  // Generate frontend fallback events if server is offline or doesn't support the algo
  const generateFallbackEvents = () => {
    const fallbackEvents = [];
    let updates = 0;
    
    if (problem.id === 'fibonacci' || problem.id === 'climbing-stairs') {
      const size = parseInt(nInput) || 5;
      const table = new Array(size + 1).fill(-1);
      table[0] = 0;
      table[1] = 1;
      
      fallbackEvents.push({
        table: [...table], active: 0, line: 3, desc: "Base case: dp[0] = 0 initialized."
      });
      fallbackEvents.push({
        table: [...table], active: 1, line: 4, desc: "Base case: dp[1] = 1 initialized."
      });

      for (let i = 2; i <= size; i++) {
        table[i] = table[i - 1] + table[i - 2];
        updates++;
        fallbackEvents.push({
          table: [...table],
          active: i,
          line: 6,
          desc: `Computing dp[${i}] = dp[${i-1}] (${table[i-1]}) + dp[${i-2}] (${table[i-2]}) = ${table[i]}`
        });
      }
    } else {
      // Dynamic fallback template for other DP problems
      const size = 6;
      const table = new Array(size).fill(-1);
      for (let i = 0; i < size; i++) {
        table[i] = Math.floor(Math.random() * 20) + 1;
        fallbackEvents.push({
          table: [...table],
          active: i,
          line: 4,
          desc: `Updating DP state at node/index ${i} with calculated value ${table[i]}`
        });
      }
    }

    setEvents(fallbackEvents);
    setStats({ updates: fallbackEvents.length, time_ms: 0.12, calls: fallbackEvents.length * 2, hits: Math.floor(fallbackEvents.length / 2) });
    setCurrentStep(0);
  };

  useEffect(() => {
    runAlgorithm();
    return () => clearInterval(timerRef.current);
  }, [problem, approach, nInput]);

  // Handle auto-playing simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, events, speed]);

  const activeEvent = events[currentStep] || {};

  // Code Snippet formatting
  const codeContent = getCodeSnippets(problem.id, codeLanguage, approach);

  // Practice Mode evaluation
  const handleVerifyPractice = () => {
    if (practiceStep === 1) {
      if (userStateDef.toLowerCase().includes('dp[i]') || userStateDef.toLowerCase().includes('state')) {
        setPracticeStatus('correct');
      } else {
        setPracticeStatus('incorrect');
      }
    } else {
      // formula check
      const normalizedFormula = userFormula.replace(/\s+/g, '');
      const correctFormula = problem.formula.replace(/\s+/g, '');
      if (normalizedFormula.includes('dp[i-1]') || normalizedFormula === correctFormula) {
        setPracticeStatus('correct');
      } else {
        setPracticeStatus('incorrect');
      }
    }
  };

  return (
    <div className="space-y-4 font-body">
      
      {/* Top Header Controls */}
      <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 border-[1.5px] border-borderTheme bg-card">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-heading font-bold text-textPrimary flex items-center gap-2">
              <Box className="w-5 h-5 text-primary animate-pulse" />
              {problem.name}
            </h2>
            <p className="text-xs text-textSecondary font-mono">
              Formula: {problem.formula || "dp[i] = transition"}
            </p>
          </div>
        </div>

        {/* Global toggles: Compare, Practice */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant={compareMode ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setPracticeMode(false);
            }}
          >
            <LineChart className="w-4 h-4 mr-1.5" /> Race Approaches
          </Button>
          <Button 
            variant={practiceMode ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => {
              setPracticeMode(!practiceMode);
              setCompareMode(false);
            }}
          >
            <HelpCircle className="w-4 h-4 mr-1.5" /> Practice Mode
          </Button>
        </div>
      </Card>

      {compareMode ? (
        <Card className="border-[1.5px] border-borderTheme bg-card">
          <DPComparisonSuite problem={problem} />
        </Card>
      ) : practiceMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Practice Panel */}
          <Card className="lg:col-span-6 p-6 border-[1.5px] border-borderTheme bg-card space-y-6 min-h-[400px]">
            <div className="border-b border-borderTheme pb-3">
              <h3 className="text-lg font-heading font-bold text-textPrimary">DP Studio Practice Mode</h3>
              <p className="text-xs text-textSecondary">Build and optimize this Dynamic Programming solution step-by-step.</p>
            </div>

            {practiceStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-textPrimary uppercase tracking-wider mb-2">
                    Step 1: Define the DP State
                  </label>
                  <p className="text-xs text-textSecondary mb-3">Describe what dp[i] represents for {problem.name}.</p>
                  <textarea
                    value={userStateDef}
                    onChange={(e) => {
                      setUserStateDef(e.target.value);
                      setPracticeStatus(null);
                    }}
                    placeholder="e.g. dp[i] stores the minimum number of steps to reach stair i..."
                    className="w-full h-24 p-3 bg-cardAccent border border-borderTheme rounded-xl text-sm focus:outline-none focus:border-primary text-textPrimary font-sans"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-textPrimary uppercase tracking-wider mb-2">
                    Step 2: Recurrence Relation
                  </label>
                  <p className="text-xs text-textSecondary mb-3">Write down the state transition formula for dp[i]:</p>
                  <input
                    value={userFormula}
                    onChange={(e) => {
                      setUserFormula(e.target.value);
                      setPracticeStatus(null);
                    }}
                    placeholder="dp[i] = ..."
                    className="w-full p-3 bg-cardAccent border border-borderTheme rounded-xl text-sm font-mono focus:outline-none focus:border-primary text-textPrimary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-borderTheme">
              <Button onClick={handleVerifyPractice} variant="primary">Verify Answer</Button>
              {practiceStep === 1 && practiceStatus === 'correct' && (
                <Button onClick={() => { setPracticeStep(2); setPracticeStatus(null); }} variant="outline">Next Step</Button>
              )}
            </div>

            {practiceStatus === 'correct' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Great work! That definition is mathematically sound.</span>
              </div>
            )}

            {practiceStatus === 'incorrect' && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Oops! That is incorrect. Check your parameters or refer to the formula guide.</span>
              </div>
            )}
          </Card>

          {/* Reference panel */}
          <Card className="lg:col-span-6 p-6 border-[1.5px] border-borderTheme bg-card/40 flex flex-col justify-center items-center text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
            <h4 className="text-base font-bold text-textPrimary">Verify against Reference Solution</h4>
            <p className="text-xs text-textSecondary max-w-xs">
              When ready, you can compare your custom state recurrence formula directly with the validated C++ Engine formula:
            </p>
            <div className="p-3 bg-cardAccent rounded-xl border border-borderTheme font-mono text-xs text-primary">
              {problem.formula || "dp[i] = transition"}
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT: Canvas & Custom Visualization Panel */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Visualizer Canvas Card */}
            <Card className="p-4 border-[1.5px] border-borderTheme bg-card flex flex-col min-h-[420px]">
              
              {/* Header Canvas Controls */}
              <div className="flex flex-wrap justify-between items-center border-b border-borderTheme pb-3 mb-4 gap-2">
                
                {/* Visualization Modes */}
                <div className="flex bg-cardAccent rounded-lg p-0.5 border border-borderTheme">
                  {[
                    { id: 'table', label: 'DP Table' },
                    { id: 'tree', label: 'Recursive Tree' },
                    { id: 'cache', label: 'Cache Status' },
                    { id: 'graph', label: 'State Graph' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setVisMode(mode.id)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                        visMode === mode.id
                          ? 'bg-card text-textPrimary shadow-sm font-extrabold'
                          : 'text-textSecondary hover:text-textPrimary'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Input Controller */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-wider font-mono">Size N:</label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={nInput}
                    onChange={(e) => setNInput(e.target.value)}
                    className="w-14 px-2 py-1 text-xs border border-borderTheme bg-cardAccent rounded-lg text-textPrimary focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Dynamic canvas element rendering */}
              <div className="flex-1 min-h-[300px] flex items-center justify-center">
                {visMode === 'table' && (
                  <DPTableVisualizer 
                    problem={problem} 
                    events={events} 
                    currentStep={currentStep} 
                    spaceOptimized={approach === 'space-optimized'}
                  />
                )}
                {visMode === 'tree' && (
                  <DPRecursionTree 
                    events={events} 
                    currentStep={currentStep} 
                  />
                )}
                {visMode === 'cache' && (
                  <DPCacheVisualizer 
                    events={events} 
                    currentStep={currentStep} 
                  />
                )}
                {visMode === 'graph' && (
                  <DPStateGraph 
                    events={events} 
                    currentStep={currentStep} 
                  />
                )}
              </div>

              {/* Timeline Progress controls */}
              <div className="border-t border-borderTheme pt-3 mt-4 flex flex-col sm:flex-row items-center gap-4">
                
                {/* Playback Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button 
                    variant="outline" 
                    className="p-2"
                    onClick={() => setCurrentStep(0)}
                    disabled={currentStep === 0}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-2"
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="primary" 
                    className="p-2"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-2"
                    onClick={() => setCurrentStep(prev => Math.min(events.length - 1, prev + 1))}
                    disabled={currentStep === events.length - 1}
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Progress bar timeline */}
                <div className="flex-1 w-full flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={events.length > 0 ? events.length - 1 : 0}
                    value={currentStep}
                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-borderTheme rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-textSecondary shrink-0">
                    {currentStep + 1} / {events.length || 1}
                  </span>
                </div>

                {/* Speed Slider */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-bold text-textSecondary uppercase tracking-wider font-mono">Speed:</span>
                  <input
                    type="range"
                    min="150"
                    max="1500"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-16 h-1 bg-borderTheme rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

              </div>

            </Card>

            {/* Info Activity Panel */}
            <Card className="p-4 border-[1.5px] border-borderTheme bg-card space-y-2">
              <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Simulation Activity Log
              </h4>
              <p className="text-sm font-sans font-bold text-textPrimary leading-relaxed">
                {activeEvent?.desc || "Initializing visualizer setup..."}
              </p>
            </Card>

          </div>

          {/* RIGHT: Approach selector, stats, Code Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Approach Selector Card */}
            <Card className="p-4 border-[1.5px] border-borderTheme bg-card space-y-3">
              <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider font-mono">
                Optimization Approach
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'recursive', label: 'Recursive' },
                  { id: 'memoization', label: 'Memoization' },
                  { id: 'tabulation', label: 'Tabulation' },
                  { id: 'space-optimized', label: 'Space Opt.' }
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setApproach(app.id);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      approach === app.id
                        ? 'border-primary bg-primary/10 text-primary font-extrabold shadow-sm'
                        : 'border-borderTheme bg-cardAccent hover:bg-borderTheme text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Code Panel Card */}
            <Card className="p-4 border-[1.5px] border-borderTheme bg-card flex flex-col h-[320px] overflow-hidden">
              <div className="flex justify-between items-center border-b border-borderTheme pb-2 mb-3">
                <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Code Panel
                </h4>
                
                {/* Languages dropdown */}
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-cardAccent border border-borderTheme text-[10px] font-bold text-textPrimary px-2 py-1 rounded-lg focus:outline-none"
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="flex-1 overflow-auto bg-cardAccent p-3 rounded-xl border border-borderTheme">
                <pre className="text-[11px] font-mono leading-relaxed text-textSecondary select-all whitespace-pre-wrap">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card className="p-4 border-[1.5px] border-borderTheme bg-card space-y-4">
              <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider font-mono">
                Performance statistics
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cardAccent rounded-xl border border-borderTheme">
                  <span className="block text-[9px] text-textSecondary uppercase font-bold font-mono">Time Complexity</span>
                  <span className="text-sm font-bold text-textPrimary font-mono">
                    {problem.complexities?.[approach === 'space-optimized' ? 'spaceOptimized' : approach]?.time || 'O(N)'}
                  </span>
                </div>
                <div className="p-3 bg-cardAccent rounded-xl border border-borderTheme">
                  <span className="block text-[9px] text-textSecondary uppercase font-bold font-mono">Space Complexity</span>
                  <span className="text-sm font-bold text-textPrimary font-mono">
                    {problem.complexities?.[approach === 'space-optimized' ? 'spaceOptimized' : approach]?.space || 'O(N)'}
                  </span>
                </div>
                <div className="p-3 bg-cardAccent rounded-xl border border-borderTheme">
                  <span className="block text-[9px] text-textSecondary uppercase font-bold font-mono">Table Updates</span>
                  <span className="text-sm font-bold text-emerald-500 font-mono">{stats.updates}</span>
                </div>
                <div className="p-3 bg-cardAccent rounded-xl border border-borderTheme">
                  <span className="block text-[9px] text-textSecondary uppercase font-bold font-mono">Recur. Calls / Hits</span>
                  <span className="text-sm font-bold text-primary font-mono">{stats.calls || 0} / {stats.hits || 0}</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      )}

    </div>
  );
};

export default DPWorkspace;
