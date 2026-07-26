import React, { useState, useEffect } from 'react';
import { Trophy, Target, ArrowLeft, RefreshCw, AlertCircle, CheckSquare, Square, Sliders, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, Zap, ShieldCheck } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

import { ArrayRenderer } from './renderers/ArrayRenderer';
import { HashRenderer } from './renderers/HashRenderer';
import { TreeRenderer } from './renderers/TreeRenderer';
import { TrieRenderer } from './renderers/TrieRenderer';
import { PatternRenderer } from './renderers/PatternRenderer';
import { GraphRenderer } from './renderers/GraphRenderer';

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
          interpolation: 'interpolation_search',
          exponential: 'exponential_search',
          fibonacci: 'fibonacci_search',
          ternary: 'ternary_search',
          metabinary: 'meta_binary_search',
          hashtable: 'hashtable_search',
          cuckoo: 'cuckoo_search',
          bst: 'bst_search',
          avl: 'avl_search',
          redblack: 'redblack_search',
          trie: 'trie_search',
          kmp: 'kmp_search',
          rabinkarp: 'rabinkarp_search',
          bfs: 'graph_bfs',
          dfs: 'graph_dfs'
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

  // Winner Calculations
  const getWinners = () => {
    let minTime = Infinity;
    let minComp = Infinity;
    let minMem = Infinity;

    Object.keys(results).forEach(k => {
      const data = results[k];
      const stats = data?.statistics || {};
      if ((stats.runtimeMs || 0) < minTime) minTime = stats.runtimeMs || 0;
      if ((stats.comparisons || 0) < minComp) minComp = stats.comparisons || 0;
      if ((stats.memoryUsedKb || 0) < minMem) minMem = stats.memoryUsedKb || 0;
    });

    const fastest = Object.keys(results).filter(k => (results[k]?.statistics?.runtimeMs || 0) === minTime);
    const fewestComp = Object.keys(results).filter(k => (results[k]?.statistics?.comparisons || 0) === minComp);
    const lowestMem = Object.keys(results).filter(k => (results[k]?.statistics?.memoryUsedKb || 0) === minMem);

    return { fastest, fewestComp, lowestMem };
  };

  const winners = getWinners();

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
              Simultaneous C++ search execution on identical input array & target ({target}).
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

      {/* Checkbox Matrix for selecting 2 to 6 algorithms */}
      <Card className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Select Search Algorithms to Compare (2 to 6)
            </h4>
            <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-surface rounded-full border border-borderTheme">
              {selectedAlgos.length}/6 Selected
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

        {/* Dataset Size & Target Placement Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-borderTheme">
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
          {[0.25, 0.5, 1, 2, 4, 10].map((s) => (
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

      {/* Grid of Comparing Visualizers (Mounting exact dedicated visualizers with compact={true}) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedAlgos.map((key) => {
          const algoSpec = algorithms[key] || { name: key };
          const viewType = algoSpec.viewType || 'array';
          const data = results[key] || {};
          const stats = data.statistics || {};
          const eventsList = data.events || [];
          const currentStep = eventsList[Math.min(stepIndex, eventsList.length - 1)] || {};
          const currentArr = array;

          const isFastest = winners.fastest.includes(key);
          const isFewest = winners.fewestComp.includes(key);

          return (
            <Card
              key={key}
              className={`p-4 space-y-3 relative overflow-hidden transition-all ${
                isFastest || isFewest ? 'border-2 border-warning shadow-medium ring-4 ring-warning/20' : ''
              }`}
            >
              {(isFastest || isFewest) && (
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-warning text-textPrimary font-heading font-bold text-[10px] flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-textPrimary" /> {isFastest ? 'FASTEST' : 'EFFICIENT'}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-textPrimary">{algoSpec.name}</span>
                <span className="text-[10px] font-mono text-textSecondary uppercase font-bold text-primary px-2 py-0.5 bg-surface border border-borderTheme rounded-full">
                  {viewType}
                </span>
              </div>

              {/* DEDICATED COMPACT RENDERER CONTAINER */}
              <div className="h-48 flex items-center justify-center bg-surface p-2 rounded-xl border border-borderTheme overflow-hidden">
                {viewType === 'array' && (
                  <ArrayRenderer currentArr={currentArr} currentEvent={currentStep} viewMode="bars_vertical" />
                )}
                {viewType === 'hashtable' && (
                  <HashRenderer currentArr={currentArr} currentEvent={currentStep} target={target} compact={true} />
                )}
                {viewType === 'tree' && (
                  <TreeRenderer currentArr={currentArr} currentEvent={currentStep} spec={algoSpec} compact={true} />
                )}
                {viewType === 'trie' && (
                  <TrieRenderer currentArr={currentArr} currentEvent={currentStep} target={target} compact={true} />
                )}
                {viewType === 'pattern' && (
                  <PatternRenderer currentArr={currentArr} currentEvent={currentStep} target={target} spec={algoSpec} compact={true} />
                )}
                {viewType === 'graph' && (
                  <GraphRenderer currentArr={currentArr} currentEvent={currentStep} spec={algoSpec} />
                )}
              </div>

              {/* Action Description */}
              <p className="text-[11px] font-mono text-textSecondary truncate text-center">
                {currentStep.desc || 'Executing search...'}
              </p>

              {/* Live Step Metrics Table */}
              <div className="space-y-1 text-[11px] font-mono border-t border-borderTheme pt-2">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Comparisons:</span>
                  <span className="font-bold text-info">{currentStep.stats?.comparisons ?? stats.comparisons ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Visited Elements:</span>
                  <span className="font-bold text-accent">{currentStep.stats?.visitedCount ?? stats.visitedCount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Pointer Moves:</span>
                  <span className="font-bold text-secondary">{currentStep.stats?.pointerMoves ?? stats.pointerMoves ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">C++ Time:</span>
                  <span className="font-bold text-success">{stats.runtimeMs || 0.0} ms</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* COMPARISON SUMMARY TABLE */}
      <Card className="p-5 space-y-4">
        <h4 className="text-xs font-heading font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" /> C++ Multi-Search Comparison Summary Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b-2 border-borderTheme text-textSecondary uppercase text-[10px]">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">View Type</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Time (ms)</th>
                <th className="py-2.5 px-3">Comparisons</th>
                <th className="py-2.5 px-3">Reads</th>
                <th className="py-2.5 px-3">Pointer Moves</th>
                <th className="py-2.5 px-3">Memory (KB)</th>
                <th className="py-2.5 px-3">Time Complexity</th>
                <th className="py-2.5 px-3">Winner Badge</th>
              </tr>
            </thead>
            <tbody>
              {selectedAlgos.map((key) => {
                const algoSpec = algorithms[key] || { name: key };
                const viewType = algoSpec.viewType || 'array';
                const data = results[key] || {};
                const stats = data.statistics || {};
                const comp = data.complexity || {};
                const found = data.found;

                const isFastest = winners.fastest.includes(key);
                const isFewest = winners.fewestComp.includes(key);

                return (
                  <tr key={key} className="border-b border-borderTheme hover:bg-surface/50">
                    <td className="py-2.5 px-3 font-heading font-bold text-textPrimary">{algoSpec.name}</td>
                    <td className="py-2.5 px-3 font-bold text-primary uppercase text-[10px]">{viewType}</td>
                    <td className="py-2.5 px-3">
                      {found ? (
                        <span className="text-success font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> FOUND
                        </span>
                      ) : (
                        <span className="text-danger font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> NOT FOUND
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-success">{stats.runtimeMs || 0.0} ms</td>
                    <td className="py-2.5 px-3 font-bold text-info">{stats.comparisons || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-primary">{stats.reads || 0}</td>
                    <td className="py-2.5 px-3 font-bold text-secondary">{stats.pointerMoves || 0}</td>
                    <td className="py-2.5 px-3 text-textSecondary">{stats.memoryUsedKb || 0.8} KB</td>
                    <td className="py-2.5 px-3 font-bold text-accent">{algoSpec.avg || comp.avgTime}</td>
                    <td className="py-2.5 px-3">
                      {isFastest ? (
                        <span className="px-2 py-0.5 rounded-full bg-warning text-textPrimary text-[10px] font-heading font-bold flex items-center gap-1 w-max">
                          <Zap className="w-3 h-3" /> FASTEST
                        </span>
                      ) : isFewest ? (
                        <span className="px-2 py-0.5 rounded-full bg-info text-white text-[10px] font-heading font-bold flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3 h-3" /> LEAST COMPARISONS
                        </span>
                      ) : (
                        <span className="text-textSecondary text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default SearchingComparisonView;
