import React, { useState } from 'react';
import { Sliders, BarChart2, Upload, Layers, CheckSquare, Square, Play } from 'lucide-react';
import Button from '../common/Button';

export const SortingConfigPanel = ({
  algoKey,
  setAlgoKey,
  algorithms,
  pivotStrategy,
  setPivotStrategy,
  datasetSize,
  setDatasetSize,
  viewMode,
  setViewMode,
  selectedCompareAlgos = [],
  setSelectedCompareAlgos,
  isComparisonMode,
  setIsComparisonMode,
  onRunComparison,
  onGenerateDataset,
  onImportCSV
}) => {
  const [csvInput, setCsvInput] = useState('');

  const currentSpec = algorithms[algoKey] || {};
  const allowedModes = currentSpec.allowedViewModes || [
    { key: 'bars_vertical', label: 'Vertical Bars' },
    { key: 'cells', label: 'Array Cells' }
  ];

  const handleImport = () => {
    if (!csvInput.trim()) return;
    const values = csvInput
      .split(',')
      .map(x => parseInt(x.trim()))
      .filter(x => !isNaN(x));
    if (values.length > 0) {
      onImportCSV(values);
      setCsvInput('');
    }
  };

  const toggleCompareAlgo = (key) => {
    if (selectedCompareAlgos.includes(key)) {
      if (selectedCompareAlgos.length > 2) {
        setSelectedCompareAlgos(selectedCompareAlgos.filter(k => k !== key));
      }
    } else {
      if (selectedCompareAlgos.length < 6) {
        setSelectedCompareAlgos([...selectedCompareAlgos, key]);
      }
    }
  };

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-5 shadow-soft space-y-6 font-body">
      
      {!isComparisonMode ? (
        /* SINGLE ALGORITHM SELECTOR */
        <div className="space-y-2">
          <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-primary" /> Active C++ Algorithm
          </h3>

          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {Object.keys(algorithms).map((key) => {
              const algo = algorithms[key];
              const isSelected = algoKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setAlgoKey(key)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary text-white shadow-soft shadow-primary/20'
                      : 'bg-surface text-textPrimary hover:bg-card border border-borderTheme'
                  }`}
                >
                  <span>{algo.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-card text-textSecondary border border-borderTheme'
                  }`}>
                    {algo.avg}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* MULTI-COMPARE ALGORITHM SELECTOR CHECKBOXES */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary" /> Select 2–6 Algorithms
            </h3>
            <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 bg-surface rounded-full border border-borderTheme">
              {selectedCompareAlgos.length}/6 Selected
            </span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {Object.keys(algorithms).map((key) => {
              const algo = algorithms[key];
              const isChecked = selectedCompareAlgos.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleCompareAlgo(key)}
                  className={`w-full text-left px-3 py-2 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between border ${
                    isChecked
                      ? 'bg-secondary/15 border-secondary text-textPrimary shadow-xs'
                      : 'bg-surface border-borderTheme text-textSecondary hover:bg-card'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-secondary" /> : <Square className="w-4 h-4 text-textSecondary" />}
                    <span>{algo.name}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">{algo.avg}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Sort Pivot Strategy Selector */}
      {algoKey === 'quick' && !isComparisonMode && (
        <div className="space-y-2 pt-3 border-t-2 border-borderTheme">
          <label className="text-xs font-heading font-bold text-textPrimary block">QuickSort Pivot Strategy</label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-heading font-bold">
            {['last', 'first', 'middle', 'random', 'median3'].map((strat) => (
              <button
                key={strat}
                onClick={() => setPivotStrategy(strat)}
                className={`py-1.5 rounded-xl border uppercase transition-all ${
                  pivotStrategy === strat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                {strat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dataset Size & Filters for Both Modes */}
      <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-secondary" /> Dataset Size & Pattern Filters
        </h3>

        {/* Dataset Size Buttons */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-heading font-bold text-textPrimary">
            <span>Array Size for Comparison</span>
            <span className="text-primary font-mono">{datasetSize} Elements</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[10, 20, 50, 100, 250].map((size) => (
              <button
                key={size}
                onClick={() => { setDatasetSize(size); onGenerateDataset('random', size); }}
                className={`flex-1 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                  datasetSize === size ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Generator Pattern Filters */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Input Patterns</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('random')}>
              Random
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('reverse')}>
              Reverse
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('nearly')}>
              Nearly Sorted
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('duplicates')}>
              Duplicates
            </Button>
          </div>
        </div>
      </div>

      {/* Visualizer View Mode - STRICTLY restricted to allowed options per algorithm */}
      {!isComparisonMode && allowedModes.length > 0 && (
        <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
          <div className="flex items-center justify-between">
            <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">
              {currentSpec.name} Visualizer Mode
            </label>
            <span className="text-[9px] font-mono font-bold text-primary px-2 py-0.5 bg-surface rounded-full border border-borderTheme">
              Default: {allowedModes[0].label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {allowedModes.map((m) => (
              <button
                key={m.key}
                onClick={() => setViewMode(m.key)}
                className={`py-2 rounded-xl font-heading font-bold border transition-all ${
                  viewMode === m.key ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Run Multi-Sort Comparison Trigger */}
      {isComparisonMode && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            className="w-full shadow-soft"
            onClick={onRunComparison}
          >
            <Play className="w-4 h-4 mr-1.5" /> Execute Multi-Sort Comparison
          </Button>
        </div>
      )}

      {/* Custom CSV Import */}
      <div className="space-y-2 pt-4 border-t-2 border-borderTheme">
        <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-primary" /> Import Custom CSV
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 45, 12, 89, 34"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
          />
          <Button variant="primary" size="sm" onClick={handleImport}>
            Import
          </Button>
        </div>
      </div>

    </div>
  );
};

export default SortingConfigPanel;
