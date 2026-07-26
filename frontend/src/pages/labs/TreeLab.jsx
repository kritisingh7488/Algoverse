import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Code, 
  Layers, 
  Sparkles,
  Search,
  Shuffle,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  BarChart2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MascotRole from '../../components/mascots/MascotRole';
import api from '../../api/axios';

import TreeCanvas from '../../components/tree/TreeCanvas';
import TreePlaybackBar from '../../components/tree/TreePlaybackBar';
import TreeComparisonView from '../../components/tree/TreeComparisonView';

export const TREE_TYPES = {
  bst: {
    name: 'Binary Search Tree (BST)',
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
    intuition: 'For every node: all left subtree values are smaller, and right subtree values are larger.',
    advantages: ['O(log N) dynamic search & insertion', 'In-order traversal yields sorted sequence'],
    disadvantages: ['Degenerates into O(N) linked list if elements are inserted in sorted order'],
    realWorldUses: ['Symbol Tables', 'Database Indexing', 'Expression Evaluation Trees'],
    mistakes: 'Unbalanced insertions degrade performance to O(N).',
    interviewTip: 'An In-Order traversal of a BST ALWAYS yields elements in sorted ascending order!'
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
    intuition: 'Maintains height balance factor |height(left) - height(right)| <= 1 at every node via rotations.',
    advantages: ['Strict O(log N) guaranteed worst-case search time', 'Faster lookups than Red-Black trees'],
    disadvantages: ['Frequent rotations during insertions & deletions'],
    realWorldUses: ['In-Memory Databases', 'High-Frequency Lookup Systems'],
    mistakes: 'Forgetting to update node heights during tree rotations.',
    interviewTip: 'AVL trees are strictly height-balanced, making them ideal for read-heavy workloads.'
  },
  redblack: {
    name: 'Red-Black Tree',
    category: 'Self-Balancing',
    search: 'O(log N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      '// Red-Black Properties',
      '1. Every node is Red or Black.',
      '2. Root is always Black.',
      '3. No two consecutive Red nodes.',
      '4. Equal black-height on all paths.'
    ],
    intuition: 'Self-balancing tree using node recoloring and rotations to guarantee path length limits.',
    advantages: ['Faster insertions and deletions than AVL trees due to fewer rotations'],
    disadvantages: ['Slightly deeper tree height than AVL trees'],
    realWorldUses: ['Linux Kernel Completely Fair Scheduler (CFS)', 'C++ std::map & std::set', 'Java TreeMap'],
    mistakes: 'Violating the consecutive Red node property during rebalancing.',
    interviewTip: 'Standard library map implementations (C++ std::map, Java TreeMap) use Red-Black trees.'
  },
  minheap: {
    name: 'Binary Min Heap',
    category: 'Heap',
    search: 'O(N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      'function insert(val):',
      '  heap.push(val)',
      '  siftUp(heap.size - 1)',
      'function extractMin():',
      '  min = heap[0]',
      '  heap[0] = heap.pop()',
      '  siftDown(0)'
    ],
    intuition: 'Complete binary tree where parent <= children. Minimum element is always at Root.',
    advantages: ['O(1) access to minimum element', 'Zero pointer overhead when stored in flat array'],
    disadvantages: ['O(N) search time for non-root elements'],
    realWorldUses: ['Dijkstra Shortest Path Algorithm', 'Priority Task Schedulers'],
    mistakes: 'Confusing 0-based array parent indexing formula `(i-1)/2`.',
    interviewTip: 'Use Min Heap to find the Kth Smallest Element or Merge K Sorted Lists.'
  },
  trie: {
    name: 'Trie (Prefix Tree)',
    category: 'Prefix Tree',
    search: 'O(K)',
    insert: 'O(K)',
    delete: 'O(K)',
    space: 'O(N * K)',
    pseudocode: [
      'function insertWord(word):',
      '  curr = root',
      '  for char in word:',
      '    if char not in curr.children:',
      '      curr.children[char] = new Node()',
      '    curr = curr.children[char]',
      '  curr.isEndOfWord = true'
    ],
    intuition: 'Tree structure where edges represent characters of string keys.',
    advantages: ['O(K) search time proportional to word length K', 'Fast prefix matching for autocomplete'],
    disadvantages: ['High memory consumption for sparse character alphabets'],
    realWorldUses: ['Search Engine Autocomplete', 'IP Router Longest Prefix Matching', 'Spell Checkers'],
    mistakes: 'Forgetting to mark `isEndOfWord = true` at the final character node.',
    interviewTip: 'Tries outperform HashMaps when matching word prefixes or listing words sharing a prefix.'
  },
  segment: {
    name: 'Segment Tree',
    category: 'Range Query',
    search: 'O(log N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      'function queryRange(node, l, r, ql, qr):',
      '  if ql <= l and r <= qr: return node.val',
      '  mid = (l + r) / 2',
      '  return combine(query(left, l, mid), query(right, mid+1, r))'
    ],
    intuition: 'Binary tree storing interval range aggregations (Sum, Min, Max) for fast range queries.',
    advantages: ['O(log N) point updates and range queries'],
    disadvantages: ['Requires 4N memory space allocation'],
    realWorldUses: ['Computational Geometry', 'Financial Range Aggregations', 'Competitive Programming'],
    mistakes: 'Off-by-one errors in range overlap conditions.',
    interviewTip: 'Segment trees solve dynamic Range Sum/Min/Max queries with updates in O(log N) time.'
  },
  fenwick: {
    name: 'Fenwick Tree (BIT)',
    category: 'Range Query',
    search: 'O(log N)',
    insert: 'O(log N)',
    delete: 'O(log N)',
    space: 'O(N)',
    pseudocode: [
      'function update(idx, val):',
      '  while idx <= N:',
      '    BIT[idx] += val',
      '    idx += idx & (-idx) // LSB update',
      'function query(idx):',
      '  sum = 0',
      '  while idx > 0:',
      '    sum += BIT[idx]',
      '    idx -= idx & (-idx) // LSB decrement'
    ],
    intuition: 'Compact array structure exploiting Least Significant Bit (LSB) `i & (-i)` for prefix sums.',
    advantages: ['Simple implementation with small memory footprint', 'Extremely fast O(log N) updates'],
    disadvantages: ['Supports prefix sums easily, but difficult for arbitrary range min/max'],
    realWorldUses: ['Inversion Count Calculation', 'Dynamic Cumulative Frequency Tracking'],
    mistakes: 'Using 0-based indexing instead of 1-based indexing for BIT operations.',
    interviewTip: 'Fenwick Trees require less code and less memory than Segment Trees for prefix sums.'
  }
};

