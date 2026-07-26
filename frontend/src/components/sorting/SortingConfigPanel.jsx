import React, { useState } from 'react';
import { Sliders, BarChart2, Upload, Shuffle, Play, Layers } from 'lucide-react';
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
  isComparisonMode,
  setIsComparisonMode,
  onGenerateDataset,
  onImportCSV
}) => {
  const [csvInput, setCsvInput] = useState('');

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

  return (
    <div className="bg-card rounded-card border-2 border-borderTheme p-5 shadow-soft space-y-6 font-body">
      
      {/* Algorithm Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-primary" /> C++ Sorting Algorithms (20)
        </h3>

        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
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

      {/* Quick Sort Pivot Strategy Selector */}
      {algoKey === 'quick' && (
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

      {/* Dataset Generation & Controls */}
      <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-secondary" /> Dataset Config & Size
        </h3>

        {/* Dataset Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-heading font-bold text-textPrimary">
            <span>Array Size</span>
            <span className="text-primary font-mono">{datasetSize} Elements</span>
          </div>
          <div className="flex items-center gap-2">
            {[10, 20, 50, 100, 250].map((size) => (
              <button
                key={size}
                onClick={() => { setDatasetSize(size); onGenerateDataset('random', size); }}
                className={`flex-1 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                  datasetSize === size ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Type Generator Buttons */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Generator Presets</span>
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

      {/* View Mode & Multi-Compare Mode */}
      <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
        <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">Visualizer View Mode</label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setViewMode('bars_vertical')}
            className={`py-2 rounded-xl font-heading font-bold border transition-all ${
              viewMode === 'bars_vertical' ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
            }`}
          >
            Vertical Bars
          </button>
          <button
            onClick={() => setViewMode('cells')}
            className={`py-2 rounded-xl font-heading font-bold border transition-all ${
              viewMode === 'cells' ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
            }`}
          >
            Array Cells
          </button>
        </div>

        {/* Multi-Sort Mode Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            className={`w-full py-2.5 rounded-2xl font-heading font-bold text-xs border-2 transition-all flex items-center justify-center gap-2 ${
              isComparisonMode
                ? 'bg-secondary text-white border-secondary shadow-soft'
                : 'bg-surface text-textPrimary border-borderTheme hover:border-secondary'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isComparisonMode ? 'Exit Multi-Compare Mode' : 'Multi-Algorithm Compare Mode'}</span>
          </button>
        </div>
      </div>

      {/* Custom CSV Input */}
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
