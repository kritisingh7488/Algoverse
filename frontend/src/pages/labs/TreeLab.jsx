import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  Play, 
  Pause,
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  Activity, 
  Layers, 
  Sparkles,
  Search,
  Shuffle,
  Lightbulb,
  AlertTriangle,
  RefreshCw
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
    ],
    intuition: 'For every node: all values in the left subtree are strictly smaller, and all values in the right subtree are strictly larger.',
    mistakes: 'Unbalanced insertions (e.g. inserting 1, 2, 3, 4, 5 in sorted order) degenerate the tree into an O(N) linked list.',
    interviewTip: 'An In-Order traversal of a Binary Search Tree ALWAYS yields elements in sorted ascending order!'
  },
  avl: {
    name: 'AVL Tree (Self-Balancing)',
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
    ],
    intuition: 'Maintains height balance factor |height(left) - height(right)| <= 1 at every node via single or double rotations.',
    mistakes: 'Forgetting to update node height values after rotations during insertion or deletion.',
    interviewTip: 'AVL trees provide faster lookup times than Red-Black trees due to stricter height balancing.'
  }
};

const TreeLab = () => {
  const [treeType, setTreeType] = useState('bst');
  const [nodes, setNodes] = useState([
    { id: 1, val: 50, x: 250, y: 50, parent: null },
    { id: 2, val: 30, x: 150, y: 120, parent: 1 },
    { id: 3, val: 70, x: 350, y: 120, parent: 1 },
    { id: 4, val: 20, x: 100, y: 190, parent: 2 },
    { id: 5, val: 40, x: 200, y: 190, parent: 2 },
    { id: 6, val: 60, x: 300, y: 190, parent: 3 },
    { id: 7, val: 80, x: 400, y: 190, parent: 3 }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  const [traversalSequence, setTraversalSequence] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [desc, setDesc] = useState('');

  const currentSpec = TREE_TYPES[treeType];

  // Helper: Layout node coordinates dynamically
  const layoutTreeNodes = (rawNodes) => {
    if (rawNodes.length === 0) return [];
    
    // Find root
    let root = rawNodes.find(n => n.parent === null);
    if (!root) return rawNodes;

    let updated = [...rawNodes];
    
    const assignCoords = (currId, x, y, level) => {
      const idx = updated.findIndex(n => n.id === currId);
      if (idx === -1) return;
      
      updated[idx].x = x;
      updated[idx].y = y;

      const currVal = updated[idx].val;
      const leftChild = updated.find(n => n.parent === currId && n.val < currVal);
      const rightChild = updated.find(n => n.parent === currId && n.val >= currVal);

      const offset = Math.max(25, 120 / Math.pow(1.6, level));
      if (leftChild) assignCoords(leftChild.id, x - offset, y + 65, level + 1);
      if (rightChild) assignCoords(rightChild.id, x + offset, y + 65, level + 1);
    };

    assignCoords(root.id, 250, 50, 1);
    return updated;
  };

  // Insertion Logic with Step-by-Step Compare Events
  const handleInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;

    let steps = [];
    let currentTree = [...nodes];

    if (currentTree.length === 0) {
      const rootNode = { id: Date.now(), val, x: 250, y: 50, parent: null };
      setNodes([rootNode]);
      setDesc(`Inserted root node ${val}.`);
      setInputVal('');
      return;
    }

    // Step-by-step traversal comparison
    let curr = currentTree.find(n => n.parent === null);
    let level = 1;

    while (curr) {
      steps.push({
        highlight: curr.id,
        line: val < curr.val ? 2 : 3,
        desc: `Comparing ${val} with node ${curr.val}: ${val < curr.val ? `${val} < ${curr.val} → Go Left` : `${val} >= ${curr.val} → Go Right`}`
      });

      const isLeft = val < curr.val;
      const child = currentTree.find(n => n.parent === curr.id && (isLeft ? n.val < curr.val : n.val >= curr.val));

      if (child) {
        curr = child;
        level++;
      } else {
        const offset = Math.max(25, 120 / Math.pow(1.6, level));
        const newNode = {
          id: Date.now(),
          val,
          x: isLeft ? curr.x - offset : curr.x + offset,
          y: curr.y + 65,
          parent: curr.id
        };
        const nextNodes = layoutTreeNodes([...currentTree, newNode]);

        steps.push({
          highlight: newNode.id,
          nextNodes,
          line: 1,
          desc: `Inserted new node ${val} under parent ${curr.val}.`
        });
        break;
      }
    }

    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(true);
    if (steps.length > 0) applyStep(steps[0]);
    setInputVal('');
  };

  const handleDelete = () => {
    const val = parseInt(inputVal);
    if (isNaN(val) || nodes.length === 0) return;

    const targetNode = nodes.find(n => n.val === val);
    if (targetNode) {
      const nextNodes = layoutTreeNodes(nodes.filter(n => n.id !== targetNode.id && n.parent !== targetNode.id));
      setNodes(nextNodes);
      setActiveHighlight(null);
      setDesc(`Deleted node ${val} from tree.`);
    } else {
      setDesc(`Node ${val} not found in tree.`);
    }
    setInputVal('');
  };

  const generateTraversalEvents = (type) => {
    let steps = [];
    let sequence = [];
    
    let sorted = [...nodes].sort((a, b) => a.val - b.val);

    if (type === 'inorder') {
      sorted.forEach((node) => {
        sequence.push(node.val);
        steps.push({
          highlight: node.id,
          sequence: [...sequence],
          line: 2,
          desc: `In-Order Traversal: Visited left-subtree element ${node.val}`
        });
      });
    } else if (type === 'preorder') {
      let rootFirst = [nodes[0], ...nodes.slice(1)];
      rootFirst.forEach((node) => {
        sequence.push(node.val);
        steps.push({
          highlight: node.id,
          sequence: [...sequence],
          line: 1,
          desc: `Pre-Order Traversal: Visited root element ${node.val}`
        });
      });
    } else if (type === 'postorder') {
      let postOrder = [...nodes].reverse();
      postOrder.forEach((node) => {
        sequence.push(node.val);
        steps.push({
          highlight: node.id,
          sequence: [...sequence],
          line: 3,
          desc: `Post-Order Traversal: Processed child subtree ${node.val}`
        });
      });
    } else if (type === 'levelorder') {
      // BFS Level Order
      let levelNodes = [...nodes].sort((a, b) => a.y - b.y || a.x - b.x);
      levelNodes.forEach((node) => {
        sequence.push(node.val);
        steps.push({
          highlight: node.id,
          sequence: [...sequence],
          line: 0,
          desc: `Level-Order BFS: Popped node ${node.val} from level queue`
        });
      });
    }

    return steps;
  };

  const handleTraverse = (type) => {
    const steps = generateTraversalEvents(type);
    setEvents(steps);
    setStepIndex(0);
    setIsPlaying(true);
    if (steps.length > 0) applyStep(steps[0]);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && stepIndex < events.length - 1) {
      timer = setTimeout(() => {
        const next = stepIndex + 1;
        setStepIndex(next);
        applyStep(events[next]);
      }, 700 / speed);
    } else if (stepIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  const applyStep = (step) => {
    if (!step) return;
    if (step.nextNodes) setNodes(step.nextNodes);
    setActiveHighlight(step.highlight);
    setTraversalSequence(step.sequence || []);
    setActiveCodeLine(step.line || 0);
    setDesc(step.desc || '');
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    let sampleValues = [50, 25, 75, 15, 35, 65, 85];
    let newNodes = [];
    let root = { id: 1, val: 50, x: 250, y: 50, parent: null };
    newNodes.push(root);
    newNodes.push({ id: 2, val: 25, x: 150, y: 120, parent: 1 });
    newNodes.push({ id: 3, val: 75, x: 350, y: 120, parent: 1 });
    newNodes.push({ id: 4, val: 15, x: 100, y: 190, parent: 2 });
    newNodes.push({ id: 5, val: 35, x: 200, y: 190, parent: 2 });
    newNodes.push({ id: 6, val: 65, x: 300, y: 190, parent: 3 });
    newNodes.push({ id: 7, val: 85, x: 400, y: 190, parent: 3 });

    setNodes(newNodes);
    setActiveHighlight(null);
    setTraversalSequence([]);
    setDesc('Generated balanced binary search tree.');
  };

  const handleClear = () => {
    setIsPlaying(false);
    setNodes([]);
    setActiveHighlight(null);
    setTraversalSequence([]);
    setDesc('Tree cleared.');
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
              Visualize hierarchical structures, balance rotations, and step-by-step tree traversals.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={() => handleTraverse('inorder')} variant="outline" className="text-xs py-2">
              In-Order
            </Button>
            <Button onClick={() => handleTraverse('preorder')} variant="outline" className="text-xs py-2">
              Pre-Order
            </Button>
            <Button onClick={() => handleTraverse('postorder')} variant="outline" className="text-xs py-2">
              Post-Order
            </Button>
            <Button onClick={() => handleTraverse('levelorder')} variant="outline" className="text-xs py-2">
              Level-Order
            </Button>
            <button 
              onClick={handleRandomize} 
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
              title="Random Tree"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={handleClear} 
              className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              title="Clear Tree"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
                    className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all duration-300 ${
                      activeHighlight === node.id
                        ? 'bg-amber-400 text-white border-amber-500 shadow-lg shadow-amber-400/30 scale-115 ring-4 ring-amber-200'
                        : 'bg-white text-primary border-primary'
                    }`}
                  >
                    {node.val}
                  </motion.div>
                ))}
              </div>

              {/* Traversal Output Sequence & Desc */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
                  <span className="text-gray-400">Sequence:</span>
                  {traversalSequence.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                      {v}
                    </span>
                  ))}
                  {traversalSequence.length === 0 && <span className="text-gray-300 italic">Click a traversal above</span>}
                </div>
                <p className="text-[11px] font-mono text-gray-500 truncate">{desc}</p>
              </div>
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
              <Button onClick={handleDelete} variant="outline" className="py-2 text-xs">
                <Trash2 className="w-4 h-4 mr-1 text-danger" /> Delete
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
                  <div 
                    key={idx} 
                    className={`px-2 py-1 rounded transition-colors ${
                      activeCodeLine === idx ? 'bg-primary/40 text-white font-bold border-l-2 border-primary' : 'opacity-70'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Intuition & Educational Notes */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <Lightbulb className="w-3.5 h-3.5" /> Conceptual Intuition
              </h3>
              <p className="text-xs text-gray-600 font-inter leading-relaxed">{currentSpec.intuition}</p>
              
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-red-500 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Common Mistake
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentSpec.mistakes}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold font-poppins text-emerald-600 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interview Tip
                </span>
                <p className="text-[11px] text-gray-500 font-inter leading-tight">{currentSpec.interviewTip}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default TreeLab;
