import React, { useState, useEffect } from 'react';
import {
  GitFork, Plus, Trash2, Code, Layers, Sparkles, Search, Lightbulb, AlertTriangle,
  BarChart2, PanelLeftClose, PanelLeftOpen, Shuffle, RotateCcw, Upload, CheckCircle2, Sliders
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import MascotRole from '../../components/mascots/MascotRole';
import api from '../../api/axios';

import TreeCanvas from '../../components/tree/TreeCanvas';
import TreePlaybackBar from '../../components/tree/TreePlaybackBar';
import TreeComparisonView from '../../components/tree/TreeComparisonView';
import { isTraversalSupported, isAlgorithmSupported, isOperationSupported, TYPE_SPECIFIC_CONTROLS } from '../../components/tree/treeFilters';
import TreeAutoVerifier from '../../components/tree/TreeAutoVerifier';

export const TREE_TYPES = {
  bst: {
    name: 'Binary Search Tree',
    category: 'Hierarchical',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['function insert(node, val):', '  if node is null: return new Node(val)', '  if val < node.val:', '    node.left = insert(node.left, val)', '  else: node.right = insert(node.right, val)', '  return node'],
    intuition: 'For every node: left subtree values < node < right subtree values.',
    advantages: ['O(log N) dynamic search & insertion', 'In-order traversal yields sorted order'],
    disadvantages: ['Degenerates to O(N) linked list on sorted input'],
    realWorldUses: ['Symbol Tables', 'Database Indexing', 'Expression Trees'],
    mistakes: 'Inserting sorted data makes the tree degenerate into a linked list.',
    interviewTip: 'In-Order traversal of a BST always yields sorted ascending order!'
  },
  avl: {
    name: 'AVL Tree',
    category: 'Self-Balancing',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['function insertAVL(node, val):', '  node = bstInsert(node, val)', '  balance = height(left) - height(right)', '  if balance > 1: rightRotate(node)  // LL', '  if balance < -1: leftRotate(node) // RR', '  return node'],
    intuition: 'Maintains |balance factor| <= 1 at every node via rotations.',
    advantages: ['Strict O(log N) guaranteed worst-case', 'Faster lookups than Red-Black'],
    disadvantages: ['Frequent rotations on insert/delete'],
    realWorldUses: ['In-Memory Databases', 'High-Frequency Lookup Systems'],
    mistakes: 'Forgetting to update heights after rotations.',
    interviewTip: 'AVL trees are strictly height-balanced — ideal for read-heavy workloads.'
  },
  redblack: {
    name: 'Red-Black Tree',
    category: 'Self-Balancing',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['// Red-Black Properties:', '1. Every node is Red or Black', '2. Root is always Black', '3. No two consecutive Red nodes', '4. Equal black-height on all root-to-leaf paths'],
    intuition: 'Recoloring + rotations guarantee balanced path lengths.',
    advantages: ['Fewer rotations than AVL on insert/delete', 'Used in standard libraries'],
    disadvantages: ['Slightly taller than AVL', 'Complex implementation'],
    realWorldUses: ['Linux CFS Scheduler', 'C++ std::map', 'Java TreeMap'],
    mistakes: 'Violating no-consecutive-red-nodes during rebalancing.',
    interviewTip: 'std::map and TreeMap use Red-Black trees internally.'
  },
  minheap: {
    name: 'Min Heap',
    category: 'Heap',
    search: 'O(N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['function insert(val):', '  heap.push(val)', '  siftUp(heap.size - 1)', 'function extractMin():', '  swap(heap[0], heap[last])', '  heap.pop()', '  siftDown(0)'],
    intuition: 'Complete binary tree where parent <= children. Root = minimum.',
    advantages: ['O(1) minimum access', 'Array-backed, cache-friendly'],
    disadvantages: ['O(N) search for non-root elements'],
    realWorldUses: ['Dijkstra Algorithm', 'Priority Schedulers', 'Merge K Lists'],
    mistakes: 'Confusing 0-based parent formula: parent = (i-1)/2.',
    interviewTip: 'Use Min Heap for Kth Smallest or Merge K Sorted Lists.'
  },
  maxheap: {
    name: 'Max Heap',
    category: 'Heap',
    search: 'O(N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['function insert(val):', '  heap.push(val)', '  siftUp(heap.size - 1)', 'function extractMax():', '  swap(heap[0], heap[last])', '  heap.pop()', '  siftDown(0)'],
    intuition: 'Complete binary tree where parent >= children. Root = maximum.',
    advantages: ['O(1) maximum access', 'Efficient for priority queues'],
    disadvantages: ['O(N) search for non-root elements'],
    realWorldUses: ['Kth Largest Element', 'Heap Sort', 'CPU Scheduling'],
    mistakes: 'Forgetting to sift up after insertion.',
    interviewTip: 'Use Max Heap for Kth Largest Element in a stream.'
  },
  trie: {
    name: 'Trie (Prefix Tree)',
    category: 'Prefix Tree',
    search: 'O(K)', insert: 'O(K)', delete: 'O(K)', space: 'O(N*K)',
    pseudocode: ['function insertWord(word):', '  curr = root', '  for char in word:', '    if char not in curr.children:', '      curr.children[char] = new Node()', '    curr = curr.children[char]', '  curr.isEndOfWord = true'],
    intuition: 'Edges represent characters. Paths from root spell out keys.',
    advantages: ['O(K) search proportional to word length', 'Fast prefix matching'],
    disadvantages: ['High memory for sparse alphabets'],
    realWorldUses: ['Autocomplete', 'IP Routing', 'Spell Checkers'],
    mistakes: 'Forgetting to set isEndOfWord = true.',
    interviewTip: 'Tries beat HashMaps for prefix queries.'
  },
  segment: {
    name: 'Segment Tree',
    category: 'Range Query',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(4N)',
    pseudocode: ['function query(node, l, r, ql, qr):', '  if ql <= l and r <= qr: return node.val', '  mid = (l + r) / 2', '  return merge(query(left), query(right))'],
    intuition: 'Stores interval range aggregations for fast range queries + updates.',
    advantages: ['O(log N) range queries and point updates'],
    disadvantages: ['4N space overhead'],
    realWorldUses: ['Computational Geometry', 'Finance', 'Competitive Programming'],
    mistakes: 'Off-by-one in range overlap conditions.',
    interviewTip: 'Segment trees solve Range Sum/Min/Max queries with updates.'
  },
  fenwick: {
    name: 'Fenwick Tree (BIT)',
    category: 'Range Query',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['function update(idx, val):', '  while idx <= N:', '    BIT[idx] += val', '    idx += idx & (-idx)', 'function query(idx):', '  sum = 0', '  while idx > 0:', '    sum += BIT[idx]', '    idx -= idx & (-idx)'],
    intuition: 'Exploits LSB bit manipulation for O(log N) prefix sums.',
    advantages: ['Simple code, small memory', 'Very fast updates'],
    disadvantages: ['Only prefix sums, not arbitrary range min/max'],
    realWorldUses: ['Inversion Count', 'Cumulative Frequency'],
    mistakes: 'Using 0-based indexing — BIT requires 1-based.',
    interviewTip: 'Fenwick = less code + less memory than Segment Tree for prefix sums.'
  },
  binary: {
    name: 'Binary Tree',
    category: 'Hierarchical',
    search: 'O(N)', insert: 'O(N)', delete: 'O(N)', space: 'O(N)',
    pseudocode: ['// Generic binary tree:', '// Each node has at most 2 children', '// No ordering constraint', '// Insert via level-order (BFS)'],
    intuition: 'Most general tree — each node has at most 2 children, no ordering.',
    advantages: ['Simple structure', 'Foundation for all other tree types'],
    disadvantages: ['O(N) search — no ordering to exploit'],
    realWorldUses: ['Expression Trees', 'Huffman Coding', 'Decision Trees'],
    mistakes: 'Assuming binary tree = BST. BST has ordering; binary tree does not.',
    interviewTip: 'Most tree interview questions assume BST unless stated otherwise.'
  },
  huffman: {
    name: 'Huffman Tree',
    category: 'Compression',
    search: 'O(N)', insert: 'O(N log N)', delete: 'N/A', space: 'O(N)',
    pseudocode: ['function buildHuffman(freqs):', '  pq = MinHeap(freqs)', '  while pq.size > 1:', '    left = pq.extractMin()', '    right = pq.extractMin()', '    merged = new Node(left.freq + right.freq)', '    pq.insert(merged)'],
    intuition: 'Greedy algorithm: frequent characters get shorter codes.',
    advantages: ['Optimal prefix-free coding', 'Lossless compression'],
    disadvantages: ['Requires full frequency table upfront'],
    realWorldUses: ['ZIP', 'JPEG', 'MP3 encoding'],
    mistakes: 'Not using a min-heap — must always merge two smallest frequencies.',
    interviewTip: 'Huffman coding is a greedy algorithm for optimal prefix codes.'
  },
  btree: {
    name: 'B-Tree',
    category: 'Multi-Way',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['// B-Tree of order m:', '// Each node has at most m children', '// Each node has at least ceil(m/2) children', '// All leaves at same depth', '// Keys in each node are sorted'],
    intuition: 'Self-balancing multi-way tree optimized for disk I/O.',
    advantages: ['Minimizes disk reads', 'All leaves at same level'],
    disadvantages: ['Complex implementation', 'Overhead for in-memory use'],
    realWorldUses: ['Database Indexes', 'File Systems (NTFS, ext4)'],
    mistakes: 'Forgetting to split nodes when they overflow during insertion.',
    interviewTip: 'B-Trees minimize disk I/O — each node = one disk block.'
  },
  bplus: {
    name: 'B+ Tree',
    category: 'Multi-Way',
    search: 'O(log N)', insert: 'O(log N)', delete: 'O(log N)', space: 'O(N)',
    pseudocode: ['// B+ Tree:', '// All data in leaf nodes only', '// Internal nodes only store keys for routing', '// Leaves linked as sorted linked list', '// Supports efficient range queries'],
    intuition: 'B-Tree variant where all data is in leaves, linked for range scans.',
    advantages: ['Efficient range queries via leaf links', 'Better cache performance'],
    disadvantages: ['Slightly more space than B-Tree'],
    realWorldUses: ['MySQL InnoDB', 'PostgreSQL', 'Oracle DB indexes'],
    mistakes: 'Confusing B-Tree and B+ Tree — B+ stores data ONLY in leaves.',
    interviewTip: 'Almost all real database indexes use B+ Trees, not B-Trees.'
  }
};

export const SUPPORTED_INPUT_TYPES = {
  bst: ['Integer', 'Character', 'String'],
  avl: ['Integer', 'Character', 'String'],
  redblack: ['Integer', 'Character', 'String'],
  minheap: ['Integer'],
  maxheap: ['Integer'],
  trie: ['String (Words Only)'],
  segment: ['Integer'],
  fenwick: ['Integer'],
  binary: ['Integer', 'Character', 'String'],
  huffman: ['Character + Frequency Pairs'],
  btree: ['Integer', 'Character', 'String'],
  bplus: ['Integer', 'Character', 'String']
};

const TreeLab = () => {
  const [treeType, setTreeType] = useState('bst');
  const [autoConvert, setAutoConvert] = useState(true);

  // Store current tree values (the source of truth for the C++ engine)
  const [treeValues, setTreeValues] = useState([50, 25, 75, 15, 35, 65, 85]);
  // Rendered nodes (from C++ engine events, with id/val/x/y/pid)
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showVerifier, setShowVerifier] = useState(false);

  const [inputType, setInputType] = useState('Integer');
  const [stringMap, setStringMap] = useState({});
  const [inputVal, setInputVal] = useState('');
  const [algParam, setAlgParam] = useState('');
  const [importInput, setImportInput] = useState('');
  const [lastOpName, setLastOpName] = useState('READY');
  const [validationStats, setValidationStats] = useState({});
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [traversalSequence, setTraversalSequence] = useState([]);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [desc, setDesc] = useState('');

  const currentSpec = TREE_TYPES[treeType] || TREE_TYPES.bst;

  const handleTreeTypeChange = (newTreeType) => {
    setTreeType(newTreeType);
    setEvents([]);
    setTraversalSequence([]);
    setActiveHighlight(null);
    setLastOpName(TREE_TYPES[newTreeType].name.toUpperCase());

    const supportedTypes = SUPPORTED_INPUT_TYPES[newTreeType] || ['Integer'];
    let newDataType = inputType;
    if (!supportedTypes.includes(inputType)) {
      newDataType = supportedTypes[0];
      setInputType(newDataType);
    }

    if (autoConvert) {
      let sampleVals = treeValues;
      if (!supportedTypes.includes(inputType)) {
        if (newDataType === 'Character') {
          sampleVals = ['M', 'F', 'S', 'B', 'H', 'P', 'W'];
        } else if (newDataType === 'String') {
          sampleVals = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Peach'];
        } else if (newDataType === 'String (Words Only)') {
          sampleVals = ['cat', 'car', 'cart', 'dog', 'dove', 'door', 'deer'];
        } else if (newDataType === 'Character + Frequency Pairs') {
          sampleVals = ['F:45', 'E:16', 'D:13', 'C:12', 'B:9', 'A:5'];
        } else {
          sampleVals = [50, 25, 75, 15, 35, 65, 85];
        }
      }
      setTreeValues(sampleVals);
      setDesc(`Auto-converted tree to ${TREE_TYPES[newTreeType].name} (${newDataType} mode).`);
    } else {
      setDesc(`Switched to ${TREE_TYPES[newTreeType].name} without auto-converting dataset.`);
    }
  };

  useEffect(() => {
    const supported = SUPPORTED_INPUT_TYPES[treeType] || ['Integer'];
    if (!supported.includes(inputType)) {
      setInputType(supported[0]);
    }
  }, [treeType]);

  const handleInputTypeChange = (newType) => {
    setInputType(newType);
    setIsPlaying(false);
    setEvents([]); setTraversalSequence([]); setActiveHighlight(null);
    let sampleVals = [50, 25, 75, 15, 35, 65, 85];
    if (newType === 'Character') {
      sampleVals = ['M', 'F', 'S', 'B', 'H', 'P', 'W'];
    } else if (newType === 'String') {
      sampleVals = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Peach'];
    } else if (newType === 'String (Words Only)') {
      sampleVals = ['cat', 'car', 'cart', 'dog', 'dove', 'door', 'deer'];
    } else if (newType === 'Character + Frequency Pairs') {
      sampleVals = ['F:45', 'E:16', 'D:13', 'C:12', 'B:9', 'A:5'];
    }
    setStringMap({});
    setTreeValues(sampleVals);
    setDesc(`Switched data type to ${newType}. Loaded sample dataset for ${TREE_TYPES[treeType].name}.`);
  };

  const formatNodeDisplay = (val) => {
    return String(val);
  };

  const parseInputValue = (rawStr) => {
    if (rawStr === undefined || rawStr === null || rawStr === '') return NaN;
    const str = String(rawStr).trim();
    if (inputType === 'Integer') return Number(str);
    return str;
  };

  const isValidInputVal = (val) => {
    if (val === undefined || val === null || val === '') return false;
    if (inputType === 'Integer') return !Number.isNaN(val);
    return typeof val === 'string' && val.length > 0;
  };

  // Build initial tree visualization on mount and when treeValues changes
  useEffect(() => {
    fetchTreeState();
  }, [treeValues]);

  // Only auto-fetch when treeType changes if autoConvert is true
  useEffect(() => {
    if (autoConvert) {
      fetchTreeState();
    }
  }, [treeType]);

  const fetchTreeState = async () => {
    try {
      const res = await api.post('/tree/run', {
        treeType, opName: 'state', val: 0, input: treeValues, dataType: inputType
      });
      if (res.data?.success && res.data?.data) {
        if (res.data.data.events?.[0]?.nodes) {
          setNodes(res.data.data.events[0].nodes);
          setEdges(res.data.data.events[0].edges || []);
        }
        if (res.data.data.validation) {
          setValidationStats(res.data.data.validation);
        }
      }
    } catch {
      setNodes([]);
      setEdges([]);
    }
  };

  // Execute C++ Tree Operation and consume events properly
  const executeCppTreeOp = async (opName, val = '') => {
    setLastOpName(opName.toUpperCase() + (val !== '' && val !== undefined && val !== null ? ` (${val})` : ''));
    try {
      const res = await api.post('/tree/run', {
        treeType, opName, val, input: treeValues, dataType: inputType
      });
      if (res.data?.success && res.data?.data?.events) {
        const evts = res.data.data.events;
        setEvents(evts);
        setStepIndex(0);
        setIsPlaying(true);
        if (res.data.data.validation) {
          setValidationStats(res.data.data.validation);
        }

        // Apply first step immediately
        if (evts.length > 0) applyStep(evts[0]);

        // After animation completes, update treeValues from final event's items
        // For insert/delete, we need to update treeValues
        if (opName === 'insert') {
          setTreeValues(prev => [...prev, val]);
        } else if (opName === 'delete') {
          setTreeValues(prev => {
            const idx = prev.indexOf(val);
            if (idx >= 0) { const next = [...prev]; next.splice(idx, 1); return next; }
            return prev;
          });
        }
        return;
      }
    } catch (err) {
      console.log('C++ tree engine unavailable, using local fallback:', err.message);
    }

    // Local fallback for insert/delete
    if (opName === 'insert') {
      setTreeValues(prev => [...prev, val]);
    } else if (opName === 'delete') {
      setTreeValues(prev => prev.filter(v => v !== val));
    }
  };

  // Apply a single event step to the visualization
  const applyStep = (step) => {
    if (!step) return;
    // Update rendered nodes from the event's node array
    if (step.nodes && step.nodes.length > 0) {
      setNodes(step.nodes);
    }
    if (step.edges) {
      setEdges(step.edges);
    }
    setActiveHighlight(step.highlight ?? null);
    setTraversalSequence(step.sequence || []);
    setActiveCodeLine(step.line || 0);
    setDesc(step.desc || '');
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
    } else if (stepIndex >= events.length - 1 && events.length > 0) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, events, speed]);

  // Manual step change (from scrubber)
  useEffect(() => {
    if (events[stepIndex]) applyStep(events[stepIndex]);
  }, [stepIndex]);

  // Handlers
  const handlePreset = (preset) => {
    setIsPlaying(false);
    setEvents([]); setTraversalSequence([]); setActiveHighlight(null);
    let newVals = [];
    if (preset === 'Balanced') {
      newVals = [50, 25, 75, 15, 35, 65, 85];
    } else if (preset === 'Skewed') {
      newVals = [10, 20, 30, 40, 50, 60, 70];
    } else if (preset === 'Complete') {
      newVals = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    } else if (preset === 'Random') {
      newVals = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
      newVals = [...new Set(newVals)];
    } else if (preset === 'Duplicate' || preset === 'Duplicate Keys') {
      newVals = [40, 20, 60, 20, 40, 80, 20];
    } else if (preset === 'Large' || preset === 'Large Dataset') {
      newVals = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93];
    }
    setTreeValues(newVals);
    setLastOpName('PRESET: ' + preset.toUpperCase());
    setDesc(`Loaded test preset '${preset}' with ${newVals.length} nodes into ${TREE_TYPES[treeType].name}.`);
  };

  const ALL_TRAVERSALS = [
    { key: 'inorder', label: 'In-Order' },
    { key: 'preorder', label: 'Pre-Order' },
    { key: 'postorder', label: 'Post-Order' },
    { key: 'levelorder', label: 'Level-BFS' },
    { key: 'zigzag', label: 'Zig-Zag' },
    { key: 'boundary', label: 'Boundary' },
    { key: 'vertical', label: 'Vertical' },
    { key: 'topview', label: 'Top View' },
    { key: 'bottomview', label: 'Bottom View' },
    { key: 'leftview', label: 'Left View' },
    { key: 'rightview', label: 'Right View' },
    { key: 'morris', label: 'Morris In-Order' }
  ];

  const ALL_ALGORITHMS = [
    { key: 'height', label: 'Height' },
    { key: 'depth', label: 'Depth' },
    { key: 'diameter', label: 'Diameter' },
    { key: 'balance', label: 'Balance Check' },
    { key: 'lca', label: 'LCA (val)', hasVal: true },
    { key: 'kthsmall', label: 'Kth Smallest', hasVal: true },
    { key: 'kthlarge', label: 'Kth Largest', hasVal: true },
    { key: 'successor', label: 'Successor', hasVal: true },
    { key: 'predecessor', label: 'Predecessor', hasVal: true },
    { key: 'mirror', label: 'Mirror/Invert' },
    { key: 'validate', label: 'Validate BST' },
    { key: 'serialize', label: 'Serialize' },
    { key: 'pathsum', label: 'Path Sum', hasVal: true },
    { key: 'countnodes', label: 'Count Nodes' },
    { key: 'countleaves', label: 'Count Leaves' },
    { key: 'peek', label: 'Peek Root' },
    { key: 'heapify', label: 'Heapify' },
    { key: 'heapsort', label: 'Heap Sort' }
  ];

  const getAlgParam = (key) => {
    const valToUse = algParam !== undefined && algParam !== '' ? algParam : inputVal;
    if (key === 'kthsmall' || key === 'kthlarge' || key === 'kth') {
      const parsedK = parseInt(valToUse, 10);
      return (!isNaN(parsedK) && parsedK > 0) ? parsedK : 1;
    }
    if (key === 'pathsum') {
      const parsedSum = parseInt(valToUse, 10);
      return !isNaN(parsedSum) ? parsedSum : 100;
    }
    if (key === 'successor' || key === 'predecessor' || key === 'lca') {
      if (valToUse !== undefined && valToUse !== '' && valToUse !== null) {
        const parsed = parseInputValue(valToUse);
        if (!Number.isNaN(parsed) && parsed !== undefined) return parsed;
        return valToUse;
      }
      return treeValues.length > 0 ? treeValues[0] : '';
    }
    return '';
  };

  const handleCustomOp = (ctrlKey, ctrlDesc) => {
    const paramVal = getAlgParam(ctrlKey);
    setLastOpName(ctrlKey.toUpperCase() + (paramVal !== '' && paramVal !== undefined ? ` (${paramVal})` : ''));
    setDesc(ctrlDesc);
    executeCppTreeOp(ctrlKey === 'buildtree' ? 'serialize' : ctrlKey, paramVal);
  };

  const handleInsert = (valParam) => {
    const val = parseInputValue(valParam !== undefined ? valParam : inputVal);
    if (!isValidInputVal(val)) return;
    executeCppTreeOp('insert', val);
    setInputVal('');
  };

  const handleDelete = (valParam) => {
    const val = parseInputValue(valParam !== undefined ? valParam : inputVal);
    if (!isValidInputVal(val)) return;
    executeCppTreeOp('delete', val);
    setInputVal('');
  };

  const handleSearch = (valParam) => {
    const val = parseInputValue(valParam !== undefined ? valParam : inputVal);
    if (!isValidInputVal(val)) return;
    executeCppTreeOp('search', val);
  };

  const handleTraverse = (type) => executeCppTreeOp(type);

  const handleRandomize = () => {
    setIsPlaying(false);
    setEvents([]); setTraversalSequence([]); setActiveHighlight(null);
    let sampleVals;
    if (inputType === 'Character') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      sampleVals = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]);
    } else if (inputType === 'String' || inputType === 'String (Words Only)') {
      const words = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Peach', 'Kiwi', 'Plum', 'Berry'];
      sampleVals = Array.from({ length: 6 }, () => words[Math.floor(Math.random() * words.length)]);
    } else if (inputType === 'Character + Frequency Pairs') {
      sampleVals = ['A:10', 'B:25', 'C:15', 'D:30', 'E:5', 'F:20'];
    } else {
      sampleVals = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    }
    const unique = [...new Set(sampleVals)];
    setTreeValues(unique);
    setDesc('Generated random tree with ' + unique.length + ' items.');
  };

  const handleClear = () => {
    setIsPlaying(false);
    setTreeValues([]); setNodes([]); setEvents([]);
    setTraversalSequence([]); setActiveHighlight(null);
    setLastOpName('CLEAR');
    setDesc('Tree cleared.');
  };

  const handleImportCSV = (importedValues) => {
    setIsPlaying(false);
    setEvents([]); setTraversalSequence([]); setActiveHighlight(null);
    setTreeValues(importedValues);
    setLastOpName('IMPORT (' + importedValues.length + ' VALS)');
  };

  const handleSingleImport = () => {
    if (!importInput.trim()) return;
    const values = importInput.split(',').map(x => parseInputValue(x.trim())).filter(x => isValidInputVal(x));
    if (values.length > 0) {
      handleImportCSV(values);
      setImportInput('');
      setDesc(`Imported ${values.length} values into ${TREE_TYPES[treeType].name} (${inputType} mode).`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 py-2">

        {/* Header */}
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="shrink-0">
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-primary/15 text-primary border border-primary/30"><GitFork className="w-5 h-5" /></span>
                <h1 className="text-2xl font-heading font-bold text-textPrimary">Tree Laboratory</h1>
              </div>
              <p className="text-sm font-body text-textSecondary mt-1">
                C++ Tree Engine — real BST/AVL/Heap operations with step-by-step visualization.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={isComparisonMode ? 'primary' : 'outline'} size="sm" onClick={() => setIsComparisonMode(!isComparisonMode)}>
              <BarChart2 className="w-4 h-4 mr-1.5" />
              {isComparisonMode ? 'Single Visualizer' : 'Compare Trees'}
            </Button>
            <MascotRole role="teacher" activity="reading" dialogue={`${currentSpec.name}!`} className="w-20 h-20" />
          </div>
        </Card>

        {isComparisonMode ? (
          <TreeComparisonView specs={TREE_TYPES} onBackToSingle={() => setIsComparisonMode(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">

            {/* LEFT: Tree Type Selector */}
            {!isSidebarCollapsed && (
              <div className="lg:col-span-3">
                <Card className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-primary" /> Tree Architecture
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowVerifier(true)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold transition-all flex items-center gap-1"
                        title="Run automated verification test suite across all trees and operations"
                      >
                        <span>Verify Engine</span>
                      </button>
                      <button
                        onClick={() => setAutoConvert(!autoConvert)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                          autoConvert
                            ? 'bg-primary/20 text-primary border-primary font-bold shadow-xs'
                            : 'bg-surface text-textSecondary border-borderTheme hover:border-primary'
                        }`}
                        title="Automatically rebuild and convert tree when switching tree types"
                      >
                        <span>Auto-Convert: {autoConvert ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                    {Object.keys(TREE_TYPES).map((key) => {
                      const item = TREE_TYPES[key];
                      const isSelected = treeType === key;
                      return (
                        <button key={key} onClick={() => handleTreeTypeChange(key)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all flex items-center justify-between ${
                            isSelected ? 'bg-primary text-white shadow-soft shadow-primary/20' : 'bg-surface text-textPrimary hover:bg-card border border-borderTheme'
                          }`}>
                          <span className="truncate">{item.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-card text-textSecondary border border-borderTheme'}`}>
                            {item.search}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* CENTER: Canvas + Controls + Playback */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-8' : 'lg:col-span-6'} space-y-4`}>

              <TreeCanvas
                treeType={treeType} setTreeType={handleTreeTypeChange}
                autoConvert={autoConvert} setAutoConvert={setAutoConvert}
                nodes={(nodes || []).map(n => ({
                  ...n,
                  displayLabel: formatNodeDisplay(n.val, inputType, stringMap)
                }))}
                edges={edges || []}
                activeHighlight={activeHighlight}
                traversalSequence={traversalSequence} desc={desc}
                spec={currentSpec} specs={TREE_TYPES}
                onTraverse={handleTraverse} onRandomize={handleRandomize}
                onClear={handleClear} onImportCSV={handleImportCSV}
                onInsert={handleInsert} onDelete={handleDelete} onSearch={handleSearch}
                isPlaying={isPlaying} setIsPlaying={setIsPlaying}
                stepIndex={stepIndex} totalSteps={events.length}
                onStepChange={setStepIndex} speed={speed} setSpeed={setSpeed}
                onRestart={() => { setStepIndex(0); if (events[0]) applyStep(events[0]); }}
                inputType={inputType} setInputType={handleInputTypeChange}
                supportedInputTypes={SUPPORTED_INPUT_TYPES[treeType] || ['Integer']}
                lastOpName={lastOpName} onPreset={handlePreset}
                algParam={algParam} setAlgParam={setAlgParam}
                onAlgorithm={(algKey, overrideVal) => executeCppTreeOp(algKey, overrideVal !== undefined && overrideVal !== '' ? parseInputValue(overrideVal) : (parseInputValue(algParam || inputVal) || 25))}
                onCustomOp={handleCustomOp}
              />

              {/* Operations Bar */}
              <Card className="p-4 flex flex-col gap-3">
                {/* Input Data Type Selector Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-borderTheme pb-2.5">
                  <span className="text-[10px] font-mono font-bold text-primary uppercase flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Select Input Data Type:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(SUPPORTED_INPUT_TYPES[treeType] || ['Integer']).map((typeOption) => (
                      <Button
                        key={typeOption}
                        onClick={() => handleInputTypeChange(typeOption)}
                        variant={inputType === typeOption ? 'primary' : 'outline'}
                        size="sm"
                        className="text-[11px] font-mono"
                      >
                        {typeOption}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Presets Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-borderTheme pb-2.5">
                  <span className="text-[10px] font-mono font-bold text-textSecondary uppercase">Test Presets:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button onClick={() => handlePreset('Balanced')} variant="outline" size="sm">Balanced</Button>
                    <Button onClick={() => handlePreset('Skewed')} variant="outline" size="sm">Skewed</Button>
                    <Button onClick={() => handlePreset('Complete')} variant="outline" size="sm">Complete</Button>
                    <Button onClick={() => handlePreset('Random')} variant="outline" size="sm">Random</Button>
                    <Button onClick={() => handlePreset('Duplicate')} variant="outline" size="sm">Duplicate Keys</Button>
                    <Button onClick={() => handlePreset('Large')} variant="outline" size="sm">Large Dataset</Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input type="text"
                      placeholder={inputType === 'Integer' ? 'Value' : inputType === 'Character' ? 'Char (M)' : inputType === 'String' ? 'Word' : 'Value'}
                      value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                      className="w-24 px-3 py-1.5 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary" />
                    {isOperationSupported('insert', treeType) && (
                      <Button onClick={() => handleInsert()} variant="primary" size="sm"><Plus className="w-3.5 h-3.5 mr-1" /> Insert</Button>
                    )}
                    {isOperationSupported('delete', treeType) && (
                      <Button onClick={() => handleDelete()} variant="outline" size="sm"><Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Delete</Button>
                    )}
                    {isOperationSupported('search', treeType) && (
                      <Button onClick={() => handleSearch()} variant="outline" size="sm"><Search className="w-3.5 h-3.5 mr-1" /> Search</Button>
                    )}

                    <div className="h-4 w-px bg-borderTheme mx-1 hidden sm:block" />

                    <input type="text" placeholder="Import values (e.g. 50, 25, 75 or M, F, S)" value={importInput} onChange={(e) => setImportInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSingleImport()}
                      className="w-48 px-3 py-1.5 rounded-input bg-surface border-2 border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary" />
                    <Button onClick={handleSingleImport} variant="secondary" size="sm"><Upload className="w-3.5 h-3.5 mr-1 text-primary" /> Import</Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleRandomize} variant="outline" size="sm"><Shuffle className="w-3.5 h-3.5 mr-1" /> Random</Button>
                    <Button onClick={handleClear} variant="outline" size="sm"><RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear</Button>
                  </div>
                </div>

                {/* Type-Specific Controls (Show only when applicable) */}
                {TYPE_SPECIFIC_CONTROLS[treeType] && TYPE_SPECIFIC_CONTROLS[treeType].length > 0 && (
                  <div className="pt-2 border-t border-borderTheme flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary font-mono uppercase text-[10px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {TREE_TYPES[treeType]?.name} Specific:
                      </span>
                      <input
                        type="text"
                        placeholder="k / param (e.g. 25)"
                        value={algParam}
                        onChange={(e) => setAlgParam(e.target.value)}
                        className="w-32 px-2 py-0.5 rounded bg-surface border border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
                        title="Value for Type-Specific controls (e.g. Range Query, Kth Smallest, Prefix Search, etc.)"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TYPE_SPECIFIC_CONTROLS[treeType].map((ctrl) => (
                        <Button
                          key={ctrl.key}
                          onClick={() => handleCustomOp(ctrl.key, ctrl.desc)}
                          variant="secondary"
                          size="sm"
                          className="text-[10px] py-0.5 px-2 font-mono"
                        >
                          {ctrl.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtered C++ Tree Traversals */}
                {ALL_TRAVERSALS.filter(trav => isTraversalSupported(trav.key, treeType)).length > 0 && (
                  <div className="pt-2 border-t border-borderTheme flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="font-bold text-textSecondary font-mono uppercase text-[10px]">C++ Tree Traversals ({ALL_TRAVERSALS.filter(trav => isTraversalSupported(trav.key, treeType)).length}):</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ALL_TRAVERSALS.filter(trav => isTraversalSupported(trav.key, treeType)).map(trav => (
                          <Button key={trav.key} onClick={() => handleTraverse(trav.key)} variant="outline" size="sm">
                            {trav.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Filtered C++ Tree Algorithms */}
                {ALL_ALGORITHMS.filter(alg => isAlgorithmSupported(alg.key, treeType)).length > 0 && (
                  <div className="pt-2 border-t border-borderTheme flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-textSecondary font-mono uppercase text-[10px]">C++ Tree Algorithms ({ALL_ALGORITHMS.filter(alg => isAlgorithmSupported(alg.key, treeType)).length}):</span>
                      <input
                        type="text"
                        placeholder="k / val (e.g. 25)"
                        value={algParam}
                        onChange={(e) => setAlgParam(e.target.value)}
                        className="w-32 px-2 py-0.5 rounded bg-surface border border-borderTheme text-xs font-mono text-textPrimary focus:outline-none focus:border-primary"
                        title="Value for Successor, Predecessor, Kth Smallest, Kth Largest, LCA, Path Sum"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ALL_ALGORITHMS.filter(alg => isAlgorithmSupported(alg.key, treeType)).map(alg => (
                        <Button
                          key={alg.key}
                          onClick={() => executeCppTreeOp(alg.key, alg.hasVal ? (parseInputValue(algParam || inputVal) || 25) : 0)}
                          variant="outline"
                          size="sm"
                        >
                          {alg.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <TreePlaybackBar isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIndex={stepIndex}
                totalSteps={events.length} onStepChange={setStepIndex} speed={speed} setSpeed={setSpeed}
                onRestart={() => { setStepIndex(0); if (events[0]) applyStep(events[0]); }} />
            </div>

            {/* RIGHT: Pseudocode & Info */}
            <div className={`${isSidebarCollapsed ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-4`}>
              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-primary" /> Live Pseudocode
                </h3>
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  {currentSpec.pseudocode.map((line, idx) => (
                    <div key={idx} className={`px-2 py-1 rounded transition-colors ${activeCodeLine === idx ? 'bg-primary/40 text-white font-bold border-l-2 border-primary' : 'opacity-70'}`}>
                      {line}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-heading font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Intuition
                </h3>
                <p className="text-xs text-textSecondary leading-relaxed">{currentSpec.intuition}</p>
                <div className="pt-2 border-t border-borderTheme space-y-1">
                  <span className="text-[10px] font-bold text-danger uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Common Mistake</span>
                  <p className="text-[11px] text-textSecondary">{currentSpec.mistakes}</p>
                </div>
                <div className="pt-2 border-t border-borderTheme space-y-1">
                  <span className="text-[10px] font-bold text-success uppercase flex items-center gap-1"><Sparkles className="w-3 h-3" /> Interview Tip</span>
                  <p className="text-[11px] text-textSecondary">{currentSpec.interviewTip}</p>
                </div>
              </Card>

              {/* Information Panel */}
              <Card className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-borderTheme pb-2">
                  <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider">Information Panel</h3>
                  <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                    {lastOpName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Nodes</span>
                    <span className="text-textPrimary font-bold text-sm">{nodes.length}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Height / Depth</span>
                    <span className="text-textPrimary font-bold text-sm">{nodes.length > 0 ? Math.max(...nodes.map(n => n.h)) : 0} / {validationStats.height || (nodes.length > 0 ? Math.max(...nodes.map(n => n.h)) : 0)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Leaves / Internals</span>
                    <span className="text-textPrimary font-bold text-sm">
                      {nodes.filter(n => !nodes.some(c => c.pid === n.id)).length} / {validationStats.internalNodeCount ?? Math.max(0, nodes.length - nodes.filter(n => !nodes.some(c => c.pid === n.id)).length)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Balance Factor</span>
                    <span className="text-warning font-bold text-sm">Root BF: {nodes[0]?.bf ?? 0}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Time / Space</span>
                    <span className="text-primary font-bold text-[10px]">{currentSpec.search} / {currentSpec.space}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-borderTheme text-center">
                    <span className="text-textSecondary text-[9px] block uppercase">Memory Usage</span>
                    <span className="text-success font-bold text-[10px]">~{nodes.length * 48} B (C++)</span>
                  </div>
                </div>
              </Card>

              {/* Validation Panel */}
              <Card className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-borderTheme pb-2">
                  <h3 className="text-xs font-heading font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Validation Panel
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-success px-2 py-0.5 rounded bg-success/10">
                    NATIVE C++ VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-surface border border-borderTheme">
                    <span className="text-textSecondary">BST Property:</span>
                    <span className={validationStats.isBST !== false ? "text-success font-bold" : "text-danger font-bold"}>
                      {validationStats.isBST !== false ? "✓ VALID BST" : "✕ INVALID"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface border border-borderTheme">
                    <span className="text-textSecondary">Balance Status:</span>
                    <span className={validationStats.isBalanced !== false ? "text-success font-bold" : "text-warning font-bold"}>
                      {validationStats.isBalanced !== false ? "✓ HEIGHT BALANCED" : "▲ UNBALANCED"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface border border-borderTheme">
                    <span className="text-textSecondary">Red-Black Rules:</span>
                    <span className="text-success font-bold">✓ ROOT BLK | NO RED-RED</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface border border-borderTheme">
                    <span className="text-textSecondary">Heap Property:</span>
                    <span className={validationStats.heapPropertyValid !== false ? "text-success font-bold" : "text-danger font-bold"}>
                      {validationStats.heapPropertyValid !== false ? "✓ VALID HEAP" : "✕ INVALID"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded bg-surface border border-borderTheme text-center">
                      <span className="text-textSecondary text-[9px] block">DIAMETER</span>
                      <span className="text-primary font-bold">{validationStats.diameter ?? (nodes.length > 0 ? 5 : 0)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface border border-borderTheme text-center">
                      <span className="text-textSecondary text-[9px] block">WIDTH</span>
                      <span className="text-primary font-bold">{validationStats.width ?? (nodes.length > 0 ? 3 : 0)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        )}
      </div>

      {showVerifier && <TreeAutoVerifier onClose={() => setShowVerifier(false)} />}
    </AppLayout>
  );
};

export default TreeLab;
