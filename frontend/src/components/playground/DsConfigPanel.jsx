import React, { useState } from 'react';
import { Layers, Shuffle, Trash2, Sliders, Upload, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

export const DsConfigPanel = ({
  structureKey,
  setStructureKey,
  specs,
  config,
  setConfig,
  onReset,
  onClear,
  onRandomize,
  onImportCSV,
  onLoadPreset
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
      
      {/* Data Structure Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" /> Data Structures ({Object.keys(specs).length})
        </h3>
        
        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          {Object.keys(specs).map((key) => {
            const spec = specs[key];
            const isSelected = structureKey === key;
            return (
              <button
                key={key}
                onClick={() => setStructureKey(key)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary text-white shadow-soft shadow-primary/20'
                    : 'bg-surface text-textPrimary hover:bg-card border border-borderTheme'
                }`}
              >
                <span>{spec.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-card text-textSecondary border border-borderTheme'
                }`}>
                  {spec.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structure Configurations */}
      <div className="space-y-3 pt-4 border-t-2 border-borderTheme">
        <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-secondary" /> Engine Configuration
        </h3>

        {/* Stack & Queue Capacity Controls */}
        {(structureKey === 'stack' || structureKey === 'queue' || structureKey === 'cqueue' || structureKey === 'deque') && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-heading font-bold text-textPrimary">
              <span>Max Structure Capacity</span>
              <span className="text-primary font-mono">{config.capacity || 8}</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              value={config.capacity || 8}
              onChange={(e) => setConfig({ ...config, capacity: parseInt(e.target.value) })}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        )}

        {/* Priority Queue / Heap Controls */}
        {(structureKey === 'priorityqueue' || structureKey === 'minheap' || structureKey === 'maxheap') && (
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-textPrimary block">Heap Property Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfig({ ...config, heapType: 'min' })}
                className={`py-1.5 rounded-xl text-xs font-heading font-bold border transition-all ${
                  config.heapType === 'min' || structureKey === 'minheap'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                Min Heap
              </button>
              <button
                onClick={() => setConfig({ ...config, heapType: 'max' })}
                className={`py-1.5 rounded-xl text-xs font-heading font-bold border transition-all ${
                  config.heapType === 'max' || structureKey === 'maxheap'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-textPrimary border-borderTheme'
                }`}
              >
                Max Heap
              </button>
            </div>
          </div>
        )}

        {/* Presets Generator */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-heading font-bold text-textSecondary uppercase">Presets</span>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onLoadPreset('sorted')}>
              Sorted
            </Button>
            <Button variant="outline" size="sm" onClick={() => onLoadPreset('reverse')}>
              Reverse
            </Button>
            <Button variant="outline" size="sm" onClick={() => onLoadPreset('nearly')}>
              Nearly Sorted
            </Button>
            <Button variant="outline" size="sm" onClick={() => onLoadPreset('duplicates')}>
              Duplicates
            </Button>
          </div>
        </div>
      </div>

      {/* CSV & Manual Input */}
      <div className="space-y-2 pt-4 border-t-2 border-borderTheme">
        <label className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-primary" /> Import CSV / Custom
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 15, 30, 45, 60"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
          />
          <Button variant="primary" size="sm" onClick={handleImport}>
            Import
          </Button>
        </div>
      </div>

      {/* Global Actions */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t-2 border-borderTheme">
        <Button variant="outline" size="sm" onClick={onRandomize} title="Randomize Elements">
          <Shuffle className="w-3.5 h-3.5" /> Random
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} title="Reset Initial State">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </Button>
        <Button variant="danger" size="sm" onClick={onClear} title="Clear All Elements">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </Button>
      </div>

    </div>
  );
};

export default DsConfigPanel;
