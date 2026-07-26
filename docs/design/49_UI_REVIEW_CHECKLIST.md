# 49_UI_REVIEW_CHECKLIST.md — UI Review & Acceptance Checklist

## 1. Global UI & Experience Standards

- [x] **No Overflow / Clipping**: Containers, text boxes, and SVG visualizers fit within viewport boundaries without horizontal scrollbars.
- [x] **Responsive Layout**: Every page renders cleanly across Mobile (`375px`), Tablet (`768px`), Laptop (`1024px`), and Desktop (`1440px`).
- [x] **Consistent Design System**: Color palette, typography scale (Poppins / Inter / Mono), radius scale (`rounded-3xl`), and padding are uniform.
- [x] **Accessible Controls**: All buttons, inputs, and interactive nodes have focus indicators and hover feedback (`scale-102` / `hover:bg-primary/90`).

---

## 2. Laboratory Acceptance Criteria

### Data Structure Laboratory (`Playground.jsx`)
- [x] Switching structure (Array, Stack, Queue, Linked List) re-renders appropriate pointer badges (`TOP ↑`, `FRONT`, `REAR`, `HEAD`, `ptr → NULL`).
- [x] Array operations: Insert, Delete, Update, Reverse (two pointers), Rotate Left/Right, Search.
- [x] Stack limits: Capacity slider enforced with Stack Overflow alert when full, and Stack Underflow when empty.
- [x] Queue limits: Capacity enforced with Circular Front/Rear index wrapping.
- [x] Linked List operations: Head, Tail, Reverse list, Floyd's Slow & Fast pointer middle node search.

### Sorting Laboratory (`SortingLab.jsx`)
- [x] All 5 algorithms (Bubble, Selection, Insertion, Merge, Quick) generate exact step sequences.
- [x] Active state color coding: Default (Purple), Comparing (Blue glow), Swapping (Pink glow), Pivot (Amber), Sorted (Emerald).
- [x] Custom CSV array import and presets (Random, Reverse, Nearly Sorted).

### Searching Laboratory (`SearchingLab.jsx`)
- [x] Linear, Binary, and Interpolation Search step generators working with actual array targets.
- [x] Pointer badges rendered: `L` (Low), `M` (Mid/Pos), `H` (High).
- [x] Custom CSV array input and randomize target buttons.

### Tree Laboratory (`TreeLab.jsx`)
- [x] BST insertion compares step-by-step (`val < node → Left`, `val >= node → Right`) with live code highlighting.
- [x] Dynamic $(X, Y)$ coordinate layout updates automatically as nodes are added or removed.
- [x] Real traversals: In-Order, Pre-Order, Post-Order, Level-Order (BFS) animating visited nodes.

### Graph Laboratory (`GraphLab.jsx`)
- [x] BFS, DFS, and Dijkstra Shortest Path step generators execute on custom graph state.
- [x] Edge builder connects custom node pairs with custom edge weights.
- [x] Live Queue state array, active edge highlights, and distance tables update step-by-step.

### Dynamic Programming Studio (`DPStudio.jsx`)
- [x] Step generators for Fibonacci, Climbing Stairs, and 0/1 Knapsack.
- [x] Target $N$ sliders rebuild 1D / 2D DP table dynamically with active cell calculation glows.

### Benchmark Center (`BenchmarkCenter.jsx`)
- [x] Measures real algorithm execution times using `performance.now()` in microseconds on identical generated datasets.
- [x] Displays Winner Highlight Card, Execution Runtime Bar Chart, and Detailed Performance Table (`Comparisons`, `Swaps`, `Memory KB`).

### Code Playground (`CodePlayground.jsx`)
- [x] Compiles and executes code in C++, Java, Python, and JavaScript.
- [x] Displays true `STDOUT`, `STDERR` / compiler errors, STDIN input, and execution duration.

---

## 3. Educational & Content Quality

- [x] Pseudocode boxes include active line highlighting during step playback.
- [x] Conceptual Intuition, Common Mistakes, and Interview Tips cards present on all laboratory pages.
- [x] AlgoCat mascot illustrations enhance user guidance without obstructing visualizer canvases.
