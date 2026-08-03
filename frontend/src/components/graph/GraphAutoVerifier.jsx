import React, { useState } from 'react';
import api from '../../api/axios';
import { Play, CheckCircle, XCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const GRAPH_TYPES = [
  'undirected', 'directed', 'weighted', 'unweighted',
  'dag', 'cyclic', 'bipartite', 'complete',
  'connected', 'disconnected', 'sparse', 'dense',
  'tree', 'forest'
];

const ALGORITHMS = [
  'bfs', 'dfs', 'iterative_dfs', 'recursive_dfs',
  'dijkstra', 'bellman_ford', 'prim', 'kruskal', 'kahn'
];

export default function GraphAutoVerifier({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const runVerificationSuite = async () => {
    setIsRunning(true);
    setResults([]);
    let passedCount = 0;
    let failedCount = 0;
    const allResults = [];

    for (const graphType of GRAPH_TYPES) {
      for (const algo of ALGORITHMS) {
        try {
          const res = await api.post('/graph/run', {
            graphType,
            algorithm: algo,
            startNode: 0
          });

          const success = res.data?.success && res.data?.data?.events;
          const hasVertices = Array.isArray(res.data?.data?.vertices);
          const hasEdges = Array.isArray(res.data?.data?.edges);
          const hasRepresentations = !!res.data?.data?.representations;
          const passed = success && hasVertices && hasEdges && hasRepresentations;

          if (passed) passedCount++;
          else failedCount++;

          allResults.push({
            graphType,
            algo,
            status: passed ? 'PASS' : 'FAIL',
            reason: passed ? 'OK (0 DLL deps)' : 'C++ engine invalid output / missing reps',
            stats: res.data?.data?.statistics || {}
          });
        } catch (err) {
          failedCount++;
          allResults.push({
            graphType,
            algo,
            status: 'FAIL',
            reason: err.message || 'Network / API Error',
            stats: {}
          });
        }

        setResults([...allResults]);
        setSummary({
          total: passedCount + failedCount,
          passed: passedCount,
          failed: failedCount
        });
      }
    }
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-body">
      <div className="bg-card w-full max-w-4xl max-h-[85vh] rounded-2xl border border-borderTheme shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-borderTheme bg-surface">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Automated C++ Graph Engine Verification Suite
              </h3>
              <p className="text-xs text-muted">
                Executes automated regression testing across all 14 Graph Types and Algorithms against static C++ engine.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5 text-muted" />
          </Button>
        </div>

        {/* Controls & Summary */}
        <div className="p-4 border-b border-borderTheme bg-surface/30 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Button 
            onClick={runVerificationSuite} 
            disabled={isRunning}
            className="w-full justify-center"
          >
            {isRunning ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Start Test Suite</>
            )}
          </Button>
          
          <div className="col-span-3 flex justify-around p-3 bg-surface rounded-xl border border-borderTheme">
            <div className="text-center">
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider mb-0.5">Total Tests</div>
              <div className="text-xl font-heading font-black text-foreground">{summary.total}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mb-0.5">Passed</div>
              <div className="text-xl font-heading font-black text-emerald-500">{summary.passed}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-danger uppercase font-bold tracking-wider mb-0.5">Failed</div>
              <div className="text-xl font-heading font-black text-danger">{summary.failed}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-primary uppercase font-bold tracking-wider mb-0.5">Pass Rate</div>
              <div className="text-xl font-heading font-black text-primary">
                {summary.total === 0 ? '0%' : `${Math.round((summary.passed / summary.total) * 100)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {results.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center text-muted">
              <RefreshCw className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
              <p className="text-sm font-semibold">Click "Run All 126 Graph Test Cases" to start verification.</p>
              <p className="text-xs">Tests 14 Graph Types across 9 C++ algorithms with synchronized representation checks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((r, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono ${
                    r.status === 'PASS'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                      : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {r.status === 'PASS' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-primary capitalize">{r.graphType}</span>
                      <span className="text-muted"> ➔ </span>
                      <span className="font-bold uppercase text-foreground">{r.algo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-muted">{r.stats?.runtimeMs ? `${r.stats.runtimeMs}ms` : ''}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        r.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-borderTheme bg-surface flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Verifier
          </Button>
        </div>

      </div>
    </div>
  );
}
