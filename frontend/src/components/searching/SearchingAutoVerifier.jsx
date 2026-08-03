import React, { useState } from 'react';
import api from '../../api/axios';
import { Play, CheckCircle, XCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const SEARCHING_TYPES = [
  'sorted', 'random', 'target_start', 'target_mid', 'target_end', 'missing'
];

const ALGORITHMS = [
  'linear', 'binary', 'jump', 'interpolation', 'exponential', 'ternary', 'fibonacci'
];

export default function SearchingAutoVerifier({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const runVerificationSuite = async () => {
    setIsRunning(true);
    setResults([]);
    let passedCount = 0;
    let failedCount = 0;
    const allResults = [];

    for (const dataset of SEARCHING_TYPES) {
      for (const algo of ALGORITHMS) {
        try {
          // Generate dummy array based on dataset type
          let arr = [];
          let target = 45;
          if (dataset === 'sorted') { arr = [10, 20, 30, 40, 50]; target = 30; }
          else if (dataset === 'random') { arr = [50, 10, 30, 40, 20]; target = 30; }
          else if (dataset === 'target_start') { arr = [10, 20, 30, 40, 50]; target = 10; }
          else if (dataset === 'target_mid') { arr = [10, 20, 30, 40, 50]; target = 30; }
          else if (dataset === 'target_end') { arr = [10, 20, 30, 40, 50]; target = 50; }
          else if (dataset === 'missing') { arr = [10, 20, 30, 40, 50]; target = 99; }

          const res = await api.post('/searching/run', {
            algorithm: algo + '_search',
            input: arr,
            target: target,
            autoSort: algo !== 'linear'
          });

          const success = res.data?.success && res.data?.data?.events;
          const passed = success;

          if (passed) passedCount++;
          else failedCount++;

          allResults.push({
            dataset,
            algo,
            status: passed ? 'PASS' : 'FAIL',
            reason: passed ? 'OK' : 'Engine execution failed',
            stats: res.data?.data?.statistics || {}
          });
        } catch (err) {
          failedCount++;
          allResults.push({
            dataset,
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
                Automated C++ Searching Engine Verification
              </h3>
              <p className="text-xs text-muted">
                Executes automated tests across edge cases and search algorithms.
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
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background">
          {results.length === 0 && !isRunning && (
            <div className="h-40 flex flex-col items-center justify-center text-muted gap-2">
              <ShieldCheck className="w-8 h-8 opacity-20" />
              <p className="text-sm">Click "Start Test Suite" to run {SEARCHING_TYPES.length * ALGORITHMS.length} backend validations.</p>
            </div>
          )}
          
          {results.map((res, i) => (
            <Card key={i} className={`p-3 border-l-4 rounded-lg flex items-center justify-between ${
              res.status === 'PASS' 
                ? 'border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10' 
                : 'border-l-danger bg-danger/5 hover:bg-danger/10'
            }`}>
              <div className="flex items-center gap-3 w-1/3">
                {res.status === 'PASS' 
                  ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  : <XCircle className="w-5 h-5 text-danger shrink-0" />
                }
                <div>
                  <div className="text-xs font-bold font-mono text-foreground">{res.dataset.toUpperCase()}</div>
                  <div className="text-[10px] text-muted truncate">Dataset Mode</div>
                </div>
              </div>

              <div className="w-1/3">
                <div className="text-xs font-bold text-foreground capitalize">{res.algo.replace('_', ' ')} Search</div>
                <div className="text-[10px] text-muted">Algorithm</div>
              </div>

              <div className="w-1/3 flex flex-col items-end">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                  res.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-danger/20 text-danger'
                }`}>
                  {res.status}
                </span>
                <span className="text-[9px] text-muted truncate max-w-full">{res.reason}</span>
              </div>
            </Card>
          ))}
          {isRunning && (
             <div className="p-4 text-center text-muted text-sm font-mono animate-pulse flex items-center justify-center gap-2">
               <RefreshCw className="w-4 h-4 animate-spin" /> Executing next batch...
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
