import React, { useState } from 'react';
import api from '../../api/axios';
import { Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const TREE_TYPES = [
  'binary', 'bst', 'avl', 'redblack',
  'minheap', 'maxheap', 'trie', 'segment',
  'fenwick', 'huffman', 'btree', 'bplus'
];

const DATA_TYPES = ['Integer', 'Character', 'String'];

const OPERATIONS = [
  'insert', 'delete', 'search',
  'inorder', 'preorder', 'postorder', 'levelorder',
  'height', 'depth', 'diameter', 'validate', 'balance',
  'lca', 'successor', 'predecessor', 'mirror', 'serialize',
  'pathsum', 'countnodes', 'countleaves'
];

export default function TreeAutoVerifier({ onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const runVerificationSuite = async () => {
    setIsRunning(true);
    setResults([]);
    let passedCount = 0;
    let failedCount = 0;
    const allResults = [];

    for (const treeType of TREE_TYPES) {
      for (const dataType of DATA_TYPES) {
        // Test core operations
        for (const op of OPERATIONS) {
          const sampleInput = dataType === 'Character'
            ? ['M', 'F', 'S', 'B', 'H', 'P', 'W']
            : dataType === 'String'
            ? ['Apple', 'Banana', 'Cherry', 'Mango']
            : [50, 25, 75, 10, 30, 60, 90];

          try {
            const res = await api.post('/tree/run', {
              treeType,
              opName: op,
              val: dataType === 'Character' ? 'S' : dataType === 'String' ? 'Cherry' : '30',
              input: sampleInput,
              dataType
            });

            const success = res.data?.success && res.data?.data?.events;
            const hasNodes = Array.isArray(res.data?.data?.events?.[0]?.nodes);
            const hasEdges = Array.isArray(res.data?.data?.events?.[0]?.edges);
            const passed = success && hasNodes && hasEdges;

            if (passed) passedCount++;
            else failedCount++;

            allResults.push({
              treeType,
              dataType,
              op,
              status: passed ? 'PASS' : 'FAIL',
              details: passed ? 'C++ Engine returned nodes & edges' : 'Invalid payload format'
            });
          } catch (err) {
            failedCount++;
            allResults.push({
              treeType,
              dataType,
              op,
              status: 'FAIL',
              details: err.message || 'API Error'
            });
          }
        }
      }
    }

    setResults(allResults);
    setSummary({
      total: allResults.length,
      passed: passedCount,
      failed: failedCount
    });
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              C++ Engine Automated Verification Mode
            </h3>
            <p className="text-xs text-slate-400">
              Executes all operations across all 12 tree types in Integer, Character, and String modes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            Close
          </button>
        </div>

        {/* Action & Summary */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <button
            onClick={runVerificationSuite}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running Verification...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Full Test Suite
              </>
            )}
          </button>

          {summary.total > 0 && (
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-slate-300">Total: {summary.total}</span>
              <span className="text-emerald-400">Passed: {summary.passed}</span>
              <span className="text-rose-400">Failed: {summary.failed}</span>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500">
              <p className="text-sm">No verification results yet.</p>
              <p className="text-xs mt-1">Click &quot;Run Full Test Suite&quot; to begin testing.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs">
                  <th className="py-2 px-3">Tree Type</th>
                  <th className="py-2 px-3">Data Type</th>
                  <th className="py-2 px-3">Operation</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {results.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold text-slate-200 capitalize">{res.treeType}</td>
                    <td className="py-2 px-3 text-slate-300">{res.dataType}</td>
                    <td className="py-2 px-3 text-cyan-400 font-mono">{res.op}</td>
                    <td className="py-2 px-3">
                      {res.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{res.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
