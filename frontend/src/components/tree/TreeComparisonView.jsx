import React, { useState } from 'react';
import { GitFork, ArrowLeft, CheckCircle2, XCircle, Briefcase, Trophy, Sliders, CheckSquare, Square } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export const TreeComparisonView = ({
  specs = {},
  onBackToSingle
}) => {
  const [selectedKeys, setSelectedKeys] = useState(['bst', 'avl', 'redblack', 'trie', 'segment']);

  const toggleKey = (key) => {
    if (selectedKeys.includes(key)) {
      if (selectedKeys.length > 2) {
        setSelectedKeys(selectedKeys.filter(k => k !== key));
      }
    } else {
      if (selectedKeys.length < 6) {
        setSelectedKeys([...selectedKeys, key]);
      }
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Header Card */}
      <Card className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBackToSingle} title="Back to Single Visualizer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Single Visualizer
          </Button>
          <div>
            <h3 className="text-sm font-heading font-bold text-textPrimary">
              Multi-Tree Comparison Studio ({selectedKeys.length} Selected)
            </h3>
            <p className="text-xs text-textSecondary">
              Architectural trade-offs, balancing rules, time & space complexity, pros/cons, and real-world applications.
            </p>
          </div>
        </div>
      </Card>

      {/* Checkbox Selector for Trees */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" /> Select 2–6 Trees to Compare
          </h4>
          <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 bg-surface rounded-full border border-borderTheme">
            {selectedKeys.length}/6 Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.keys(specs).map((key) => {
            const spec = specs[key];
            const isChecked = selectedKeys.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleKey(key)}
                className={`px-3 py-2 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between border ${
                  isChecked
                    ? 'bg-primary/15 border-primary text-primary shadow-xs'
                    : 'bg-surface border-borderTheme text-textSecondary hover:bg-card'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-primary shrink-0" /> : <Square className="w-3.5 h-3.5 text-textSecondary shrink-0" />}
                  <span className="truncate">{spec.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Detailed Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedKeys.map((key) => {
          const spec = specs[key] || { name: key };
          return (
            <Card key={key} className="p-5 space-y-4 flex flex-col justify-between border-2 border-borderTheme hover:border-primary/50 transition-all">
              
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-borderTheme pb-3">
                  <div>
                    <h3 className="text-sm font-heading font-bold text-textPrimary">{spec.name}</h3>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">{spec.category}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface border border-borderTheme font-mono text-[11px] font-bold text-textSecondary">
                    Space: {spec.space}
                  </span>
                </div>

                {/* Performance Metrics Pills */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono font-bold">
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[8px] block uppercase">Search</span>
                    <span className="text-success">{spec.search}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[8px] block uppercase">Insert</span>
                    <span className="text-info">{spec.insert}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[8px] block uppercase">Delete</span>
                    <span className="text-accent">{spec.delete}</span>
                  </div>
                </div>

                {/* ✅ ADVANTAGES */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-heading font-bold text-success uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages
                  </span>
                  <ul className="space-y-1 text-xs text-textPrimary">
                    {(spec.advantages || ['Guaranteed height balance', 'O(log N) lookups']).map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-success font-bold shrink-0">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ❌ DISADVANTAGES */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-heading font-bold text-accent uppercase flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Disadvantages & Overhead
                  </span>
                  <ul className="space-y-1 text-xs text-textSecondary">
                    {(spec.disadvantages || ['Rotation rebalance cost', 'Memory overhead']).map((dis, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-accent font-bold shrink-0">•</span>
                        <span>{dis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🎯 REAL-WORLD USES */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-heading font-bold text-primary uppercase flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Real-World Applications
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(spec.realWorldUses || ['Database Indexing', 'Autocomplete']).map((use, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-surface border border-borderTheme text-[10px] font-mono font-bold text-textPrimary">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Intuition Tip */}
              <div className="p-3 rounded-xl bg-surface border border-borderTheme text-[11px] text-textSecondary italic mt-3">
                💡 "{spec.intuition}"
              </div>

            </Card>
          );
        })}
      </div>

      {/* SUMMARY COMPARISON MATRIX TABLE */}
      <Card className="p-5 space-y-4">
        <h4 className="text-xs font-heading font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" /> Tree Architecture Comparison Summary Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b-2 border-borderTheme text-textSecondary uppercase text-[10px]">
                <th className="py-2.5 px-3">Tree Type</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Search Time</th>
                <th className="py-2.5 px-3">Insertion Time</th>
                <th className="py-2.5 px-3">Deletion Time</th>
                <th className="py-2.5 px-3">Space Complexity</th>
                <th className="py-2.5 px-3">Primary Strengths</th>
              </tr>
            </thead>
            <tbody>
              {selectedKeys.map((key) => {
                const spec = specs[key] || { name: key };
                return (
                  <tr key={key} className="border-b border-borderTheme hover:bg-surface/50">
                    <td className="py-2.5 px-3 font-heading font-bold text-textPrimary">{spec.name}</td>
                    <td className="py-2.5 px-3 text-textSecondary">{spec.category}</td>
                    <td className="py-2.5 px-3 font-bold text-success">{spec.search}</td>
                    <td className="py-2.5 px-3 font-bold text-info">{spec.insert}</td>
                    <td className="py-2.5 px-3 font-bold text-accent">{spec.delete}</td>
                    <td className="py-2.5 px-3 text-textSecondary">{spec.space}</td>
                    <td className="py-2.5 px-3 text-[11px] text-textPrimary">
                      {(spec.advantages && spec.advantages[0]) || 'Fast lookup operations'}
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

export default TreeComparisonView;
