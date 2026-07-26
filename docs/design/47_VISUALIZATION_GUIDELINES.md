# AlgoVerse — Visualization Guidelines

> Purpose
>
> This document defines how every algorithm visualization behaves throughout AlgoVerse.
>
> Visualizations are the heart of the platform.
>
> Every visualization must be interactive, educational, and driven by real algorithm execution.
>
> Visualizations must never be simple animations or prerecorded demonstrations.
>
> Every AI coding agent must follow this document before implementing any visualization.

---

# Core Philosophy

AlgoVerse is an Interactive Algorithm Laboratory.

Not

A video.

Not

A slideshow.

Not

A predefined animation.

Users should control every visualization.

Algorithms should react to the user's own data.

---

# Source of Truth

The algorithm engine is always the source of truth.

Visualizations must never invent values.

Animations must only visualize

- comparisons
- swaps
- pointer movement
- recursion
- queue operations
- stack operations
- tree modifications
- graph traversal
- DP table updates

Never fake execution.

---

# User Input

Every laboratory must allow users to create their own data.

Examples

Arrays

Users enter arrays.

Trees

Users insert nodes.

Graphs

Users build graphs.

Strings

Users type strings.

DP

Users change weights.

Backtracking

Users change board size.

Benchmarks

Users configure datasets.

Never restrict users to predefined examples.

---

# Universal Playback Controls

Every visualization must support

▶ Play

⏸ Pause

⏭ Next Step

⏮ Previous Step

⏹ Reset

🔄 Replay

⚡ Speed Slider

Playback should work identically across every laboratory.

---

# Visualization Timeline

Every visualization should display

Current Step

↓

Previous Step

↓

Next Step

Users should always know

where they are

what just happened

what happens next

---

# Current State Panel

Display

Current Variables

Current Pointers

Recursion Depth

Current Comparison

Queue

Stack

Visited Nodes

Current Complexity

Algorithm Phase

This panel updates every step.

---

# Explanation Panel

Every step must include

What happened.

Why it happened.

Which rule was applied.

Which line of pseudocode executed.

What will happen next.

---

# Code Synchronization

The currently executing line of pseudocode must always be highlighted.

When the algorithm advances,

the highlighted line advances.

Never allow animation and pseudocode to become unsynchronized.

---

# Statistics

Statistics must always be real.

Examples

Sorting

Comparisons

Swaps

Current Pass

Execution Time

Searching

Current Index

Search Range

Comparisons

Trees

Height

Depth

Visited Nodes

Graphs

Queue Size

Stack Size

Visited Count

Edges Traversed

DP

Cells Filled

States Computed

Transitions

Never display fake values.

---

# Array Visualization

Must support

Insert

Delete

Update

Random

Reverse

Rotate

Shuffle

Resize

Every modification updates the visualization immediately.

---

# Linked List Visualization

Must support

Insert Head

Insert Tail

Insert Position

Delete

Reverse

Cycle Detection

Find Middle

Merge

Pointers should animate naturally.

---

# Stack Visualization

Must support

Push

Pop

Peek

Overflow

Underflow

Highlight the active element.

---

# Queue Visualization

Must support

Enqueue

Dequeue

Front

Rear

Circular Queue

Pointers should move visually.

---

# Tree Visualization

Must support

Insert

Delete

Search

Update

Random Tree

AVL

BST

Traversals

Tree layout should automatically reposition.

Nodes should never overlap.

---

# Graph Visualization

Users must be able to

Add Vertex

Delete Vertex

Move Vertex

Add Edge

Delete Edge

Edit Weight

Directed Graph

Undirected Graph

Algorithms

BFS

DFS

Dijkstra

Prim

Kruskal

Topological Sort

Must execute on the graph the user created.

---

# Sorting Visualization

Support

Bubble

Selection

Insertion

Merge

Quick

Heap

Counting

Radix

Shell

Users should

Generate arrays.

Edit arrays.

Import arrays.

Randomize arrays.

Every algorithm must execute correctly.

---

# Searching Visualization

Support

Linear

Binary

Jump

Interpolation

Exponential

Users provide

Target

Array

Visualization updates immediately.

---

# Dynamic Programming

Users modify

Capacity

Weights

Values

Strings

Target

Dimensions

DP tables rebuild live.

---

# Backtracking

Users modify

Board Size

Starting Position

Puzzle Size

Visualization updates accordingly.

---

# Benchmark Center

Benchmarking must use

real algorithm execution.

Never use hardcoded timings.

Every benchmark should execute

the selected algorithms

on identical datasets

before displaying results.

---

# Code Playground

Must support

Language Selection

Custom Code

Custom Input

Compile

Run

Output

Errors

Execution Time

Memory Usage

If local execution is unavailable,

clearly explain why.

Never display fake output.

---

# Canvas Behaviour

Visualization canvas must

Resize

Zoom

Pan

Fit Content

Maintain Padding

No controls should overlap the canvas.

No controls should disappear.

---

# Theme Support

Visualizations must support

Light Theme

Dark Theme

Animations

Accessibility

Reduced Motion

---

# Educational Goals

Every visualization should teach

Intuition

Decision Making

Step-by-Step Execution

Complexity

Common Mistakes

Edge Cases

Interview Tips

---

# AI Rules

Never hardcode visualizations.

Never fake statistics.

Never fake output.

Never ignore user input.

Every listed algorithm must work.

Every visible control must function.

Every visualization must be generated from the algorithm engine.

---

# Definition of Complete

A visualization is complete only if

✓ Users can create their own input.

✓ Every control works.

✓ Every algorithm executes correctly.

✓ Playback controls function.

✓ Statistics are real.

✓ Code highlighting is synchronized.

✓ Explanations update every step.

✓ Layout remains responsive.

✓ Theme switching works.

✓ The visualization teaches rather than merely animates.

---

# Final Principle

Users should feel like they are experimenting inside a real algorithm laboratory,

not watching a prerecorded animation.