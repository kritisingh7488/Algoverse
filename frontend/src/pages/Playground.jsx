import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  RotateCcw, 
  Shuffle, 
  Plus, 
  Trash2, 
  Search, 
  Undo, 
  Redo, 
  Sparkles, 
  ArrowRight,
  Activity,
  Info,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Code,
  Lightbulb,
  AlertTriangle,
  RotateCw,
  Eye,
  Zap,
  ArrowLeftRight,
  Maximize2
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/common/Button';

const STRUCTURE_SPECS = {
  array: {
    name: 'Array / Dynamic Array',
    category: 'Linear',
    description: 'Contiguous memory block allowing O(1) random index access but requiring O(N) shifts for non-tail insertions and deletions.',
    bestTime: 'O(1) Access',
    worstTime: 'O(N) Search/Shift',
    space: 'O(N)',
    pseudocode: [
      '// Insert at index idx',
      'for i = length - 1 down to idx:',
      '  arr[i + 1] = arr[i] // shift right',
      'arr[idx] = newValue',
      'length++'
    ],
    intuition: 'Arrays store elements in contiguous physical memory addresses. Access by index is instantaneous via base address calculation: addr = base + idx * size.',
    mistakes: 'Out-of-bounds indexing; forgetting that element shifting takes linear O(N) time for non-tail insertions.',
    interviewTip: 'When asked to optimize array operations, consider two-pointer techniques or prefix sums to avoid O(N²) nested loops.'
  },
  stack: {
    name: 'Stack (LIFO)',
    category: 'Linear',
    description: 'Last-In, First-Out structure where elements are added and removed strictly from the top.',
    bestTime: 'O(1) Push/Pop',
    worstTime: 'O(1) Top Access',
    space: 'O(N)',
    pseudocode: [
      'function push(val):',
      '  if size == capacity: raise StackOverflow',
      '  top++',
      '  stack[top] = val',
      'function pop():',
      '  if top == -1: raise StackUnderflow',
      '  val = stack[top]; top--; return val'
    ],
    intuition: 'Think of a stack of plates. You place new plates on top and remove from the top. The last plate placed is the first one removed.',
    mistakes: 'Attempting to pop from an empty stack (Stack Underflow) or exceeding allocated capacity (Stack Overflow).',
    interviewTip: 'Stacks are perfect for expression evaluation (RPN), balancing parentheses, depth-first search, and tracking recursion.'
  },
  queue: {
    name: 'Queue (FIFO & Circular)',
    category: 'Linear',
    description: 'First-In, First-Out structure where items enter at the rear and exit from the front.',
    bestTime: 'O(1) Enqueue/Dequeue',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: [
      'function enqueue(val):',
      '  rear = (rear + 1) % Capacity',
      '  queue[rear] = val',
      'function dequeue():',
      '  val = queue[front]',
      '  front = (front + 1) % Capacity'
    ],
    intuition: 'Think of a line at a ticket counter. First person to join the queue is the first person served.',
    mistakes: 'Confusing Front and Rear pointers in linear arrays without circular wrapping.',
    interviewTip: 'Queues are indispensable for Breadth-First Search (BFS), task scheduling queues, and buffering asynchronous data streams.'
  },
  linkedlist: {
    name: 'Singly Linked List',
    category: 'Linear',
    description: 'Sequence of nodes containing data and pointers to the next node, scattered dynamically in memory.',
    bestTime: 'O(1) Head Insert/Delete',
    worstTime: 'O(N) Search/Access',
    space: 'O(N)',
    pseudocode: [
      'function reverseList(head):',
      '  prev = null, curr = head',
      '  while curr != null:',
      '    nextTemp = curr.next',
      '    curr.next = prev',
      '    prev = curr; curr = nextTemp',
      '  return prev'
    ],
    intuition: 'Nodes act as a scavenger hunt: each element tells you where to find the next element via pointer references.',
    mistakes: 'Losing the reference to the head node or creating infinite loops during pointer manipulation.',
    interviewTip: 'Master fast and slow pointer techniques (Floyd Cycle Detection) to find midpoints or loops in a single pass.'
  }
};

