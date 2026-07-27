export const isTraversalSupported = (travKey, treeType) => {
  if (treeType === 'fenwick') return false; // ❌ Traversals hidden for Fenwick
  if (treeType === 'trie') {
    if (['inorder', 'preorder', 'postorder'].includes(travKey)) return false; // ❌ Inorder, Preorder, Postorder hidden for Trie
  }
  if (treeType === 'btree' || treeType === 'bplus') {
    if (travKey === 'morris') return false; // ❌ Morris Traversal hidden for B-Tree / B+ Tree
  }
  return true;
};

export const isAlgorithmSupported = (algKey, treeType) => {
  if (treeType === 'trie') {
    if (['kthsmall', 'kthlarge', 'validate', 'heapify', 'heapsort', 'peek'].includes(algKey)) return false;
  }
  if (treeType === 'minheap' || treeType === 'maxheap') {
    if (['validate', 'successor', 'predecessor', 'lca', 'mirror', 'invert', 'buildtree'].includes(algKey)) return false;
  }
  if (treeType === 'segment') {
    if (['successor', 'predecessor', 'validate', 'heapify', 'heapsort', 'peek'].includes(algKey)) return false;
  }
  if (treeType === 'fenwick') {
    if (['kthsmall', 'kthlarge', 'successor', 'predecessor', 'validate', 'lca', 'mirror', 'invert', 'serialize', 'heapify', 'heapsort', 'peek'].includes(algKey)) return false;
  }
  if (treeType === 'huffman') {
    if (['validate', 'kthsmall', 'kthlarge', 'heapify', 'heapsort', 'peek'].includes(algKey)) return false;
  }
  if (treeType === 'btree' || treeType === 'bplus') {
    if (['mirror', 'invert', 'heapify', 'heapsort', 'peek'].includes(algKey)) return false;
  }
  return true;
};

export const isOperationSupported = (opName, treeType) => {
  if (treeType === 'segment' || treeType === 'fenwick') {
    if (opName === 'delete') return false; // ❌ Delete hidden for Segment and Fenwick
  }
  if (treeType === 'huffman') {
    if (['insert', 'delete', 'search'].includes(opName)) return false; // ❌ Insert/Delete/Search hidden for Huffman
  }
  return true;
};

