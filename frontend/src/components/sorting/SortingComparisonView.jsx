import React, { useState, useEffect } from 'react';
import { Trophy, Zap, ArrowLeft, RefreshCw, AlertCircle, CheckSquare, Square, Sliders, Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

export const SortingComparisonView = ({
  array,
  setArray,
  algorithms,
  onBackToSingle
}) => {
  const [selectedAlgos, setSelectedAlgos] = useState(['bubble', 'quick', 'merge', 'heap']);
  const [datasetSize, setDatasetSize] = useState(10);
  const [pivotStrategy, setPivotStrategy] = useState('last');
  
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

        const algoCode = algoNameMap[key] || `${key}_sort`;
        const res = await api.post('/sorting/run', {
          algorithm: algoCode,
          input: array,
          pivotStrategy
        });
        if (res.data?.success) {
          newResults[key] = res.data.data;
        } else {
          setError(res.data?.message || 'Error running C++ backend sorting comparison.');
        }
      } catch (err) {
        console.error(`Comparison error for ${key}:`, err);
        setError('Failed to connect to C++ backend sorting engine.');
      }
    }
    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    runAllComparisons();
  }, [array, selectedAlgos, pivotStrategy]);

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
    setDatasetSize(customSize);
    setArray(newArr);
  };

  // Determine winner (lowest C++ runtimeMs or comparisons)
  const getWinner = () => {
    let bestKey = null;
    let minTime = Infinity;
    Object.keys(results).forEach((k) => {
      const time = results[k]?.statistics?.runtimeMs || Infinity;
      if (time < minTime) {
        minTime = time;
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
          <Button variant="outline" size="sm" onClick={onBackToSingle} title="Back to Single Visualizer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Single Visualizer
          </Button>
          <div>
            <h3 className="text-sm font-heading font-bold text-textPrimary">
              Multi-Algorithm Comparison Studio ({selectedAlgos.length} Selected)
            </h3>
            <p className="text-xs text-textSecondary">
              Simultaneous execution of C++ algorithms on identical input array dataset.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={runAllComparisons} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Executing C++ Engine...' : 'Run Comparison'}
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
              <Sliders className="w-3.5 h-3.5 text-primary" /> Select Algorithms to Compare (2 to 6)
            </h4>
            <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-surface rounded-full border border-borderTheme">
              {selectedAlgos.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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

        {/* 2. Dataset Size & Input Pattern Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-borderTheme">
          
          {/* Dataset Size Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Dataset Size Filter</span>
            <div className="flex items-center gap-1.5">
              {[10, 20, 50, 100, 250].map((size) => (
                <button
                  key={size}
                  onClick={() => handleGeneratePattern('random', size)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    datasetSize === size ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-textPrimary border-borderTheme'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Filters */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Input Pattern Filters</span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('random')}>
                Random
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('reverse')}>
                Reverse
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('nearly')}>
                Nearly
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGeneratePattern('duplicates')}>
                Duplicates
              </Button>
            </div>
          </div>

        </div>

        {/* 3. QuickSort Pivot Strategy Filter (if QuickSort selected) */}
        {selectedAlgos.includes('quick') && (
          <div className="space-y-1.5 pt-3 border-t-2 border-borderTheme">
            <span className="text-[11px] font-heading font-bold text-textSecondary uppercase block">QuickSort Pivot Strategy Filter</span>
            <div className="flex items-center gap-2">
              {['last', 'first', 'middle', 'random', 'median3'].map((strat) => (
                <button
                  key={strat}
                  onClick={() => setPivotStrategy(strat)}
                  className={`px-3 py-1 rounded-xl text-xs font-heading font-bold border uppercase transition-all ${
                    pivotStrategy === strat ? 'bg-secondary text-white border-secondary' : 'bg-surface text-textPrimary border-borderTheme'
                  }`}
                >
                  {strat}
                </button>
              ))}
            </div>
          </div>
        )}

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

          const maxVal = Math.max(...currentArr, 1);

          return (
            <Card
              key={key}
              className={`p-4 space-y-3 relative overflow-hidden transition-all ${
                isWinner ? 'border-2 border-warning shadow-medium ring-4 ring-warning/20' : ''
              }`}
            >
              {isWinner && (
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-warning text-textPrimary font-heading font-bold text-[10px] flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-textPrimary" /> WINNER
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-textPrimary">{algoSpec.name}</span>
                <span className="text-[10px] font-mono text-textSecondary">{algoSpec.avg}</span>
              </div>

              {/* Live Array Bars Preview */}
              <div className="h-32 flex items-end justify-center gap-1 bg-surface p-2 rounded-xl border border-borderTheme">
                {currentArr.map((val, i) => {
                  const comparing = (currentStep.type === 'compare' || currentStep.type === 'split') && (i === currentStep.i || i === currentStep.j);
                  const swapping = (currentStep.type === 'swap' || currentStep.type === 'overwrite' || currentStep.type === 'merge') && (i === currentStep.i || i === currentStep.j);

                  let barBg = 'bg-primary';
                  if (comparing) barBg = 'bg-info';
                  if (swapping) barBg = 'bg-accent';

                  return (
                    <div
                      key={i}
                      style={{ height: `${Math.max(10, Math.round((val / maxVal) * 100))}%` }}
                      className={`w-full ${barBg} rounded-t-sm transition-all duration-150`}
                    />
                  );
                })}
              </div>

              {/* Step Action Event Message */}
              <div className="text-center">
                <p className="text-[11px] font-mono text-textSecondary truncate">
                  {currentStep.desc || 'Waiting...'}
                </p>
              </div>

              {/* Live Step Metrics Table */}
              <div className="space-y-1 text-[11px] font-mono border-t border-borderTheme pt-2">
                <div className="flex justify-between">
                  <span className="text-textSecondary">C++ Runtime:</span>
                  <span className="font-bold text-success">{stats.runtimeMs || 0.0} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Comparisons:</span>
                  <span className="font-bold text-info">{currentStep.stats?.comparisons ?? stats.comparisons ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Swaps:</span>
                  <span className="font-bold text-accent">{currentStep.stats?.swaps ?? stats.swaps ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Memory Used:</span>
                  <span className="font-bold text-secondary">{stats.memoryUsedKb || 0} KB</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default SortingComparisonView;
