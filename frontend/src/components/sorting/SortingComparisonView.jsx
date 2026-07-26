import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Clock, Activity, RefreshCcw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import api from '../../api/axios';

export const SortingComparisonView = ({ array, algorithms }) => {
  const [selectedAlgos, setSelectedAlgos] = useState(['bubble', 'quick', 'merge', 'insertion']);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runAllComparisons = async () => {
    setLoading(true);
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
          counting: 'counting_sort'
        };

        const algoCode = algoNameMap[key] || `${key}_sort`;
        const res = await api.post('/sorting/run', { algorithm: algoCode, input: array });
        if (res.data?.success) {
          newResults[key] = res.data.data;
        }
      } catch (err) {
        console.error(`Comparison error for ${key}:`, err);
      }
    }
    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    runAllComparisons();
  }, [array, selectedAlgos]);

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
      
      {/* Comparison Selector */}
      <Card className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-heading font-bold text-textPrimary">Simultaneous Multi-Sort Comparison Engine</h3>
          <p className="text-xs text-textSecondary">Comparing execution efficiency across identical input array of {array.length} elements.</p>
        </div>
        <Button variant="primary" size="sm" onClick={runAllComparisons} disabled={loading}>
          <Zap className="w-3.5 h-3.5 mr-1" /> {loading ? 'Running...' : 'Re-Run Comparison'}
        </Button>
      </Card>

      {/* Grid of Comparing Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedAlgos.map((key) => {
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

              {/* Miniature Array Bars Preview */}
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
                  <span className="text-textSecondary">Execution Time:</span>
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
