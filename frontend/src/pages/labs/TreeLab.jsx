import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  Play, 
  RotateCcw, 
  Code, 
  Activity, 
  Layers, 
  Sparkles,
  Search
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/common/Button';

const TREE_TYPES = {
  bst: {
    name: 'Binary Search Tree',
    category: 'Hierarchical',
    search: 'O(log N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      'function insert(node, val):',
      '  if node is null: return new Node(val)',
      '  if val < node.val: node.left = insert(node.left, val)',
      '  else: node.right = insert(node.right, val)',
      '  return node'
    ]
  },
  avl: {
    name: 'AVL Tree',
    category: 'Self-Balancing',
    search: 'O(log N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      'function insertAVL(node, val):',
      '  node = bstInsert(node, val)',
      '  balance = getBalance(node)',
      '  if balance > 1 and val < node.left.val: return rightRotate(node)',
      '  if balance < -1 and val > node.right.val: return leftRotate(node)',
      '  return node'
    ]
  }
};

const TreeLab = () => {
  const [treeType, setTreeType] = useState('bst');
  const [nodes, setNodes] = useState([
    { id: 1, val: 50, x: 250, y: 50, parent: null },
    { id: 2, val: 30, x: 150, y: 130, parent: 1 },
    { id: 3, val: 70, x: 350, y: 130, parent: 1 },
    { id: 4, val: 20, x: 100, y: 210, parent: 2 },
    { id: 5, val: 40, x: 200, y: 210, parent: 2 },
    { id: 6, val: 60, x: 300, y: 210, parent: 3 },
    { id: 7, val: 80, x: 400, y: 210, parent: 3 }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeLine, setActiveLine] = useState(0);

  const currentSpec = TREE_TYPES[treeType];

  const handleInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;

    // Add node visualization
    const newNode = {
      id: Date.now(),
      val,
      x: 250 + (Math.random() - 0.5) * 200,
      y: 210 + Math.random() * 40,
      parent: 1
    };

    setNodes([...nodes, newNode]);
    setActiveHighlight(newNode.id);
    setInputVal('');
  };

  const handleTraverse = (type) => {
    let result = [];
    if (type === 'inorder') {
      result = [20, 30, 40, 50, 60, 70, 80];
    } else if (type === 'preorder') {
      result = [50, 30, 20, 40, 70, 60, 80];
    } else {
      result = [20, 40, 30, 60, 80, 70, 50];
    }

    setTraversalResult([]);
    result.forEach((val, i) => {
      setTimeout(() => {
        setTraversalResult((prev) => [...prev, val]);
      }, (i + 1) * 500);
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <GitFork className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Tree Laboratory</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Visualize hierarchical structures, balance rotations, and tree traversals in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => handleTraverse('inorder')} variant="outline" className="text-xs py-2">
              In-Order
            </Button>
            <Button onClick={() => handleTraverse('preorder')} variant="outline" className="text-xs py-2">
              Pre-Order
            </Button>
            <Button onClick={() => handleTraverse('postorder')} variant="outline" className="text-xs py-2">
              Post-Order
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Selector */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Tree Type</h3>
            <div className="space-y-2">
              {Object.keys(TREE_TYPES).map((key) => {
                const item = TREE_TYPES[key];
                return (
                  <button
                    key={key}
                    onClick={() => setTreeType(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      treeType === key
                        ? 'border-primary bg-primary/5 text-primary font-semibold shadow-xs'
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-poppins font-bold">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 font-mono">{item.search}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block font-inter">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas & Controls */}
          <div className="lg:col-span-6 space-y-6">

            {/* Tree Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[360px] relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CANVAS: {currentSpec.name.toUpperCase()}</span>
                <span>NODES: {nodes.length}</span>
              </div>

              {/* SVG Tree Nodes & Edges */}
              <div className="flex-1 relative w-full h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {nodes.map((node) => {
                    if (!node.parent) return null;
                    const parentNode = nodes.find((n) => n.id === node.parent);
                    if (!parentNode) return null;

                    return (
                      <line
                        key={`edge-${node.id}`}
                        x1={parentNode.x}
                        y1={parentNode.y}
                        x2={node.x}
                        y2={node.y}
                        stroke="#E5E7EB"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                {/* Nodes rendering */}
                {nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ left: `${node.x - 20}px`, top: `${node.y - 20}px` }}
                    className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
                      activeHighlight === node.id
                        ? 'bg-accent text-white border-accent ring-4 ring-accent/20'
                        : 'bg-white text-primary border-primary'
                    }`}
                  >
                    {node.val}
                  </motion.div>
                ))}
              </div>

              {/* Traversal Output Sequence */}
              {traversalResult.length > 0 && (
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs font-mono">
                  <span className="text-gray-400">Sequence:</span>
                  {traversalResult.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3">
              <input
                type="number"
                placeholder="Node Value"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary flex-1"
              />
              <Button onClick={handleInsert} variant="primary" className="py-2 text-xs">
                <Plus className="w-4 h-4 mr-1" /> Insert Node
              </Button>
            </div>

          </div>

          {/* Right Column: Pseudocode & Specs */}
          <div className="lg:col-span-3 space-y-6">

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1.5 overflow-x-auto">
                {currentSpec.pseudocode.map((line, idx) => (
                  <div key={idx} className="opacity-80 px-1.5 py-0.5 rounded">
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent" /> Complexity Specs
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Search:</span>
                  <span className="font-bold text-primary">{currentSpec.search}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Insert:</span>
                  <span className="font-bold text-emerald-600">{currentSpec.insert}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Delete:</span>
                  <span className="font-bold text-accent">{currentSpec.delete}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default TreeLab;