export const TYPE_SPECIFIC_CONTROLS = {
  binary: [
    { key: 'buildtree', label: 'Build from Traversals', desc: 'Reconstructing Binary Tree from In-Order and Pre-Order traversal arrays...' },
    { key: 'mirror', label: 'Mirror', desc: 'Mirroring left and right subtrees across all binary tree nodes...' },
    { key: 'invert', label: 'Invert', desc: 'Inverting left and right child pointers recursively...' }
  ],
  bst: [
    { key: 'validate', label: 'Validate BST', desc: 'Checking BST invariant (left.val < root.val < right.val) across all paths...' },
    { key: 'successor', label: 'Successor', desc: 'Finding in-order successor (smallest node in right subtree)...' },
    { key: 'predecessor', label: 'Predecessor', desc: 'Finding in-order predecessor (largest node in left subtree)...' },
    { key: 'kthsmall', label: 'Kth Smallest', desc: 'Locating Kth smallest element via in-order traversal index...' },
    { key: 'kthlarge', label: 'Kth Largest', desc: 'Locating Kth largest element via reverse in-order traversal index...' }
  ],
  avl: [
    { key: 'balance', label: 'Balance Factor', desc: 'Calculating Balance Factor (height(left) - height(right)) for every AVL node...' },
    { key: 'rotanim', label: 'Rotation Animation', desc: 'Simulating automatic height-balanced rotations...' },
    { key: 'llrot', label: 'LL Rotation', desc: 'Performing Left-Left (LL) Single Right Rotation to restore AVL balance.' },
    { key: 'rrrot', label: 'RR Rotation', desc: 'Performing Right-Right (RR) Single Left Rotation to restore AVL balance.' },
    { key: 'lrrot', label: 'LR Rotation', desc: 'Performing Left-Right (LR) Double Rotation (Left then Right).' },
    { key: 'rlrot', label: 'RL Rotation', desc: 'Performing Right-Left (RL) Double Rotation (Right then Left).' }
  ],
  redblack: [
    { key: 'nodecolors', label: 'Node Colors', desc: 'Verifying Red-Black coloring properties (Root black, no consecutive red nodes)...' },
    { key: 'colorflip', label: 'Color Flip Animation', desc: 'Simulating uncle color flip during Red-Black insertion...' },
    { key: 'rbrot', label: 'Rotation Animation', desc: 'Simulating Red-Black restructuring rotations...' }
  ],
  minheap: [
    { key: 'heapify', label: 'Heapify', desc: 'Running bottom-up Heapify (sifting down non-leaf nodes) in O(N) time...' },
    { key: 'peek', label: 'Peek Root', desc: 'Peeking at root element O(1) minimum...' },
    { key: 'heapsort', label: 'Heap Sort', desc: 'Performing in-place Heap Sort by repeatedly extracting min...' },
    { key: 'arrayview', label: 'Array View Toggle', desc: 'Toggling array-backed index representation (left=2*i+1, right=2*i+2)...' }
  ],
  maxheap: [
    { key: 'heapify', label: 'Heapify', desc: 'Running bottom-up Heapify (sifting down non-leaf nodes) in O(N) time...' },
    { key: 'peek', label: 'Peek Root', desc: 'Peeking at root element O(1) maximum...' },
    { key: 'heapsort', label: 'Heap Sort', desc: 'Performing in-place Heap Sort by repeatedly extracting max...' },
    { key: 'arrayview', label: 'Array View Toggle', desc: 'Toggling array-backed index representation (left=2*i+1, right=2*i+2)...' }
  ],
  trie: [
    { key: 'insertword', label: 'Insert Word', desc: 'Inserting word character-by-character into Trie nodes...' },
    { key: 'deleteword', label: 'Delete Word', desc: 'Pruning word characters from Trie leaf upwards...' },
    { key: 'searchword', label: 'Search Word', desc: 'Searching exact word match in Trie alphabet paths...' },
    { key: 'prefixsearch', label: 'Prefix Search', desc: 'Searching prefix match and listing reachable child words...' },
    { key: 'autocomplete', label: 'Auto Complete', desc: 'Generating auto-complete word suggestions for prefix...' }
  ],
  segment: [
    { key: 'rangequery', label: 'Range Query', desc: 'Querying segment tree range [L, R] in O(log N) time...' },
    { key: 'pointupdate', label: 'Point Update', desc: 'Updating index value and propagating change up to root...' },
    { key: 'rangeupdate', label: 'Range Update', desc: 'Updating range [L, R] across segment nodes...' },
    { key: 'lazyprop', label: 'Lazy Propagation', desc: 'Simulating lazy propagation tag push-down for deferred range updates...' }
  ],
  fenwick: [
    { key: 'prefixsum', label: 'Prefix Sum', desc: 'Computing prefix sum P(i) via least significant bit (i & -i) jumps...' },
    { key: 'rangesum', label: 'Range Sum', desc: 'Calculating range sum sum(R) - sum(L-1) in O(log N)...' },
    { key: 'bitpointupdate', label: 'Point Update', desc: 'Adding delta to index i and traversing up LSB chain...' }
  ],
  huffman: [
    { key: 'encode', label: 'Encode', desc: 'Encoding text string into optimal variable-length bit prefix codes...' },
    { key: 'decode', label: 'Decode', desc: 'Decoding Huffman bitstream back into original characters...' },
    { key: 'freqtable', label: 'Frequency Table', desc: 'Building character frequency table from sample text...' },
    { key: 'gencodes', label: 'Generate Codes', desc: 'Generating prefix-free Huffman code map (e.g. A=0, B=101)...' }
  ],
  btree: [
    { key: 'nodesplit', label: 'Node Split', desc: 'Splitting overfull B-Tree node and promoting median key to parent...' },
    { key: 'nodemerge', label: 'Merge', desc: 'Merging underflowed B-Tree sibling nodes...' },
    { key: 'borrow', label: 'Borrow', desc: 'Borrowing key from rich sibling via parent pivot...' },
    { key: 'degreeselect', label: 'Degree Selector', desc: 'Configuring minimum degree t=2 (max keys = 2t-1 = 3)...' }
  ],
  bplus: [
    { key: 'nodesplit', label: 'Node Split', desc: 'Splitting B+ Tree leaf node and copying minimum key to parent index...' },
    { key: 'nodemerge', label: 'Merge', desc: 'Merging B+ Tree leaf nodes and updating linked list pointers...' },
    { key: 'leaflinks', label: 'Leaf Links', desc: 'Highlighting horizontal doubly-linked leaf sequence pointers...' },
    { key: 'rangesearch', label: 'Range Search', desc: 'Performing B+ Tree range scan across linked leaf nodes in O(log N + K)...' }
  ]
};
