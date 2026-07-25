import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  RotateCcw, 
  Shuffle, 
  Plus, 
  Trash2, 
  Search, 
  Clock, 
  Cpu, 
  Maximize2, 
  Undo, 
  Redo, 
  Sparkles, 
  ArrowRight,
  Activity,
  Info
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const Playground = () => {
  const [selectedStructure, setSelectedStructure] = useState('array');
  const [items, setItems] = useState([12, 34, 56, 78, 90, 23]);
  const [inputValue, setInputValue] = useState('');
  const [targetIndex, setTargetIndex] = useState('');
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [explanation, setExplanation] = useState({
    op: 'Initialized',
    desc: 'Array loaded with default element values.',
    time: 'O(1)',
    space: 'O(N)'
  });
  const [stats, setStats] = useState({ ops: 0, inserts: 0, deletes: 0, searches: 0 });

  // Operations
  const handleInsert = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    const idx = targetIndex !== '' ? parseInt(targetIndex) : items.length;

    setHistory([...history, { items: [...items], explanation, stats }]);
    setRedoStack([]);

    const next = [...items];
    next.splice(idx, 0, val);
    setItems(next);
    setActiveHighlight(idx);

    setExplanation({
      op: `Inserted ${val} at index ${idx}`,
      desc: `Shifted elements to the right to insert ${val} at index ${idx}.`,
      time: idx === items.length ? 'O(1)' : 'O(N)',
      space: 'O(1)'
    });
    setStats(prev => ({ ...prev, ops: prev.ops + 1, inserts: prev.inserts + 1 }));
    setInputValue('');
    setTargetIndex('');
  };

  const handleDelete = () => {
    const idx = targetIndex !== '' ? parseInt(targetIndex) : items.length - 1;
    if (items.length === 0 || idx < 0 || idx >= items.length) return;

    setHistory([...history, { items: [...items], explanation, stats }]);
    setRedoStack([]);

    const removedVal = items[idx];
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    setActiveHighlight(null);

    setExplanation({
      op: `Deleted element at index ${idx}`,
      desc: `Removed value ${removedVal} and shifted left elements to close gap.`,
      time: idx === items.length - 1 ? 'O(1)' : 'O(N)',
      space: 'O(1)'
    });
    setStats(prev => ({ ...prev, ops: prev.ops + 1, deletes: prev.deletes + 1 }));
    setTargetIndex('');
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    const idx = items.indexOf(val);
    if (idx !== -1) {
      setActiveHighlight(idx);
      setExplanation({
        op: `Found ${val} at index ${idx}`,
        desc: `Linear search scanned element by element and matched at index ${idx}.`,
        time: 'O(N)',
        space: 'O(1)'
      });
    } else {
      setActiveHighlight(null);
      setExplanation({
        op: `Search failed for ${val}`,
        desc: `Scanned all ${items.length} elements, value not present in array.`,
        time: 'O(N)',
        space: 'O(1)'
      });
    }
    setStats(prev => ({ ...prev, ops: prev.ops + 1, searches: prev.searches + 1 }));
  };

  const handleRandomize = () => {
    const newItems = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    setItems(newItems);
    setActiveHighlight(null);
    setExplanation({
      op: 'Randomized Array',
      desc: 'Generated new set of 6 random array elements.',
      time: 'O(N)',
      space: 'O(N)'
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([{ items: [...items], explanation, stats }, ...redoStack]);
    setItems(prev.items);
    setExplanation(prev.explanation);
    setStats(prev.stats);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, { items: [...items], explanation, stats }]);
    setItems(next.items);
    setExplanation(next.explanation);
    setStats(next.stats);
    setRedoStack(redoStack.slice(1));
  };

  const structures = [
    { id: 'array', name: 'Array / Dynamic Array', category: 'Linear' },
    { id: 'stack', name: 'Stack (LIFO)', category: 'Linear' },
    { id: 'queue', name: 'Queue (FIFO)', category: 'Linear' },
    { id: 'linkedlist', name: 'Singly Linked List', category: 'Linear' },
    { id: 'bst', name: 'Binary Search Tree', category: 'Trees' },
    { id: 'avl', name: 'AVL Tree', category: 'Trees' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 py-2">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Data Structure Playground</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Interactive sandbox to manipulate, inspect, and benchmark data structures in real-time.
            </p>
          </div>

          {/* Canvas Controls Toolbar */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleUndo} 
              disabled={history.length === 0} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoStack.length === 0} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRandomize} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all"
              title="Randomize Data"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Selector, Canvas & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Selector Sidebar */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Select Structure</h3>
            <div className="space-y-1.5">
              {structures.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStructure(s.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    selectedStructure === s.id
                      ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20'
                      : 'text-gray-600 hover:bg-gray-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedStructure === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {s.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas & Interactive Playground */}
          <div className="lg:col-span-9 space-y-6">

            {/* Visualizer Box */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs min-h-[320px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3 mb-6">
                <span>CANVAS: {selectedStructure.toUpperCase()}</span>
                <span>SIZE: {items.length} ELEMENTS</span>
              </div>

              {/* Elements Renderer */}
              <div className="flex items-center justify-center gap-3 py-10 flex-wrap">
                <AnimatePresence>
                  {items.map((val, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`relative flex flex-col items-center group`}
                    >
                      {/* Element Card */}
                      <div className={`w-14 h-16 rounded-2xl flex items-center justify-center text-lg font-bold font-mono transition-all duration-300 shadow-sm ${
                        activeHighlight === idx
                          ? 'bg-gradient-to-br from-accent to-pink-500 text-white shadow-lg shadow-accent/30 scale-110 ring-4 ring-accent/20'
                          : 'bg-gradient-to-br from-primary/10 via-primary/5 to-white border border-primary/20 text-primary'
                      }`}>
                        {val}
                      </div>
                      {/* Index Badge */}
                      <span className="text-[11px] font-mono font-medium text-gray-400 mt-2">
                        [{idx}]
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Controls Form Bar */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                <input 
                  type="number"
                  placeholder="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full sm:w-28 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <input 
                  type="number"
                  placeholder="Index (opt)"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-full sm:w-28 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button onClick={handleInsert} variant="primary" className="py-2 text-xs flex-1 sm:flex-none">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Insert
                  </Button>
                  <Button onClick={handleDelete} variant="outline" className="py-2 text-xs flex-1 sm:flex-none">
                    <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Delete
                  </Button>
                  <Button onClick={handleSearch} variant="outline" className="py-2 text-xs flex-1 sm:flex-none">
                    <Search className="w-3.5 h-3.5 mr-1" /> Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Explanation & Complexity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Operation Explanation */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold font-poppins text-gray-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" /> Live Explanation
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono">{explanation.op}</span>
                </div>
                <p className="text-xs text-gray-600 font-inter leading-relaxed">{explanation.desc}</p>
              </div>

              {/* Complexity Card */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3">
                <h4 className="text-sm font-bold font-poppins text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" /> Complexity Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
                    <p className="text-[11px] text-gray-500 font-inter">Time Complexity</p>
                    <p className="text-lg font-bold font-mono text-primary mt-0.5">{explanation.time}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-center">
                    <p className="text-[11px] text-gray-500 font-inter">Space Complexity</p>
                    <p className="text-lg font-bold font-mono text-accent mt-0.5">{explanation.space}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default Playground;
