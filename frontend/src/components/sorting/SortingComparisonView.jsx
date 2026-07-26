import React, { useState, useEffect } from 'react';
import { Trophy, Zap, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

export const SortingComparisonView = ({
  array,
  algorithms,
  selectedCompareAlgos = ['bubble', 'quick', 'merge', 'heap'],
  onBackToSingle
}) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAllComparisons = async () => {
    setLoading(true);
    setError(null);
    const newResults = {};

    for (const key of selectedCompareAlgos) {
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
        const res = await api.post('/sorting/run', { algorithm: algoCode, input: array });
        if (res.data?.success) {
          newResults[key] = res.data.data;
        } else {
          setError(res.data?.message || 'Error running backend sorting comparison.');
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
  }, [array, selectedCompareAlgos]);

  // Determine winner (lowest runtime or comparisons)
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
      
      {/* Header Toolbar & Back Button */}
      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBackToSingle} title="Back to Single Visualizer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Single Visualizer
          </Button>
          <div>
            <h3 className="text-sm font-heading font-bold text-textPrimary">
              Multi-Algorithm Comparison ({selectedCompareAlgos.length} Algorithms)
            </h3>
            <p className="text-xs text-textSecondary">
              Simultaneous C++ engine execution on identical array dataset of {array.length} elements.
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={runAllComparisons} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Executing C++ Engine...' : 'Re-Run Comparison'}
        </Button>
      </Card>

      {/* Error Alert if API Fails */}
      {error && (
        <div className="p-4 rounded-2xl bg-danger/15 border-2 border-danger/30 text-danger text-xs font-mono font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Comparing Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedCompareAlgos.map((key) => {
          const algoSpec = algorithms[key] || { name: key };
          const data = results[key] || {};
          const stats = data.statistics || {};
          const isWinner = winnerKey === key;

          const maxVal = Math.max(...array, 1);

          return (
            <Card
              key={key}
              className={`p-4 space-y-3 relative overflow-hidden transition-all ${
                isWinner ? 'border-2 border-warning shadow-medium ring-4 ring-warning/20' : ''
              }`}
            >
              {isWinner && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-warning text-textPrimary font-heading font-bold text-[10px] flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> WINNER
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-textPrimary">{algoSpec.name}</span>
                <span className="text-[10px] font-mono text-textSecondary">{algoSpec.avg}</span>
              </div>

              {/* Array Bars Preview */}
              <div className="h-28 flex items-end justify-center gap-1 bg-surface p-2 rounded-xl border border-borderTheme">
                {array.map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.max(10, Math.round((val / maxVal) * 100))}%` }}
                    className="w-full bg-primary rounded-t-sm opacity-80"
                  />
                ))}
              </div>

              {/* Metrics Table */}
              <div className="space-y-1 text-[11px] font-mono border-t border-borderTheme pt-2">
                <div className="flex justify-between">
                  <span className="text-textSecondary">C++ Runtime:</span>
                  <span className="font-bold text-success">{stats.runtimeMs || 0.0} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Comparisons:</span>
                  <span className="font-bold text-info">{stats.comparisons || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Swaps:</span>
                  <span className="font-bold text-accent">{stats.swaps || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Writes:</span>
                  <span className="font-bold text-primary">{stats.writes || 0}</span>
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
