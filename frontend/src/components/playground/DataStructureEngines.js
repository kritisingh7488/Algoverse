// Comprehensive Data Structure Engines for AlgoVerse Laboratory

export const STRUCTURE_SPECS = {
  array: {
    key: 'array',
    name: 'Dynamic Array',
    category: 'Linear',
    description: 'Contiguous memory block supporting O(1) index access, dynamic resizing, and O(N) element shifts for non-tail operations.',
    bestTime: 'O(1) Access',
    worstTime: 'O(N) Search/Shift',
    space: 'O(N)',
    pseudocode: {
      insert: [
        'function insert(index, value):',
        '  if size == capacity: resize(capacity * 2)',
        '  for i = size - 1 down to index:',
        '    arr[i + 1] = arr[i] // shift right',
        '  arr[index] = value',
        '  size++'
      ],
      delete: [
        'function delete(index):',
        '  val = arr[index]',
        '  for i = index to size - 2:',
        '    arr[i] = arr[i + 1] // shift left',
        '  size--',
        '  return val'
      ],
      search: [
        'function search(target):',
        '  for i = 0 to size - 1:',
        '    if arr[i] == target: return i',
        '  return -1'
      ],
      default: [
        '// Array Access & Memory Layout',
        'address = base_address + index * element_size',
        'value = memory[address]'
      ]
    },
    intuition: 'Elements occupy adjacent physical memory locations. Calculating an element address is instant (O(1)), but inserting or deleting in the middle forces adjacent items to shift.',
    advantages: ['O(1) random access by index', 'Cache-friendly spatial locality', 'Low memory overhead'],
    disadvantages: ['Fixed or expensive resize overhead', 'O(N) time for insertions/deletions in middle', 'Potential wasted capacity'],
    mistakes: 'Indexing out of bounds or forgetting that shifting elements incurs O(N) time complexity.',
    interviewTip: 'When optimizing array problems, use two-pointer methods, sliding windows, or prefix sums to eliminate O(N²) nested iterations.'
  },

  stack: {
    key: 'stack',
    name: 'Stack (LIFO)',
    category: 'Linear',
    description: 'Last-In, First-Out structure where operations occur exclusively at the Top pointer.',
    bestTime: 'O(1) Push/Pop',
    worstTime: 'O(1) Top Access',
    space: 'O(N)',
    pseudocode: {
      push: [
        'function push(value):',
        '  if top == capacity - 1:',
        '    raise StackOverflowException',
        '  top = top + 1',
        '  stack[top] = value'
      ],
      pop: [
        'function pop():',
        '  if top == -1:',
        '    raise StackUnderflowException',
        '  value = stack[top]',
        '  top = top - 1',
        '  return value'
      ],
      peek: [
        'function peek():',
        '  if top == -1: return NULL',
        '  return stack[top]'
      ],
      default: [
        '// LIFO Principle',
        'push: add to top',
        'pop: remove from top'
      ]
    },
    intuition: 'Like a stack of dinner plates: you put new plates on top (Push) and take plates off from the top (Pop). The last plate added is the first one removed.',
    advantages: ['Strict O(1) deterministic Push and Pop', 'Simple pointer tracking (Top)', 'Ideal for undo mechanisms and recursion'],
    disadvantages: ['No random index access', 'O(N) search time', 'Fixed capacity causes overflow if unmanaged'],
    mistakes: 'Popping from an empty stack (Underflow) or pushing beyond allocated capacity (Overflow).',
    interviewTip: 'Monotonic stacks are frequently used in LeetCode hard problems (Next Greater Element, Largest Rectangle in Histogram).'
  },

  queue: {
    key: 'queue',
    name: 'Queue (FIFO)',
    category: 'Linear',
    description: 'First-In, First-Out linear structure where items enter at the Rear pointer and exit at the Front pointer.',
    bestTime: 'O(1) Enqueue/Dequeue',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: {
      enqueue: [
        'function enqueue(value):',
        '  if size == capacity: raise QueueOverflow',
        '  rear = rear + 1',
        '  queue[rear] = value',
        '  size = size + 1'
      ],
      dequeue: [
        'function dequeue():',
        '  if size == 0: raise QueueUnderflow',
        '  value = queue[front]',
        '  front = front + 1',
        '  size = size - 1',
        '  return value'
      ],
      default: [
        '// FIFO Principle',
        'enqueue: add at rear',
        'dequeue: remove from front'
      ]
    },
    intuition: 'Like a line at a movie theater ticket counter: the first person to join the queue is the first person served.',
    advantages: ['Strict O(1) Enqueue and Dequeue', 'Fair processing order (FIFO)', 'Essential for Breadth-First Search (BFS)'],
    disadvantages: ['No random access', 'Standard linear array queues waste space without pointer shifting or circular buffers'],
    mistakes: 'Allowing Front and Rear to drift right in a fixed linear array without wrapping indices.',
    interviewTip: 'Queues are foundational for level-order tree traversals, web crawler task buffers, and async job schedulers.'
  },

  cqueue: {
    key: 'cqueue',
    name: 'Circular Queue',
    category: 'Linear',
    description: 'Queue implementation where Rear wraps around to index 0 using modulo arithmetic `(rear + 1) % capacity`.',
    bestTime: 'O(1) Enqueue/Dequeue',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: {
      enqueue: [
        'function enqueue(value):',
        '  if (rear + 1) % capacity == front:',
        '    raise QueueOverflow',
        '  rear = (rear + 1) % capacity',
        '  queue[rear] = value'
      ],
      dequeue: [
        'function dequeue():',
        '  if front == -1: raise QueueUnderflow',
        '  val = queue[front]',
        '  if front == rear: front = rear = -1',
        '  else: front = (front + 1) % capacity',
        '  return val'
      ],
      default: [
        'rear = (rear + 1) % capacity',
        'front = (front + 1) % capacity'
      ]
    },
    intuition: 'Connecting the end of a line back to the beginning creates a ring buffer, efficiently reusing vacated memory slots.',
    advantages: ['Fixed memory footprint', 'Zero memory drift', 'Ideal for streaming audio buffers and OS ring queues'],
    disadvantages: ['Fixed max capacity', 'Requires modulo operations'],
    mistakes: 'Confusing empty state `(front == -1)` with full state `((rear + 1) % capacity == front)`.',
    interviewTip: 'Used heavily in hardware device drivers, audio playback buffers, and CPU round-robin scheduling.'
  },

  singlylist: {
    key: 'singlylist',
    name: 'Singly Linked List',
    category: 'Linked',
    description: 'Dynamic sequence of nodes where each node stores data and a single `next` reference to the subsequent node.',
    bestTime: 'O(1) Head Insert/Delete',
    worstTime: 'O(N) Search/Access',
    space: 'O(N)',
    pseudocode: {
      insertHead: [
        'function insertHead(value):',
        '  newNode = Node(value)',
        '  newNode.next = head',
        '  head = newNode'
      ],
      insertTail: [
        'function insertTail(value):',
        '  newNode = Node(value)',
        '  if head == null: head = newNode; return',
        '  curr = head',
        '  while curr.next != null: curr = curr.next',
        '  curr.next = newNode'
      ],
      reverse: [
        'function reverse(head):',
        '  prev = null, curr = head',
        '  while curr != null:',
        '    nextTemp = curr.next',
        '    curr.next = prev',
        '    prev = curr; curr = nextTemp',
        '  return prev'
      ],
      default: [
        'struct Node {',
        '  int val;',
        '  Node* next;',
        '}'
      ]
    },
    intuition: 'Like a treasure hunt: each clue (node) gives you the location of the next clue (next pointer).',
    advantages: ['Dynamic sizing without contiguous allocation', 'O(1) insertion/deletion at Head', 'Zero memory wasted on unused array capacity'],
    disadvantages: ['O(N) sequential search and index access', 'Extra memory per node for pointer references', 'Cache non-friendly random memory locations'],
    mistakes: 'Losing reference to the Head node or dereferencing a NULL next pointer causing runtime crashes.',
    interviewTip: 'Always practice reversing a linked list in-place and detecting cycles using Floyd’s Fast & Slow pointers.'
  },

  doublylist: {
    key: 'doublylist',
    name: 'Doubly Linked List',
    category: 'Linked',
    description: 'Nodes contain both `next` and `prev` pointers, enabling bidirectional traversal and O(1) deletions given a node reference.',
    bestTime: 'O(1) Head/Tail Ops',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: {
      insertHead: [
        'function insertHead(val):',
        '  newNode = Node(val)',
        '  newNode.next = head',
        '  if head != null: head.prev = newNode',
        '  head = newNode'
      ],
      deleteNode: [
        'function deleteNode(node):',
        '  if node.prev != null: node.prev.next = node.next',
        '  else: head = node.next',
        '  if node.next != null: node.next.prev = node.prev'
      ],
      default: [
        'struct Node {',
        '  int val;',
        '  Node *prev, *next;',
        '}'
      ]
    },
    intuition: 'Like a train with couplings at both ends of each car: you can walk forward to the engine or backward to the caboose.',
    advantages: ['Bidirectional navigation', 'O(1) tail operations with Tail pointer', 'O(1) deletion when node pointer is known'],
    disadvantages: ['Higher memory overhead (two pointers per node)', 'More edge cases during link updating'],
    mistakes: 'Forgetting to update both `prev` and `next` references when splicing nodes.',
    interviewTip: 'Doubly linked lists combined with HashMaps power the LRU Cache algorithm.'
  },

  circularlist: {
    key: 'circularlist',
    name: 'Circular Linked List',
    category: 'Linked',
    description: 'Linked list where the final node`s `next` pointer links back to the Head node instead of NULL.',
    bestTime: 'O(1) Head/Tail Ops',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: {
      insertHead: [
        'function insertHead(val):',
        '  newNode = Node(val)',
        '  if head == null: newNode.next = newNode; head = newNode; return',
        '  tail = getTail()',
        '  newNode.next = head',
        '  tail.next = newNode; head = newNode'
      ],
      default: [
        '// Circular chain',
        'tail.next == head'
      ]
    },
    intuition: 'A continuous ring of nodes. You can start traversal at any node and loop continuously around the structure.',
    advantages: ['Entire list reachable from any starting node', 'Ideal for circular buffer queues and game turn rotations'],
    disadvantages: ['Infinite loop hazard if loop termination condition is wrong', 'Slightly more complex tail tracking'],
    mistakes: 'Using `while (curr != null)` instead of `while (curr.next != head)`.',
    interviewTip: 'Used in multiplayer turn games, round-robin CPU scheduling, and music playlist looping.'
  },

  deque: {
    key: 'deque',
    name: 'Deque (Double-Ended Queue)',
    category: 'Linear',
    description: 'Double-ended queue allowing O(1) insertions and deletions at both Front and Back ends.',
    bestTime: 'O(1) Front & Back Ops',
    worstTime: 'O(N) Search',
    space: 'O(N)',
    pseudocode: {
      pushFront: [
        'function pushFront(val):',
        '  deque.addFirst(val)'
      ],
      pushBack: [
        'function pushBack(val):',
        '  deque.addLast(val)'
      ],
      popFront: [
        'function popFront():',
        '  return deque.removeFirst()'
      ],
      popBack: [
        'function popBack():',
        '  return deque.removeLast()'
      ],
      default: [
        '// Deque: Dual Front & Rear access',
        'pushFront / popFront',
        'pushBack / popBack'
      ]
    },
    intuition: 'A deck of cards: you can draw or insert cards from both the top and the bottom of the deck.',
    advantages: ['Flexible dual-end operations', 'Can act as both Stack and Queue'],
    disadvantages: ['More complex internal pointer management'],
    mistakes: 'Confusing `pushFront` with `pushBack` when implementing sliding window maximum algorithms.',
    interviewTip: 'Deques are crucial for solving the Sliding Window Maximum problem in O(N) time.'
  },

  priorityqueue: {
    key: 'priorityqueue',
    name: 'Priority Queue',
    category: 'Heap',
    description: 'Abstract data type where every element has an associated priority value, and elements with higher priority are dequeued first.',
    bestTime: 'O(1) Peek Highest',
    worstTime: 'O(log N) Insert/Extract',
    space: 'O(N)',
    pseudocode: {
      insert: [
        'function insert(element, priority):',
        '  heap.push({ element, priority })',
        '  bubbleUp(heap.size - 1)'
      ],
      extractMax: [
        'function extractMax():',
        '  maxVal = heap[0]',
        '  heap[0] = heap.pop()',
        '  bubbleDown(0)',
        '  return maxVal'
      ],
      default: [
        '// Priority Queue',
        'Highest priority element always at root'
      ]
    },
    intuition: 'An emergency room triage: patients with life-threatening conditions (higher priority) are treated before patients who arrived earlier.',
    advantages: ['Fast O(log N) retrieval of top priority items', 'Dynamic priority adjustments'],
    disadvantages: ['O(N) linear search for non-priority items'],
    mistakes: 'Assuming elements come out in sorted insertion order rather than by priority.',
    interviewTip: 'Core building block for Dijkstra’s Shortest Path, A* Search, and Huffman Coding.'
  },

  minheap: {
    key: 'minheap',
    name: 'Binary Min Heap',
    category: 'Heap',
    description: 'Complete binary tree where every parent node value is less than or equal to its children values (`parent <= child`). Root is always the Minimum.',
    bestTime: 'O(1) Min Access',
    worstTime: 'O(log N) Insert/Extract',
    space: 'O(N)',
    pseudocode: {
      insert: [
        'function insert(val):',
        '  heap.append(val)',
        '  i = size - 1',
        '  while i > 0 and heap[parent(i)] > heap[i]:',
        '    swap(heap[parent(i)], heap[i])',
        '    i = parent(i)'
      ],
      extractMin: [
        'function extractMin():',
        '  minVal = heap[0]',
        '  heap[0] = heap[size - 1]; size--',
        '  heapifyDown(0)',
        '  return minVal'
      ],
      default: [
        'parent(i) = floor((i - 1) / 2)',
        'leftChild(i) = 2*i + 1',
        'rightChild(i) = 2*i + 2'
      ]
    },
    intuition: 'A organization hierarchy where the smallest value is at the top executive desk (Root). Every supervisor is smaller than their subordinates.',
    advantages: ['O(1) access to minimum element', 'O(log N) insertion and deletion', 'Efficiently implemented in flat arrays without pointer overhead'],
    disadvantages: ['O(N) arbitrary element search'],
    mistakes: 'Calculating child indices incorrectly or forgetting array 0-indexing formula `2i + 1` and `2i + 2`.',
    interviewTip: 'Use Min Heap to find Kth Smallest Element or Merge K Sorted Lists.'
  },

  maxheap: {
    key: 'maxheap',
    name: 'Binary Max Heap',
    category: 'Heap',
    description: 'Complete binary tree where every parent node value is greater than or equal to its children values (`parent >= child`). Root is always the Maximum.',
    bestTime: 'O(1) Max Access',
    worstTime: 'O(log N) Insert/Extract',
    space: 'O(N)',
    pseudocode: {
      insert: [
        'function insert(val):',
        '  heap.append(val)',
        '  i = size - 1',
        '  while i > 0 and heap[parent(i)] < heap[i]:',
        '    swap(heap[parent(i)], heap[i])',
        '    i = parent(i)'
      ],
      extractMax: [
        'function extractMax():',
        '  maxVal = heap[0]',
        '  heap[0] = heap[size - 1]; size--',
        '  heapifyDown(0)',
        '  return maxVal'
      ],
      default: [
        'parent(i) = floor((i - 1) / 2)',
        'leftChild(i) = 2*i + 1',
        'rightChild(i) = 2*i + 2'
      ]
    },
    intuition: 'A leaderboard where the top score is at the Root. Every parent node is larger than its children.',
    advantages: ['O(1) access to maximum element', 'O(log N) updates', 'Powers Heapsort algorithm'],
    disadvantages: ['O(N) arbitrary search time'],
    mistakes: 'Bubbling down into the wrong child branch during heapify.',
    interviewTip: 'Combine Min Heap & Max Heap to find the Median of a Data Stream in O(1) time.'
  }
};

