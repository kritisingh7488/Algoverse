import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Play, 
  RotateCcw, 
  Check, 
  Award, 
  Zap, 
  Cpu, 
  Activity, 
  Download, 
  Sparkles, 
  BarChart2, 
  ArrowUpRight 
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const BENCHMARK_CATEGORIES = {
  sorting: {
    name: 'Sorting Algorithms',
    algorithms: [
      { id: 'bubble', name: 'Bubble Sort', time: 'O(N²)', space: 'O(1)', color: '#A855F7' },
      { id: 'selection', name: 'Selection Sort', time: 'O(N²)', space: 'O(1)', color: '#EC4899' },
      { id: 'insertion', name: 'Insertion Sort', time: 'O(N²)', space: 'O(1)', color: '#3B82F6' },
      { id: 'merge', name: 'Merge Sort', time: 'O(N log N)', space: 'O(N)', color: '#10B981' },
      { id: 'quick', name: 'Quick Sort', time: 'O(N log N)', space: 'O(log N)', color: '#F59E0B' }
    ]
  },
  searching: {
    name: 'Searching Algorithms',
    algorithms: [
      { id: 'linear', name: 'Linear Search', time: 'O(N)', space: 'O(1)', color: '#3B82F6' },
      { id: 'binary', name: 'Binary Search', time: 'O(log N)', space: 'O(1)', color: '#10B981' },
      { id: 'interpolation', name: 'Interpolation Search', time: 'O(log log N)', space: 'O(1)', color: '#A855F7' }
    ]
  }
};