const TreeLab = () => {
  const [treeType, setTreeType] = useState('bst');
  const [nodes, setNodes] = useState([
    { id: 1, val: 50, x: 250, y: 50, parent: null },
    { id: 2, val: 25, x: 150, y: 120, parent: 1 },
    { id: 3, val: 75, x: 350, y: 120, parent: 1 },
    { id: 4, val: 15, x: 100, y: 190, parent: 2 },
    { id: 5, val: 35, x: 200, y: 190, parent: 2 },
    { id: 6, val: 65, x: 300, y: 190, parent: 3 },
    { id: 7, val: 85, x: 400, y: 190, parent: 3 }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Playback & Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  const [traversalSequence, setTraversalSequence] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [desc, setDesc] = useState('');

  const currentSpec = TREE_TYPES[treeType] || TREE_TYPES.bst;

  // Execute C++ Tree Backend API Operation
  const executeCppTreeOp = async (opName, val = 42) => {
    try {
      const inputArr = nodes.map(n => n.val);
      const res = await api.post('/tree/run', {
        treeType,
        opName,
        val,
        input: inputArr
      });
      if (res.data?.success && res.data?.data?.events) {
        setEvents(res.data.data.events);
        setStepIndex(0);
        setIsPlaying(true);
        return;
      }
    } catch (err) {
      console.log('Falling back to local tree step generator:', err);
    }
  };

  // Traversals Handler
  const handleTraverse = (type) => {
    executeCppTreeOp(type);
  };

  // Insert Handler
  const handleInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    executeCppTreeOp('insert', val);
    setInputVal('');
  };

  // Delete Handler
  const handleDelete = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    executeCppTreeOp('delete', val);
    setInputVal('');
  };

  // Stepper effect
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
    setActiveHighlight(step.highlight);
    setTraversalSequence(step.sequence || []);
    setActiveCodeLine(step.line || 0);
    setDesc(step.desc || '');
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    let newNodes = [
      { id: 1, val: 50, x: 250, y: 50, parent: null },
      { id: 2, val: 25, x: 150, y: 120, parent: 1 },
      { id: 3, val: 75, x: 350, y: 120, parent: 1 },
      { id: 4, val: 15, x: 100, y: 190, parent: 2 },
      { id: 5, val: 35, x: 200, y: 190, parent: 2 },
      { id: 6, val: 65, x: 300, y: 190, parent: 3 },
      { id: 7, val: 85, x: 400, y: 190, parent: 3 }
    ];
    setNodes(newNodes);
    setActiveHighlight(null);
    setTraversalSequence([]);
    setDesc('Generated balanced binary tree.');
  };

  const handleClear = () => {
    setIsPlaying(false);
    setNodes([]);
    setActiveHighlight(null);
    setTraversalSequence([]);
    setDesc('Tree cleared.');
  };

  const handleImportCSV = (importedValues) => {
    const newNodes = importedValues.map((val, idx) => ({
      id: idx + 1,
      val,
      x: 250 + (idx % 2 === 0 ? idx * 25 : -idx * 25),
      y: 50 + Math.floor(idx / 2) * 60,
      parent: idx === 0 ? null : Math.floor(idx / 2)
    }));
    setNodes(newNodes);
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Top Header Card */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Engine Panel' : 'Collapse Engine Panel'}
              className="shrink-0"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30">
                  <GitFork className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-heading font-bold text-textPrimary">Tree Laboratory</h1>
              </div>
              <p className="text-sm font-body text-textSecondary mt-1">
                Deterministic C++ Tree Engine with live balancing rotations, traversals, and multi-tree comparison studio.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={isComparisonMode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsComparisonMode(!isComparisonMode)}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              {isComparisonMode ? 'Single Visualizer' : 'Multi-Tree Comparison Studio'}
            </Button>
            <MascotRole role="teacher" activity="reading" dialogue={`Executing ${currentSpec.name} in C++!`} className="w-20 h-20" />
          </div>
        </Card>

        {isComparisonMode ? (
          <TreeComparisonView
            specs={TREE_TYPES}
            onBackToSingle={() => setIsComparisonMode(false)}
          />
        ) : (
          /* Collapsible Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">

            {/* LEFT PANEL: Tree Type Selectors */}
            {!isSidebarCollapsed && (
              <div className="lg:col-span-3 transition-all duration-300">
                <Card className="p-5 space-y-4">
                  <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" /> Select Tree Architecture
                  </h3>

                  <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                    {Object.keys(TREE_TYPES).map((key) => {
                      const item = TREE_TYPES[key];
                      const isSelected = treeType === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setTreeType(key)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-primary text-white shadow-soft shadow-primary/20'
                              : 'bg-surface text-textPrimary hover:bg-card border border-borderTheme'
                          }`}
                        >
                          <span>{item.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-card text-textSecondary border border-borderTheme'
                          }`}>
                            {item.search}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* CENTER PANEL: Canvas, Operations, & Playback */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-4 transition-all duration-300`}>
              
              {/* Tree Canvas */}
              <TreeCanvas
                treeType={treeType}
                setTreeType={setTreeType}
                nodes={nodes}
                activeHighlight={activeHighlight}
                traversalSequence={traversalSequence}
                spec={currentSpec}
                specs={TREE_TYPES}
                onTraverse={handleTraverse}
                onRandomize={handleRandomize}
                onClear={handleClear}
                onImportCSV={handleImportCSV}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
              />

              {/* Node Operations Input Bar */}
              <Card className="p-4 flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  placeholder="Node Value"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-28 px-3 py-2 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
                />
                <Button onClick={handleInsert} variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Insert
                </Button>
                <Button onClick={handleDelete} variant="outline" size="sm">
                  <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Delete
                </Button>
                <div className="border-l-2 border-borderTheme pl-3 flex items-center gap-1.5 flex-wrap">
                  <Button onClick={() => handleTraverse('inorder')} variant="outline" size="sm">In-Order</Button>
                  <Button onClick={() => handleTraverse('preorder')} variant="outline" size="sm">Pre-Order</Button>
                  <Button onClick={() => handleTraverse('postorder')} variant="outline" size="sm">Post-Order</Button>
                  <Button onClick={() => handleTraverse('levelorder')} variant="outline" size="sm">Level-BFS</Button>
                </div>
              </Card>

              {/* Playback Controls */}
              <TreePlaybackBar
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                stepIndex={stepIndex}
                totalSteps={events.length}
                onStepChange={setStepIndex}
                speed={speed}
                setSpeed={setSpeed}
                onRestart={() => setStepIndex(0)}
              />

            </div>

            {/* RIGHT PANEL: Pseudocode & Educational Tip */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-4 transition-all duration-300`}>
              
              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-primary" /> Live C++ Pseudocode
                </h3>
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto">
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
              </Card>

              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-heading font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Conceptual Intuition
                </h3>
                <p className="text-xs text-textSecondary leading-relaxed">{currentSpec.intuition}</p>
                
                <div className="pt-2 border-t border-borderTheme space-y-1">
                  <span className="text-[10px] font-bold text-danger uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Common Mistake
                  </span>
                  <p className="text-[11px] text-textSecondary">{currentSpec.mistakes}</p>
                </div>

                <div className="pt-2 border-t border-borderTheme space-y-1">
                  <span className="text-[10px] font-bold text-success uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Interview Tip
                  </span>
                  <p className="text-[11px] text-textSecondary">{currentSpec.interviewTip}</p>
                </div>
              </Card>

            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default TreeLab;