const Playground = () => {
  const [structureKey, setStructureKey] = useState('array');
  const [items, setItems] = useState([12, 34, 56, 78, 90, 23]);
  const [inputValue, setInputValue] = useState('');
  const [targetIndex, setTargetIndex] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  
  // Specific Structure Configs
  const [stackCapacity, setStackCapacity] = useState(8);
  const [queueCapacity, setQueueCapacity] = useState(8);
  const [frontPtr, setFrontPtr] = useState(0);
  const [rearPtr, setRearPtr] = useState(3);
  const [pointers, setPointers] = useState({}); // { slow: idx, fast: idx, prev: idx, curr: idx }

  // Animation / Stepper State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [events, setEvents] = useState([]);
  
  // Live State Highlight
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [activeCodeLine, setActiveCodeLine] = useState(0);
  const [explanation, setExplanation] = useState({
    op: 'Initialized',
    desc: 'Data structure loaded and ready for interaction.',
    time: 'O(1)',
    space: 'O(N)'
  });

  // Undo / Redo Stacks
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const currentSpec = STRUCTURE_SPECS[structureKey];

  // Reset or initialize when structure changes
  useEffect(() => {
    setIsPlaying(false);
    setStepIndex(0);
    setEvents([]);
    setActiveHighlight(null);
    setPointers({});

    if (structureKey === 'array') {
      setItems([12, 34, 56, 78, 90, 23]);
    } else if (structureKey === 'stack') {
      setItems([45, 67, 89]);
    } else if (structureKey === 'queue') {
      setItems([10, 20, 30, 40]);
      setFrontPtr(0);
      setRearPtr(3);
    } else if (structureKey === 'linkedlist') {
      setItems([5, 15, 25, 35]);
    }
  }, [structureKey]);

  // Stepper Effect
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
    if (step.items !== undefined) setItems(step.items);
    if (step.front !== undefined) setFrontPtr(step.front);
    if (step.rear !== undefined) setRearPtr(step.rear);
    if (step.pointers !== undefined) setPointers(step.pointers);
    setActiveHighlight(step.highlight);
    setActiveCodeLine(step.line || 0);
    setExplanation({
      op: step.op || 'Step',
      desc: step.desc || '',
      time: step.time || 'O(1)',
      space: step.space || 'O(1)'
    });
  };

  const saveHistory = () => {
    setHistory([...history, { items: [...items], explanation, frontPtr, rearPtr }]);
    setRedoStack([]);
  };

  // ================= ARRAY OPERATIONS =================
  const handleArrayInsert = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    const idx = targetIndex !== '' ? Math.max(0, Math.min(items.length, parseInt(targetIndex))) : items.length;
    saveHistory();

    let steps = [];
    steps.push({
      items: [...items], highlight: idx, line: 1, op: `Target Index [${idx}]`,
      desc: `Preparing to insert value ${val} at index ${idx}.`, time: 'O(N)', space: 'O(1)'
    });

    const next = [...items];
    next.splice(idx, 0, val);

    steps.push({
      items: next, highlight: idx, line: 3, op: `Inserted ${val}`,
      desc: `Shifted elements right and inserted ${val} at index ${idx}.`, time: idx === items.length ? 'O(1)' : 'O(N)', space: 'O(1)'
    });

    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
    setTargetIndex('');
  };

  const handleArrayDelete = () => {
    if (items.length === 0) return;
    const idx = targetIndex !== '' ? Math.max(0, Math.min(items.length - 1, parseInt(targetIndex))) : items.length - 1;
    const removedVal = items[idx];
    saveHistory();

    const next = items.filter((_, i) => i !== idx);
    let steps = [
      {
        items: [...items], highlight: idx, line: 1, op: `Locating Index [${idx}]`,
        desc: `Targeting element ${removedVal} at index ${idx} for removal.`, time: 'O(N)', space: 'O(1)'
      },
      {
        items: next, highlight: null, line: 3, op: `Deleted ${removedVal}`,
        desc: `Removed ${removedVal} and shifted left elements to close gap.`, time: idx === items.length - 1 ? 'O(1)' : 'O(N)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setTargetIndex('');
  };

  const handleArrayUpdate = () => {
    const val = parseInt(inputValue);
    const idx = parseInt(targetIndex);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx >= items.length) return;
    saveHistory();

    const next = [...items];
    const oldVal = next[idx];
    next[idx] = val;

    let steps = [
      {
        items: next, highlight: idx, line: 3, op: `Updated Index [${idx}]`,
        desc: `Updated arr[${idx}] from ${oldVal} to ${val}.`, time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
    setTargetIndex('');
  };

  const handleArrayReverse = () => {
    if (items.length === 0) return;
    saveHistory();

    let arr = [...items];
    let steps = [];
    let l = 0, r = arr.length - 1;

    steps.push({
      items: [...arr], highlight: null, pointers: { left: l, right: r }, line: 0, op: 'Reverse Array Start',
      desc: 'Initialized two pointers: Left at 0, Right at end.', time: 'O(N)', space: 'O(1)'
    });

    while (l < r) {
      let temp = arr[l];
      arr[l] = arr[r];
      arr[r] = temp;

      steps.push({
        items: [...arr], highlight: null, pointers: { left: l, right: r }, line: 2, op: `Swapped [${l}] & [${r}]`,
        desc: `Swapped elements at index ${l} and ${r}. Advancing pointers.`, time: 'O(N)', space: 'O(1)'
      });
      l++;
      r--;
    }

    steps.push({
      items: [...arr], highlight: null, pointers: {}, line: 3, op: 'Reverse Complete',
      desc: 'Array fully reversed.', time: 'O(N)', space: 'O(1)'
    });

    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setIsPlaying(true);
  };

  const handleArrayRotate = (dir) => {
    if (items.length === 0) return;
    saveHistory();

    let next = [...items];
    if (dir === 'left') {
      const first = next.shift();
      next.push(first);
    } else {
      const last = next.pop();
      next.unshift(last);
    }

    let steps = [
      {
        items: next, highlight: dir === 'left' ? next.length - 1 : 0, line: 1, op: `Rotate ${dir.toUpperCase()}`,
        desc: `Rotated array 1 position to the ${dir}.`, time: 'O(N)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
  };

  // ================= STACK OPERATIONS =================
  const handleStackPush = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    if (items.length >= stackCapacity) {
      setExplanation({
        op: 'STACK OVERFLOW EXCEPTION',
        desc: `Cannot push ${val}. Stack is full at capacity ${stackCapacity}!`,
        time: 'O(1)',
        space: 'O(1)'
      });
      return;
    }
    saveHistory();
    const next = [...items, val];
    let steps = [
      {
        items: next, highlight: next.length - 1, line: 2, op: `Push ${val}`,
        desc: `Pushed value ${val} onto top of stack (Top index ${next.length - 1}).`, time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
  };

  const handleStackPop = () => {
    if (items.length === 0) {
      setExplanation({
        op: 'STACK UNDERFLOW EXCEPTION',
        desc: 'Cannot pop. Stack is empty!',
        time: 'O(1)',
        space: 'O(1)'
      });
      return;
    }
    saveHistory();
    const removed = items[items.length - 1];
    const next = items.slice(0, -1);
    let steps = [
      {
        items: next, highlight: next.length > 0 ? next.length - 1 : null, line: 5, op: `Pop ${removed}`,
        desc: `Popped top element ${removed} from stack. New top is ${next.length > 0 ? next[next.length - 1] : 'NONE'}.`,
        time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
  };

  const handleStackPeek = () => {
    if (items.length === 0) return;
    const topVal = items[items.length - 1];
    setActiveHighlight(items.length - 1);
    setExplanation({
      op: `Peek Top: ${topVal}`,
      desc: `Examined top element ${topVal} at index ${items.length - 1} without removing it.`,
      time: 'O(1)',
      space: 'O(1)'
    });
  };

  // ================= QUEUE OPERATIONS =================
  const handleQueueEnqueue = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    if (items.length >= queueCapacity) {
      setExplanation({
        op: 'QUEUE OVERFLOW EXCEPTION',
        desc: `Cannot enqueue ${val}. Queue capacity ${queueCapacity} reached!`,
        time: 'O(1)',
        space: 'O(1)'
      });
      return;
    }
    saveHistory();
    const next = [...items, val];
    const newRear = (rearPtr + 1) % queueCapacity;
    let steps = [
      {
        items: next, highlight: next.length - 1, rear: newRear, line: 2, op: `Enqueue ${val}`,
        desc: `Enqueued ${val} at rear (Position ${newRear}).`, time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
  };

  const handleQueueDequeue = () => {
    if (items.length === 0) {
      setExplanation({
        op: 'QUEUE UNDERFLOW EXCEPTION',
        desc: 'Cannot dequeue. Queue is empty!',
        time: 'O(1)',
        space: 'O(1)'
      });
      return;
    }
    saveHistory();
    const removed = items[0];
    const next = items.slice(1);
    const newFront = (frontPtr + 1) % queueCapacity;
    let steps = [
      {
        items: next, highlight: 0, front: newFront, line: 5, op: `Dequeue ${removed}`,
        desc: `Dequeued front element ${removed}. Front pointer advanced to ${newFront}.`, time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
  };

  // ================= LINKED LIST OPERATIONS =================
  const handleLinkedListInsertHead = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    saveHistory();
    const next = [val, ...items];
    let steps = [
      {
        items: next, highlight: 0, line: 4, op: `Insert Head ${val}`,
        desc: `Created new node (${val}) and pointed its .next to former head node.`, time: 'O(1)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
  };

  const handleLinkedListInsertTail = () => {
    const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
    saveHistory();
    const next = [...items, val];
    let steps = [
      {
        items: next, highlight: next.length - 1, line: 4, op: `Insert Tail ${val}`,
        desc: `Traversed to last node and appended new node (${val}).`, time: 'O(N)', space: 'O(1)'
      }
    ];
    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setInputValue('');
  };

  const handleLinkedListReverse = () => {
    if (items.length === 0) return;
    saveHistory();

    let arr = [...items];
    let reversed = [];
    let steps = [];

    for (let i = arr.length - 1; i >= 0; i--) {
      reversed.push(arr[i]);
      steps.push({
        items: [...reversed, ...arr.slice(0, i)], highlight: 0, pointers: { curr: i, prev: i + 1 }, line: 4, op: `Reversing Node ${arr[i]}`,
        desc: `Flipped pointer direction for node ${arr[i]}.`, time: 'O(N)', space: 'O(1)'
      });
    }

    steps.push({
      items: reversed, highlight: 0, pointers: {}, line: 6, op: `Reverse Completed`,
      desc: `Singly Linked List reversed. New head is ${reversed[0]}.`, time: 'O(N)', space: 'O(1)'
    });

    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setIsPlaying(true);
  };

  const handleLinkedListMiddle = () => {
    if (items.length === 0) return;
    let steps = [];
    let slow = 0, fast = 0;

    while (fast < items.length && fast + 1 < items.length) {
      steps.push({
        items: [...items], highlight: slow, pointers: { slow, fast }, line: 1, op: 'Floyd Pointer Step',
        desc: `Slow pointer at [${slow}] (${items[slow]}), Fast pointer at [${fast}] (${items[fast]}).`, time: 'O(N)', space: 'O(1)'
      });
      slow += 1;
      fast += 2;
    }

    const midVal = items[slow];
    steps.push({
      items: [...items], highlight: slow, pointers: { slow }, line: 2, op: `Found Middle Node: ${midVal}`,
      desc: `Slow pointer reached middle node ${midVal} at index ${slow}.`, time: 'O(N)', space: 'O(1)'
    });

    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setIsPlaying(true);
  };

  // General Search
  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;

    let steps = [];
    let foundIdx = -1;

    for (let i = 0; i < items.length; i++) {
      const isMatch = items[i] === val;
      steps.push({
        items: [...items], highlight: i, line: 2, op: `Inspecting Index [${i}]`,
        desc: `Scanning index ${i}: element value ${items[i]} ${isMatch ? 'MATCHES' : 'does not match'} target ${val}.`,
        time: 'O(N)', space: 'O(1)'
      });
      if (isMatch) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx === -1) {
      steps.push({
        items: [...items], highlight: null, line: 4, op: `Search Failed`,
        desc: `Scanned all ${items.length} elements. Target value ${val} is not present.`,
        time: 'O(N)', space: 'O(1)'
      });
    }

    setEvents(steps);
    setStepIndex(0);
    applyStep(steps[0]);
    setIsPlaying(true);
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;
    saveHistory();
    const parsed = bulkInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (parsed.length > 0) {
      setItems(parsed);
      setActiveHighlight(null);
      setExplanation({
        op: 'Imported Custom Input',
        desc: `Loaded ${parsed.length} elements into ${currentSpec.name}.`,
        time: 'O(N)',
        space: 'O(N)'
      });
      setBulkInput('');
    }
  };

  const handleClear = () => {
    saveHistory();
    setItems([]);
    setActiveHighlight(null);
    setPointers({});
    setExplanation({
      op: 'Cleared Structure',
      desc: 'All elements removed from structure.',
      time: 'O(1)',
      space: 'O(1)'
    });
  };

  const handleRandomize = () => {
    saveHistory();
    const newItems = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    setItems(newItems);
    setActiveHighlight(null);
    setPointers({});
    setExplanation({
      op: 'Randomized Structure',
      desc: 'Generated 6 new random element values.',
      time: 'O(N)',
      space: 'O(N)'
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([{ items: [...items], explanation }, ...redoStack]);
    setItems(prev.items);
    setExplanation(prev.explanation);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, { items: [...items], explanation }]);
    setItems(next.items);
    setExplanation(next.explanation);
    setRedoStack(redoStack.slice(1));
  };

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
              <h1 className="text-2xl font-bold font-poppins text-gray-900">Data Structure Laboratory</h1>
            </div>
            <p className="text-sm text-gray-500 font-inter mt-1">
              Interactive memory layout inspector, pointer visualizer, and step-by-step operation engine.
            </p>
          </div>

          {/* Canvas Controls Toolbar */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleUndo} 
              disabled={history.length === 0} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 transition-all"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoStack.length === 0} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700 transition-all"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRandomize} 
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all"
              title="Randomize Elements"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={handleClear} 
              className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all"
              title="Clear All Elements"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Selector Sidebar */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Data Structures</h3>
            <div className="space-y-1.5">
              {Object.keys(STRUCTURE_SPECS).map((key) => {
                const spec = STRUCTURE_SPECS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setStructureKey(key)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                      structureKey === key
                        ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20'
                        : 'text-gray-600 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-poppins font-bold">{spec.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${structureKey === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {spec.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Capacity Controls for Stack/Queue */}
            {structureKey === 'stack' && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold font-poppins">
                  <span className="text-gray-500">Max Stack Capacity</span>
                  <span className="text-primary font-mono">{stackCapacity}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={stackCapacity}
                  onChange={e => setStackCapacity(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            )}

            {/* Custom CSV Input Box */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider">Custom CSV Input</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 10, 20, 30, 40"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <Button onClick={handleBulkImport} variant="outline" className="py-1.5 text-xs px-3">
                  Import
                </Button>
              </div>
            </div>
          </div>

          {/* Center Visualizer & Canvas */}
          <div className="lg:col-span-6 space-y-6">

            {/* Visualizer Canvas */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[360px] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-b border-gray-100 pb-3">
                <span>CANVAS: {currentSpec.name.toUpperCase()}</span>
                <span>SIZE: {items.length} ELEMENTS</span>
              </div>

              {/* Elements Renderer with Specific Structural Pointers */}
              <div className={`flex items-center justify-center gap-3 py-6 flex-wrap ${structureKey === 'stack' ? 'flex-col-reverse' : ''}`}>
                <AnimatePresence>
                  {items.map((val, idx) => {
                    const isTop = structureKey === 'stack' && idx === items.length - 1;
                    const isFront = structureKey === 'queue' && idx === 0;
                    const isRear = structureKey === 'queue' && idx === items.length - 1;
                    const isHead = structureKey === 'linkedlist' && idx === 0;
                    const isHighlighted = activeHighlight === idx;
                    const isSlow = pointers.slow === idx;
                    const isFast = pointers.fast === idx;

                    return (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="flex items-center"
                      >
                        <div className="flex flex-col items-center">
                          
                          {/* Top / Pointer Badges */}
                          {isTop && <span className="text-[10px] font-mono font-bold text-accent bg-pink-50 px-2 py-0.5 rounded-full mb-1">TOP ↑</span>}
                          {isFront && <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">FRONT</span>}
                          {isRear && !isFront && <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mb-1">REAR</span>}
                          {isHead && <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">HEAD</span>}
                          {isSlow && <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-1">SLOW</span>}
                          {isFast && <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full mb-1">FAST</span>}

                          {/* Element Node */}
                          <div className={`rounded-2xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 shadow-sm ${
                            structureKey === 'linkedlist' ? 'px-3 py-3 border-2 flex items-center gap-2' : 'w-14 h-14 border-2'
                          } ${
                            isHighlighted
                              ? 'bg-gradient-to-br from-accent to-pink-500 text-white border-accent shadow-lg shadow-accent/30 scale-110 ring-4 ring-accent/20'
                              : 'bg-gradient-to-br from-primary/10 via-primary/5 to-white border-primary/30 text-primary'
                          }`}>
                            <span>{val}</span>
                            {structureKey === 'linkedlist' && (
                              <span className="text-[10px] opacity-60 border-l border-primary/30 pl-2 font-mono">
                                ptr
                              </span>
                            )}
                          </div>

                          {/* Index Badge */}
                          <span className="text-[10px] font-mono text-gray-400 mt-1">
                            [{idx}]
                          </span>
                        </div>

                        {/* Linked List Arrow Pointer */}
                        {structureKey === 'linkedlist' && idx < items.length - 1 && (
                          <div className="flex items-center text-primary mx-1">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                        {structureKey === 'linkedlist' && idx === items.length - 1 && (
                          <span className="text-[10px] font-mono text-gray-400 ml-2 font-bold">→ NULL</span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {items.length === 0 && (
                  <p className="text-xs text-gray-400 font-mono italic">Structure is empty. Use controls below to insert elements.</p>
                )}
              </div>

              {/* Specific Structure Toolbar */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                
                {/* Inputs & Standard Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <input 
                    type="number"
                    placeholder="Val"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  {structureKey === 'array' && (
                    <input 
                      type="number"
                      placeholder="Index"
                      value={targetIndex}
                      onChange={(e) => setTargetIndex(e.target.value)}
                      className="w-20 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  )}

                  {/* Array Specific Action Buttons */}
                  {structureKey === 'array' && (
                    <>
                      <Button onClick={handleArrayInsert} variant="primary" className="py-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Insert
                      </Button>
                      <Button onClick={handleArrayDelete} variant="outline" className="py-2 text-xs">
                        <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Delete
                      </Button>
                      <Button onClick={handleArrayUpdate} variant="outline" className="py-2 text-xs">
                        Update
                      </Button>
                      <Button onClick={handleArrayReverse} variant="outline" className="py-2 text-xs">
                        Reverse
                      </Button>
                      <button onClick={() => handleArrayRotate('left')} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-mono" title="Rotate Left">
                        ← Rot
                      </button>
                      <button onClick={() => handleArrayRotate('right')} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-mono" title="Rotate Right">
                        Rot →
                      </button>
                    </>
                  )}

                  {/* Stack Specific Action Buttons */}
                  {structureKey === 'stack' && (
                    <>
                      <Button onClick={handleStackPush} variant="primary" className="py-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Push
                      </Button>
                      <Button onClick={handleStackPop} variant="outline" className="py-2 text-xs">
                        <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Pop
                      </Button>
                      <Button onClick={handleStackPeek} variant="outline" className="py-2 text-xs">
                        <Eye className="w-3.5 h-3.5 mr-1" /> Peek Top
                      </Button>
                    </>
                  )}

                  {/* Queue Specific Action Buttons */}
                  {structureKey === 'queue' && (
                    <>
                      <Button onClick={handleQueueEnqueue} variant="primary" className="py-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" /> Enqueue
                      </Button>
                      <Button onClick={handleQueueDequeue} variant="outline" className="py-2 text-xs">
                        <Trash2 className="w-3.5 h-3.5 mr-1 text-danger" /> Dequeue
                      </Button>
                    </>
                  )}

                  {/* Linked List Specific Action Buttons */}
                  {structureKey === 'linkedlist' && (
                    <>
                      <Button onClick={handleLinkedListInsertHead} variant="primary" className="py-2 text-xs">
                        + Head
                      </Button>
                      <Button onClick={handleLinkedListInsertTail} variant="outline" className="py-2 text-xs">
                        + Tail
                      </Button>
                      <Button onClick={handleLinkedListReverse} variant="outline" className="py-2 text-xs">
                        <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Reverse
                      </Button>
                      <Button onClick={handleLinkedListMiddle} variant="outline" className="py-2 text-xs">
                        Find Mid
                      </Button>
                    </>
                  )}

                  <Button onClick={handleSearch} variant="outline" className="py-2 text-xs">
                    <Search className="w-3.5 h-3.5 mr-1" /> Search
                  </Button>
                </div>

              </div>
            </div>

            {/* Stepper Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => { if (stepIndex > 0) { setStepIndex(stepIndex - 1); applyStep(events[stepIndex - 1]); } }} 
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { if (stepIndex < events.length - 1) { setStepIndex(stepIndex + 1); applyStep(events[stepIndex + 1]); } }}
                  disabled={stepIndex >= events.length - 1}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setStepIndex(0); if (events.length > 0) applyStep(events[0]); }}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">Speed:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      speed === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Educational Details Column */}
          <div className="lg:col-span-3 space-y-6">

            {/* Pseudocode Box with Line Highlighter */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-bold font-poppins text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" /> Operation Pseudocode
              </h3>
              <div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1 overflow-x-auto">
                {currentSpec.pseudocode.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 rounded transition-colors ${
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

export default Playground;