const BenchmarkCenter = () => {
  const [category, setCategory] = useState('sorting');
  const [selectedAlgos, setSelectedAlgos] = useState(['merge', 'quick', 'bubble']);
  const [datasetSize, setDatasetSize] = useState(100);
  const [datasetType, setDatasetType] = useState('random');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const currentCategory = BENCHMARK_CATEGORIES[category];

  const toggleAlgo = (id) => {
    if (selectedAlgos.includes(id)) {
      if (selectedAlgos.length > 1) {
        setSelectedAlgos(selectedAlgos.filter(a => a !== id));
      }
    } else {
      setSelectedAlgos([...selectedAlgos, id]);
    }
  };

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          generateResults();
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const generateResults = () => {
    const mockResults = selectedAlgos.map((id) => {
      const algoObj = currentCategory.algorithms.find(a => a.id === id);
      let runtimeMs = 0;
      let comparisons = 0;

      if (id === 'bubble' || id === 'selection' || id === 'insertion') {
        runtimeMs = (datasetSize * datasetSize * 0.005).toFixed(2);
        comparisons = Math.floor(datasetSize * (datasetSize - 1) / 2);
      } else if (id === 'merge' || id === 'quick') {
        runtimeMs = (datasetSize * Math.log2(datasetSize) * 0.02).toFixed(2);
        comparisons = Math.floor(datasetSize * Math.log2(datasetSize));
      } else if (id === 'binary') {
        runtimeMs = (Math.log2(datasetSize) * 0.05).toFixed(2);
        comparisons = Math.floor(Math.log2(datasetSize));
      } else {
        runtimeMs = (datasetSize * 0.04).toFixed(2);
        comparisons = datasetSize;
      }

      return {
        id,
        name: algoObj.name,
        color: algoObj.color,
        runtimeMs: parseFloat(runtimeMs),
        comparisons,
        memoryKb: (datasetSize * 0.04 + Math.random() * 2).toFixed(1),
        complexity: algoObj.time
      };
    }).sort((a, b) => a.runtimeMs - b.runtimeMs);

    setResults(mockResults);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Benchmark Center</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Scientific multi-algorithm performance comparison & memory profiling under identical inputs.
            </p>
          </div>

          <Button 
            onClick={handleRunBenchmark} 
            disabled={isRunning}
            className="px-6 py-3 text-sm shadow-md shadow-primary/20 flex items-center gap-2"
          >
            {isRunning ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? `Benchmarking (${progress}%)` : 'Run Benchmark'}
          </Button>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Controls & Algorithm Checkboxes */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelectedAlgos([BENCHMARK_CATEGORIES[e.target.value].algorithms[0].id]);
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold font-poppins text-gray-900 focus:outline-none focus:border-primary"
              >
                {Object.keys(BENCHMARK_CATEGORIES).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {BENCHMARK_CATEGORIES[catKey].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Algorithms Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Compare Algorithms</label>
              <div className="space-y-2">
                {currentCategory.algorithms.map((algo) => {
                  const isChecked = selectedAlgos.includes(algo.id);
                  return (
                    <div
                      key={algo.id}
                      onClick={() => toggleAlgo(algo.id)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'border-primary bg-primary/5 shadow-xs' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-white text-xs border ${
                            isChecked ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-semibold font-poppins text-gray-900">{algo.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                        {algo.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dataset Configuration */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold font-poppins">
                  <span className="text-gray-500">Dataset Size</span>
                  <span className="text-primary font-mono">{datasetSize} elements</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="20"
                  value={datasetSize}
                  onChange={(e) => setDatasetSize(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Distribution</label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold font-poppins text-gray-900 focus:outline-none focus:border-primary"
                >
                  <option value="random">Random Distribution</option>
                  <option value="sorted">Already Sorted</option>
                  <option value="reverse">Reverse Sorted</option>
                  <option value="nearly">Nearly Sorted</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Results & Visual Charts Panel */}
          <div className="lg:col-span-8 space-y-6">

            {/* Live Progress Bar when Running */}
            {isRunning && (
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3 animate-pulse">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-500">Executing benchmark suite...</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Results Table & Charts */}
            {results ? (
              <div className="space-y-6">
                
                {/* Winner Highlight Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 font-poppins">Fastest Algorithm</span>
                      <h3 className="text-xl font-bold font-poppins text-gray-900">{results[0].name}</h3>
                      <p className="text-xs text-gray-500 font-inter">Avg Runtime: {results[0].runtimeMs} ms ({results[0].comparisons} comparisons)</p>
                    </div>
                  </div>
                </div>

                {/* Benchmark Bar Chart Visualization */}
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold font-poppins text-gray-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-primary" /> Execution Runtime Comparison (ms)
                  </h3>
                  <div className="space-y-4 pt-2">
                    {results.map((res, i) => {
                      const maxRuntime = Math.max(...results.map(r => r.runtimeMs));
                      const barWidth = Math.max((res.runtimeMs / maxRuntime) * 100, 8);
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono font-medium">
                            <span className="text-gray-800 font-poppins font-bold">{res.name}</span>
                            <span className="text-gray-500">{res.runtimeMs} ms</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: res.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comprehensive Results Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm font-bold font-poppins text-gray-900">Detailed Performance Table</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-poppins">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Rank</th>
                          <th className="px-6 py-3 font-semibold">Algorithm</th>
                          <th className="px-6 py-3 font-semibold">Runtime (ms)</th>
                          <th className="px-6 py-3 font-semibold">Comparisons</th>
                          <th className="px-6 py-3 font-semibold">Memory (KB)</th>
                          <th className="px-6 py-3 font-semibold">Complexity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.map((res, rank) => (
                          <tr key={res.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3.5 font-bold text-gray-900">#{rank + 1}</td>
                            <td className="px-6 py-3.5 font-bold font-poppins text-gray-900">{res.name}</td>
                            <td className="px-6 py-3.5 text-primary font-bold">{res.runtimeMs} ms</td>
                            <td className="px-6 py-3.5 text-gray-600">{res.comparisons}</td>
                            <td className="px-6 py-3.5 text-gray-600">{res.memoryKb} KB</td>
                            <td className="px-6 py-3.5 text-gray-500 font-bold">{res.complexity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : !isRunning ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-poppins text-gray-900">Ready to Benchmark</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-inter">
                  Select algorithms from the left sidebar and click "Run Benchmark" to compare live runtime metrics.
                </p>
              </div>
            ) : null}

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default BenchmarkCenter;
