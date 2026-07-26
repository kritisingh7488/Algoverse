import React, { useState, useEffect } from 'react';
import { Trophy, Search, Target, ArrowLeft, RefreshCw, AlertCircle, CheckSquare, Square, Sliders, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

export const SearchingComparisonView = ({
  array,
  setArray,
  target,
  setTarget,
  algorithms,
  onBackToSingle
}) => {
  const [selectedAlgos, setSelectedAlgos] = useState(['linear', 'binary', 'jump', 'interpolation']);
  const [datasetSize, setDatasetSize] = useState(10);
  
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronized Playback Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  const toggleAlgo = (key) => {
    if (selectedAlgos.includes(key)) {
      if (selectedAlgos.length > 2) {
        setSelectedAlgos(selectedAlgos.filter(k => k !== key));
      }
    } else {
      if (selectedAlgos.length < 6) {
        setSelectedAlgos([...selectedAlgos, key]);
      }
    }
  };

  const runAllComparisons = async () => {
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setStepIndex(0);
    const newResults = {};

    for (const key of selectedAlgos) {
      try {
        const algoNameMap = {
          linear: 'linear_search',
          sentinel: 'sentinel_search',
          binary: 'binary_search',
          recbinary: 'recursive_binary_search',
          jump: 'jump_search',
          interpolation: 'interpolation_search'
        };

        const algoCode = algoNameMap[key] || `${key}_search`;
        const res = await api.post('/searching/run', {
          algorithm: algoCode,
          target,
          input: array
        });
        if (res.data?.success) {
          newResults[key] = res.data.data;
        } else {
          setError(res.data?.message || 'Error running C++ searching comparison.');
        }
      } catch (err) {
        console.error(`Searching comparison error for ${key}:`, err);
        setError('Failed to connect to C++ backend searching engine.');
      }
    }
    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    runAllComparisons();
  }, [array, target, selectedAlgos]);

  // Max events count across algorithms for scrubber
  const maxEventsCount = Math.max(
    ...Object.values(results).map(r => r?.events?.length || 0),
    1
  );

  // Stepper effect
  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < maxEventsCount - 1) {
      timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 600 / speed);
    } else if (stepIndex >= maxEventsCount - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, maxEventsCount, speed]);

  // Generate Pattern Dataset
  const handleGeneratePattern = (type, customSize = datasetSize) => {
    let newArr = [];
    if (type === 'random') {
      newArr = Array.from({ length: customSize }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    } else if (type === 'target_start') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[0]);
    } else if (type === 'target_mid') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[Math.floor(customSize / 2)]);
    } else if (type === 'target_end') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(newArr[customSize - 1]);
    } else if (type === 'missing') {
      newArr = Array.from({ length: customSize }, (_, i) => i * 10 + 10);
      setTarget(999);
    }
    setDatasetSize(customSize);
    setArray(newArr);
  };

  // Determine winner (least comparisons or fastest C++ time)
  const getWinner = () => {
    let bestKey = null;
    let minComparisons = Infinity;
    Object.keys(results).forEach((k) => {
      const comp = results[k]?.statistics?.comparisons || Infinity;
      if (comp < minComparisons) {
        minComparisons = comp;
        bestKey = k;
      }
    });
    return bestKey;
  };

  const winnerKey = getWinner();

  return (
    <div className="space-y-6 font-body">
      
      {/* Header Toolbar */}
      <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBackToSingle} title="Back to Single Search Visualizer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Single Search
          </Button>
          <div>
            <h3 className="text-sm font-heading font-bold text-textPrimary">
              Multi-Search Comparison Studio ({selectedAlgos.length} Selected)
            </h3>
            <p className="text-xs text-textSecondary">
              Simultaneous execution of C++ search algorithms on identical array & target ({target}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={runAllComparisons} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Executing C++ Engine...' : 'Run Search Comparison'}
          </Button>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-danger/15 border-2 border-danger/30 text-danger text-xs font-mono font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Algorithm Selector Card */}
      <Card className="p-5 space-y-4">
        
        {/* 1. Checkbox Matrix for selecting 2 to 6 algorithms */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Select Search Algorithms to Compare (2 to 6)
            </h4>
            <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-surface rounded-full border border-borderTheme">
              {selectedAlgos.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.keys(algorithms).map((key) => {
              const algo = algorithms[key];
              const isChecked = selectedAlgos.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleAlgo(key)}
                  className={`px-3 py-2 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between border ${
                    isChecked
                      ? 'bg-primary/15 border-primary text-primary shadow-xs'
                      : 'bg-surface border-borderTheme text-textSecondary hover:bg-card'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-primary shrink-0" /> : <Square className="w-3.5 h-3.5 text-textSecondary shrink-0" />}
                    <span className="truncate">{algo.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dataset Size & Target Placement Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-borderTheme">
          
          {/* Target Value & Dataset Size */}
          <div className="space-y-2">
            <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Target & Size Filter</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-borderTheme rounded-xl text-xs font-mono">
                <Target className="w-3.5 h-3.5 text-accent" />
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                  className="w-14 bg-card border border-borderTheme rounded-lg px-2 py-0.5 font-bold focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-1 flex-1">
                {[10, 20, 50, 100, 250].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleGeneratePattern('random', size)}
                    className={`flex-1 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                      datasetSize === size ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-textPrimary border-borderTheme'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Filters */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Target Placement Presets</span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('target_start')}>
                Start
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('target_mid')}>
                Mid
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('target_end')}>
                End
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('missing')}>
                Missing
              </Button>
            </div>
          </div>

        </div>

      </Card>

      {/* Synchronized Playback Control Toolbar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            <span>{isPlaying ? 'Pause All' : 'Play All'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex >= maxEventsCount - 1}
            onClick={() => setStepIndex(Math.min(maxEventsCount - 1, stepIndex + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setStepIndex(0)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrubber */}
        <div className="flex-1 w-full flex items-center gap-3 max-w-md">
          <span className="text-xs font-mono font-bold text-textSecondary min-w-[70px]">
            Step {stepIndex + 1}/{maxEventsCount}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(0, maxEventsCount - 1)}
            value={stepIndex}
            onChange={(e) => setStepIndex(parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1">
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                speed === s ? 'bg-primary text-white' : 'bg-surface text-textSecondary border border-borderTheme'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </Card>

      {/* Grid of Comparing Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedAlgos.map((key) => {
          const algoSpec = algorithms[key] || { name: key };
          const data = results[key] || {};
          const stats = data.statistics || {};
          const eventsList = data.events || [];
          const currentStep = eventsList[Math.min(stepIndex, eventsList.length - 1)] || {};
          const currentArr = currentStep.array || array;
          const isWinner = winnerKey === key;
          const found = data.found;

          return (
            <Card
              key={key}
              className={`p-4 space-y-3 relative overflow-hidden transition-all ${
                isWinner ? 'border-2 border-warning shadow-medium ring-4 ring-warning/20' : ''
              }`}
            >
              {isWinner && (
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-warning text-textPrimary font-heading font-bold text-[10px] flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-textPrimary" /> MOST EFFICIENT
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-textPrimary">{algoSpec.name}</span>
                <span className="text-[10px] font-mono text-textSecondary">{algoSpec.avg}</span>
              </div>

              {/* Live Array Cells Preview */}
              <div className="h-28 flex items-center justify-center gap-1.5 bg-surface p-2 rounded-xl border border-borderTheme overflow-x-auto">
                {currentArr.slice(0, 12).map((val, i) => {
                  const isMidActive = currentStep.mid === i;
                  const isFound = currentStep.type === 'found' && (currentStep.mid === i || currentStep.i === i);

                  let cellBg = 'bg-card border-borderTheme text-textPrimary';
                  if (isMidActive) cellBg = 'bg-warning text-textPrimary border-warning scale-110';
                  if (isFound) cellBg = 'bg-success text-white border-success scale-110';

                  return (
                    <div
                      key={i}
                      className={`w-7 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-[10px] transition-all ${cellBg}`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-textSecondary">Target Found:</span>
                {found ? (
                  <span className="font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Index [{data.foundIndex}]
                  </span>
                ) : (
                  <span className="font-bold text-danger flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> NOT FOUND
                  </span>
                )}
              </div>

              {/* Live Step Metrics Table */}
              <div className="space-y-1 text-[11px] font-mono border-t border-borderTheme pt-2">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Comparisons:</span>
                  <span className="font-bold text-info">{currentStep.stats?.comparisons ?? stats.comparisons ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Visited Nodes:</span>
                  <span className="font-bold text-accent">{currentStep.stats?.visitedCount ?? stats.visitedCount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Pointer Moves:</span>
                  <span className="font-bold text-secondary">{currentStep.stats?.pointerMoves ?? stats.pointerMoves ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">C++ Runtime:</span>
                  <span className="font-bold text-success">{stats.runtimeMs || 0.0} ms</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default SearchingComparisonView;