// Execution Step Generators
export const generateEngineSteps = (structureKey, op, args, currentItems, config = {}) => {
  const items = [...currentItems];
  let steps = [];

  // Helper step push
  const addStep = (itemsState, highlight, pointers, line, opName, desc, time = 'O(1)', space = 'O(1)', vars = {}) => {
    steps.push({
      items: [...itemsState],
      highlight,
      pointers: { ...pointers },
      line,
      op: opName,
      desc,
      time,
      space,
      vars
    });
  };

  switch (structureKey) {
    case 'array': {
      if (op === 'insert') {
        const { val, idx } = args;
        const targetIdx = Math.max(0, Math.min(items.length, idx !== undefined ? idx : items.length));
        addStep(items, targetIdx, {}, 0, `Target Index [${targetIdx}]`, `Preparing to insert value ${val} at index ${targetIdx}.`, 'O(N)');
        
        let arr = [...items];
        arr.splice(targetIdx, 0, val);
        addStep(arr, targetIdx, {}, 4, `Inserted ${val} at [${targetIdx}]`, `Shifted right elements and placed ${val} at index ${targetIdx}.`, targetIdx === items.length ? 'O(1)' : 'O(N)');
      } else if (op === 'delete') {
        const { idx } = args;
        const targetIdx = Math.max(0, Math.min(items.length - 1, idx !== undefined ? idx : items.length - 1));
        const removed = items[targetIdx];
        addStep(items, targetIdx, {}, 0, `Locating Index [${targetIdx}]`, `Targeting element ${removed} at index ${targetIdx} for deletion.`, 'O(N)');
        
        let arr = items.filter((_, i) => i !== targetIdx);
        addStep(arr, null, {}, 3, `Deleted ${removed}`, `Removed ${removed} and shifted subsequent elements left.`, targetIdx === items.length - 1 ? 'O(1)' : 'O(N)');
      } else if (op === 'update') {
        const { val, idx } = args;
        if (idx >= 0 && idx < items.length) {
          let arr = [...items];
          const oldVal = arr[idx];
          arr[idx] = val;
          addStep(arr, idx, {}, 2, `Updated arr[${idx}] = ${val}`, `Changed arr[${idx}] from ${oldVal} to ${val}.`, 'O(1)');
        }
      } else if (op === 'reverse') {
        let arr = [...items];
        let l = 0, r = arr.length - 1;
        addStep(arr, null, { left: l, right: r }, 0, 'Reverse Array Start', 'Initialized two pointers at head and tail.', 'O(N)');
        while (l < r) {
          const temp = arr[l];
          arr[l] = arr[r];
          arr[r] = temp;
          addStep([...arr], null, { left: l, right: r }, 2, `Swapped [${l}] & [${r}]`, `Swapped element ${arr[r]} with ${arr[l]}.`, 'O(N)');
          l++;
          r--;
        }
        addStep(arr, null, {}, 3, 'Reverse Completed', 'Array reversal complete.', 'O(N)');
      } else if (op === 'rotate') {
        const { dir } = args;
        let arr = [...items];
        if (arr.length > 0) {
          if (dir === 'left') {
            const first = arr.shift();
            arr.push(first);
          } else {
            const last = arr.pop();
            arr.unshift(last);
          }
          addStep(arr, dir === 'left' ? arr.length - 1 : 0, {}, 1, `Rotated ${dir.toUpperCase()}`, `Shifted elements 1 position to the ${dir}.`, 'O(N)');
        }
      } else if (op === 'sort') {
        let arr = [...items].sort((a, b) => a - b);
        addStep(arr, null, {}, 1, 'Array Sorted', 'Sorted elements in ascending numeric order.', 'O(N log N)');
      }
      break;
    }

    case 'stack': {
      const cap = config.stackCapacity || 8;
      if (op === 'push') {
        const { val } = args;
        if (items.length >= cap) {
          addStep(items, null, {}, 1, 'STACK OVERFLOW EXCEPTION', `Cannot push ${val}. Stack is full at max capacity ${cap}!`, 'O(1)');
        } else {
          let arr = [...items, val];
          addStep(arr, arr.length - 1, { top: arr.length - 1 }, 3, `Pushed ${val}`, `Pushed ${val} onto top of stack (Top index ${arr.length - 1}).`, 'O(1)');
        }
      } else if (op === 'pop') {
        if (items.length === 0) {
          addStep(items, null, {}, 1, 'STACK UNDERFLOW EXCEPTION', 'Cannot pop from an empty stack!', 'O(1)');
        } else {
          const removed = items[items.length - 1];
          let arr = items.slice(0, -1);
          addStep(arr, arr.length > 0 ? arr.length - 1 : null, { top: arr.length - 1 }, 3, `Popped ${removed}`, `Popped top element ${removed}. New Top is index ${arr.length - 1}.`, 'O(1)');
        }
      } else if (op === 'peek') {
        if (items.length > 0) {
          const topVal = items[items.length - 1];
          addStep(items, items.length - 1, { top: items.length - 1 }, 2, `Peek Top: ${topVal}`, `Examined top element ${topVal} at index ${items.length - 1}.`, 'O(1)');
        }
      }
      break;
    }

    case 'queue':
    case 'cqueue': {
      const cap = config.queueCapacity || 8;
      if (op === 'enqueue') {
        const { val } = args;
        if (items.length >= cap) {
          addStep(items, null, {}, 1, 'QUEUE OVERFLOW EXCEPTION', `Cannot enqueue ${val}. Capacity ${cap} reached!`, 'O(1)');
        } else {
          let arr = [...items, val];
          addStep(arr, arr.length - 1, { front: 0, rear: arr.length - 1 }, 2, `Enqueued ${val}`, `Added ${val} at rear pointer index ${arr.length - 1}.`, 'O(1)');
        }
      } else if (op === 'dequeue') {
        if (items.length === 0) {
          addStep(items, null, {}, 1, 'QUEUE UNDERFLOW EXCEPTION', 'Cannot dequeue from an empty queue!', 'O(1)');
        } else {
          const removed = items[0];
          let arr = items.slice(1);
          addStep(arr, 0, { front: 0, rear: Math.max(0, arr.length - 1) }, 4, `Dequeued ${removed}`, `Removed front element ${removed}.`, 'O(1)');
        }
      }
      break;
    }

    case 'singlylist':
    case 'doublylist':
    case 'circularlist': {
      if (op === 'insertHead') {
        const { val } = args;
        let arr = [val, ...items];
        addStep(arr, 0, { head: 0 }, 2, `Inserted Head ${val}`, `Created new node (${val}) and set as Head.`, 'O(1)');
      } else if (op === 'insertTail') {
        const { val } = args;
        let arr = [...items, val];
        addStep(arr, arr.length - 1, { tail: arr.length - 1 }, 3, `Inserted Tail ${val}`, `Appended node (${val}) at end of list.`, 'O(N)');
      } else if (op === 'deleteHead') {
        if (items.length > 0) {
          const removed = items[0];
          let arr = items.slice(1);
          addStep(arr, 0, { head: 0 }, 2, `Deleted Head ${removed}`, `Removed Head node ${removed}.`, 'O(1)');
        }
      } else if (op === 'deleteTail') {
        if (items.length > 0) {
          const removed = items[items.length - 1];
          let arr = items.slice(0, -1);
          addStep(arr, arr.length - 1, { tail: arr.length - 1 }, 2, `Deleted Tail ${removed}`, `Traversed to end and removed node ${removed}.`, 'O(N)');
        }
      } else if (op === 'reverse') {
        let arr = [...items].reverse();
        addStep(arr, 0, { head: 0 }, 4, 'Reversed List Links', 'Flipped all next and prev link pointers.', 'O(N)');
      } else if (op === 'findMid') {
        if (items.length > 0) {
          const midIdx = Math.floor(items.length / 2);
          addStep(items, midIdx, { slow: midIdx, fast: items.length - 1 }, 2, `Found Middle Node: ${items[midIdx]}`, `Floyd fast/slow pointer reached middle node ${items[midIdx]} at index ${midIdx}.`, 'O(N)');
        }
      }
      break;
    }

    case 'deque': {
      const cap = config.dequeCapacity || 8;
      if (op === 'pushFront') {
        const { val } = args;
        if (items.length >= cap) {
          addStep(items, null, {}, 1, 'DEQUE OVERFLOW', `Cannot push ${val}. Capacity ${cap} full.`, 'O(1)');
        } else {
          let arr = [val, ...items];
          addStep(arr, 0, { front: 0, rear: arr.length - 1 }, 2, `Push Front ${val}`, `Pushed ${val} to Front of Deque.`, 'O(1)');
        }
      } else if (op === 'pushBack') {
        const { val } = args;
        if (items.length >= cap) {
          addStep(items, null, {}, 1, 'DEQUE OVERFLOW', `Cannot push ${val}. Capacity ${cap} full.`, 'O(1)');
        } else {
          let arr = [...items, val];
          addStep(arr, arr.length - 1, { front: 0, rear: arr.length - 1 }, 2, `Push Back ${val}`, `Pushed ${val} to Back of Deque.`, 'O(1)');
        }
      } else if (op === 'popFront') {
        if (items.length === 0) {
          addStep(items, null, {}, 1, 'DEQUE UNDERFLOW', 'Cannot pop from empty Deque!', 'O(1)');
        } else {
          const removed = items[0];
          let arr = items.slice(1);
          addStep(arr, 0, { front: 0, rear: Math.max(0, arr.length - 1) }, 2, `Pop Front ${removed}`, `Removed Front element ${removed}.`, 'O(1)');
        }
      } else if (op === 'popBack') {
        if (items.length === 0) {
          addStep(items, null, {}, 1, 'DEQUE UNDERFLOW', 'Cannot pop from empty Deque!', 'O(1)');
        } else {
          const removed = items[items.length - 1];
          let arr = items.slice(0, -1);
          addStep(arr, arr.length - 1, { front: 0, rear: Math.max(0, arr.length - 1) }, 2, `Pop Back ${removed}`, `Removed Back element ${removed}.`, 'O(1)');
        }
      }
      break;
    }

    case 'priorityqueue':
    case 'minheap':
    case 'maxheap': {
      const isMin = structureKey === 'minheap' || (structureKey === 'priorityqueue' && config.heapType === 'min');
      
      if (op === 'insert') {
        const { val } = args;
        let arr = [...items, val];
        addStep([...arr], arr.length - 1, {}, 1, `Inserted ${val} at leaf`, `Appended ${val} at index ${arr.length - 1}. Beginning Bubble Up...`, 'O(log N)');

        // Bubble Up
        let i = arr.length - 1;
        while (i > 0) {
          let parent = Math.floor((i - 1) / 2);
          const shouldSwap = isMin ? arr[parent] > arr[i] : arr[parent] < arr[i];
          if (shouldSwap) {
            let temp = arr[parent];
            arr[parent] = arr[i];
            arr[i] = temp;
            addStep([...arr], parent, { current: i, parent }, 3, `Bubble Up Swap [${i}] ↔ [${parent}]`, `Swapped ${arr[parent]} with parent ${arr[i]} to maintain Heap property.`, 'O(log N)');
            i = parent;
          } else {
            break;
          }
        }
        addStep(arr, 0, { root: 0 }, 5, `Heap Property Restored`, `Val ${val} correctly positioned in ${isMin ? 'Min' : 'Max'} Heap.`, 'O(log N)');
      } else if (op === 'extract') {
        if (items.length === 0) {
          addStep(items, null, {}, 1, 'HEAP EMPTY', 'Cannot extract from an empty Heap!', 'O(1)');
        } else {
          const rootVal = items[0];
          let arr = [...items];
          const lastVal = arr.pop();
          if (arr.length > 0) {
            arr[0] = lastVal;
            addStep([...arr], 0, { root: 0 }, 2, `Extracted Root (${rootVal})`, `Replaced Root with last element ${lastVal}. Beginning Bubble Down...`, 'O(log N)');

            // Bubble Down
            let i = 0;
            while (true) {
              let left = 2 * i + 1;
              let right = 2 * i + 2;
              let target = i;

              if (left < arr.length && (isMin ? arr[left] < arr[target] : arr[left] > arr[target])) {
                target = left;
              }
              if (right < arr.length && (isMin ? arr[right] < arr[target] : arr[right] > arr[target])) {
                target = right;
              }

              if (target !== i) {
                let temp = arr[i];
                arr[i] = arr[target];
                arr[target] = temp;
                addStep([...arr], target, { current: i, child: target }, 4, `Bubble Down Swap [${i}] ↔ [${target}]`, `Swapped ${arr[target]} down with child ${arr[i]}.`, 'O(log N)');
                i = target;
              } else {
                break;
              }
            }
          }
          addStep(arr, 0, { root: 0 }, 5, `Extracted ${rootVal}`, `Extraction complete. New root is ${arr.length > 0 ? arr[0] : 'NONE'}.`, 'O(log N)');
        }
      } else if (op === 'heapify') {
        let arr = [...items];
        const n = arr.length;
        addStep([...arr], null, {}, 1, 'Building Heap (Heapify)', `Transforming unordered array into a ${isMin ? 'Min' : 'Max'} Heap...`, 'O(N)');

        const heapifyNode = (i) => {
          let target = i;
          let left = 2 * i + 1;
          let right = 2 * i + 2;

          if (left < n && (isMin ? arr[left] < arr[target] : arr[left] > arr[target])) target = left;
          if (right < n && (isMin ? arr[right] < arr[target] : arr[right] > arr[target])) target = right;

          if (target !== i) {
            let temp = arr[i];
            arr[i] = arr[target];
            arr[target] = temp;
            addStep([...arr], target, { current: i, child: target }, 3, `Heapify Swap at [${i}]`, `Swapped node ${arr[target]} with child ${arr[i]}.`, 'O(N)');
            heapifyNode(target);
          }
        };

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
          heapifyNode(i);
        }
        addStep(arr, 0, { root: 0 }, 5, 'Heapify Complete', `Successfully constructed ${isMin ? 'Min' : 'Max'} Heap in O(N) time.`, 'O(N)');
      }
      break;
    }

    default:
      break;
  }

  // Common Search fallback if not handled
  if (op === 'search') {
    const { val } = args;
    let found = false;
    for (let i = 0; i < items.length; i++) {
      const match = items[i] === val;
      addStep(items, i, {}, 2, `Searching Index [${i}]`, `Inspecting ${items[i]} (Target: ${val})...`, 'O(N)');
      if (match) {
        found = true;
        addStep(items, i, { found: i }, 3, `Found Target ${val}`, `Target value ${val} found at index ${i}.`, 'O(N)');
        break;
      }
    }
    if (!found) {
      addStep(items, null, {}, 4, `Target ${val} Not Found`, `Completed search through ${items.length} items. Target not present.`, 'O(N)');
    }
  }

  return steps.length > 0 ? steps : [{ items, highlight: null, pointers: {}, line: 0, op: 'Ready', desc: 'Ready for operations.', time: 'O(1)', space: 'O(1)' }];
};
