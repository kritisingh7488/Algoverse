import React, { useState } from 'react';
import { Sliders, Search, Target, Upload, Layers, CheckSquare, Square, Play, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../common/Button';

export const SearchingConfigPanel = ({
  algoKey,
  setAlgoKey,
  algorithms,
  target,
  setTarget,
  datasetSize,
  setDatasetSize,
  viewMode,
  setViewMode,
  autoSort,
  setAutoSort,
  showMid,
  setShowMid,
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
      
      {/* Target Value Input */}
      <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
        <label className="text-xs font-heading font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-accent" /> Search Target Value
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono font-bold text-textPrimary focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {!isComparisonMode ? (
        /* SINGLE ALGORITHM SELECTOR */
        <div className="space-y-2 pt-2 border-t-2 border-borderTheme">
          <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-primary" /> C++ Search Algorithms (20)
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
                  <div className="flex items-center gap-2 truncate">
                    <span>{algo.name}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-card text-textSecondary border border-borderTheme'
                  }`}>
                    {algo.viewType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* MULTI-COMPARE ALGORITHM CHECKBOXES */
        <div className="space-y-3 pt-2 border-t-2 border-borderTheme">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary" /> Pick 2–6 Algorithms
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

      {/* Dataset Controls & Filters */}
      <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-secondary" /> Dataset Size & Pattern Filters
        </h3>

        {/* Dataset Size Buttons */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-heading font-bold text-textPrimary">
            <span>Array Size</span>
            <span className="text-primary font-mono">{datasetSize} Elements</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[10, 20, 50, 100, 250].map((size) => (
              <button
                key={size}
                onClick={() => { setDatasetSize(size); onGenerateDataset('sorted', size); }}
                className={`flex-1 py-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                  datasetSize === size ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Target Position & Pattern Presets */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Target Placement Filters</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('target_start')}>
              Target at Start
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('target_mid')}>
              Target at Mid
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('target_end')}>
              Target at End
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGenerateDataset('missing')}>
              Missing Target
            </Button>
          </div>
        </div>
      </div>

      {/* Special Configuration Toggles */}
      {!isComparisonMode && (
        <div className="space-y-2.5 pt-4 border-t-2 border-borderTheme">
          <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">Special Search Config</label>
          <div className="flex items-center justify-between text-xs font-body text-textPrimary">
            <span>Auto-Sort Before Search</span>
            <button onClick={() => setAutoSort(!autoSort)} className="text-primary">
              {autoSort ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6 text-textSecondary" />}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-body text-textPrimary">
            <span>Show Mid Calculation</span>
            <button onClick={() => setShowMid(!showMid)} className="text-primary">
              {showMid ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6 text-textSecondary" />}
            </button>
          </div>
        </div>
      )}

      {/* Visualizer View Mode Selector ONLY for Array Search algorithms */}
      {!isComparisonMode && currentSpec?.viewType === 'array' && (
        <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
          <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider block">Array View Mode</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setViewMode('cells')}
              className={`py-2 rounded-xl font-heading font-bold border transition-all ${
                viewMode === 'cells' ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
              }`}
            >
              Array Cells
            </button>
            <button
              onClick={() => setViewMode('bars_vertical')}
              className={`py-2 rounded-xl font-heading font-bold border transition-all ${
                viewMode === 'bars_vertical' ? 'bg-primary text-white border-primary' : 'bg-surface text-textPrimary border-borderTheme'
              }`}
            >
              Vertical Bars
            </button>
          </div>
        </div>
      )}

      {/* Run Multi-Search Comparison Trigger */}
      {isComparisonMode && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            className="w-full shadow-soft"
            onClick={onRunComparison}
          >
            <Play className="w-4 h-4 mr-1.5" /> Execute Multi-Search Comparison
          </Button>
        </div>
      )}

      {/* Custom CSV Input */}
      <div className="space-y-2 pt-4 border-t-2 border-borderTheme">
        <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-primary" /> Import Custom CSV
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 12, 24, 36, 48"
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

export default SearchingConfigPanel;
