# AlgoVerse — C++ Algorithm Engine

## Purpose

This document defines the architecture, standards, responsibilities, and implementation guidelines for the C++ Algorithm Engine.

The C++ engine is responsible for executing all Data Structures and Algorithms while remaining completely independent from the frontend and backend business logic.

The engine **must never know anything about React, HTML, CSS, Tailwind, or animations.**

Its only responsibility is to execute algorithms efficiently and produce standardized visualization events.

---

# Objectives

The C++ Engine should:

* Execute algorithms efficiently.
* Generate deterministic visualization events.
* Benchmark algorithm performance.
* Return structured JSON.
* Be reusable.
* Be easy to extend with new algorithms.
* Remain independent from the MERN stack.

---

# Design Principles

The engine must be:

* Fast
* Deterministic
* Stateless
* Modular
* Testable
* Platform Independent
* Easy to Debug

---

# Responsibilities

The engine is responsible for:

* Algorithm execution
* Data structure manipulation
* Complexity calculation
* Performance measurement
* Visualization event generation

The engine is NOT responsible for:

* Rendering UI
* Animations
* Authentication
* Database access
* User management
* Business logic
* HTTP requests

---

# Communication Flow

```text
React

↓

Express API

↓

Algorithm Service

↓

C++ Executable

↓

Execute Algorithm

↓

Generate Events

↓

Return JSON

↓

Express

↓

React

↓

Visualization
```

---

# Engine Folder Structure

```text
cpp-engine/

sorting/

searching/

trees/

graphs/

dp/

strings/

backtracking/

benchmark/

shared/

executables/
```

---

# Internal Folder Structure

Each category follows:

```text
sorting/

BubbleSort.cpp

SelectionSort.cpp

InsertionSort.cpp

MergeSort.cpp

QuickSort.cpp

HeapSort.cpp

CountingSort.cpp

RadixSort.cpp

BucketSort.cpp

SortingUtils.cpp

SortingUtils.h
```

The same pattern should be used for every algorithm category.

---

# Shared Folder

Contains reusable utilities.

Examples

```text
Event.h

JsonWriter.h

Timer.h

Parser.h

Logger.h

Constants.h

Utilities.h
```

No algorithm-specific logic belongs here.

---

# Entry Point

The executable should expose a single entry point.

Example flow:

1. Receive input.
2. Parse JSON.
3. Validate request.
4. Execute selected algorithm.
5. Generate events.
6. Calculate statistics.
7. Return JSON.

---

# Input Format

Express sends JSON.

Example

```json
{
  "algorithm": "bubble_sort",
  "input": [5,3,8,2],
  "settings": {
    "trackSteps": true
  }
}
```

---

# Output Format

Every execution returns:

```json
{
  "success": true,
  "events": [],
  "statistics": {},
  "complexity": {}
}
```

Never return plain text.

Never return HTML.

Never return console output.

---

# Standard Event Model

Every algorithm must emit events.

Example event types:

* compare
* swap
* overwrite
* insert
* delete
* visit
* highlight
* push
* pop
* enqueue
* dequeue
* rotate
* mark
* complete

Every visualization depends on these events.

---

# Event Rules

Events must:

* Be chronological.
* Be deterministic.
* Contain all required information.
* Never require frontend guessing.

Bad

```text
swap
```

Good

```json
{
  "type":"swap",
  "i":2,
  "j":7
}
```

---

# Statistics

Every execution should calculate:

* Runtime
* Number of Comparisons
* Number of Swaps
* Number of Assignments
* Memory Usage (estimated)
* Recursive Calls (if applicable)
* Maximum Recursion Depth (if applicable)

These values are returned separately from visualization events.

---

# Complexity Metadata

Each algorithm returns:

```text
Time Complexity

Average Case

Worst Case

Best Case

Space Complexity

Stable

Recursive

In Place
```

The frontend should never hardcode these values.

---

# Algorithm Categories

Version 1 supports:

Sorting

Searching

Trees

Graphs

Dynamic Programming

Strings

Backtracking

Future categories can be added without modifying the visualization architecture.

---

# Sorting Requirements

Every sorting algorithm must emit:

* Compare
* Swap
* Overwrite
* Mark Sorted
* Complete

Statistics

* Comparisons
* Swaps
* Runtime

---

# Searching Requirements

Events

Visit

Compare

Found

Not Found

Highlight

Complete

---

# Tree Requirements

Events

Insert

Delete

Rotate

Visit

Search

Traversal

Balance

Complete

---

# Graph Requirements

Events

Visit Node

Visit Edge

Relax Edge

Push Queue

Pop Queue

Update Distance

Mark MST

Complete

---

# Dynamic Programming Requirements

Events

Read Cell

Write Cell

Memo Hit

Transition

Complete

---

# String Algorithm Requirements

Events

Compare

Shift

Hash Update

Match

Mismatch

Complete

---

# Backtracking Requirements

Events

Choose

Reject

Recurse

Backtrack

Solution

Complete

---

# Coding Standards

Use Modern C++.

Prefer:

* std::vector
* std::string
* std::unordered_map
* std::priority_queue
* std::queue
* std::stack
* std::set
* std::unordered_set

Avoid raw pointers unless required.

Prefer RAII.

Avoid global variables.

---

# Function Design

Each algorithm should expose a single public function.

Example

```cpp
AlgorithmResult runBubbleSort(const std::vector<int>& input);
```

Do not expose visualization internals outside the algorithm.

---

# Error Handling

Return structured errors.

Example

```json
{
  "success": false,
  "message": "Invalid input."
}
```

Never crash on invalid input.

Never terminate unexpectedly.

---

# Benchmark Engine

Every algorithm execution should optionally record:

* Start Time
* End Time
* Execution Time
* Comparisons
* Memory Estimate

Benchmarking should be independent from visualization.

---

# Logging

Development Mode

* Input received
* Algorithm selected
* Execution completed
* Error messages

Production Mode

Minimal logging.

Never log sensitive user data.

---

# Performance Goals

The engine should prioritize correctness first and performance second.

Avoid unnecessary memory copies.

Pass large objects by const reference where appropriate.

Reserve vector capacity when possible.

Avoid repeated allocations inside tight loops.

---

# Extending the Engine

To add a new algorithm:

1. Create implementation file.
2. Register algorithm.
3. Return standardized events.
4. Return statistics.
5. Return complexity metadata.
6. Update documentation.
7. Add frontend visualizer if required.

No architectural changes should be necessary.

---

# Testing Expectations

Each algorithm should be verified with:

* Empty input
* Single element
* Duplicate values
* Negative values (where applicable)
* Large input
* Already sorted input
* Reverse sorted input
* Random input

Events should also be validated for correctness.

---

# Future Enhancements

Future versions may include:

* Multi-threaded benchmarking
* WebAssembly build
* Dynamic plugin loading
* Custom user algorithms
* Multiple execution strategies
* Cross-platform optimization

The architecture should already support these additions.

---

# Summary

The C++ Algorithm Engine is the computational core of AlgoVerse.

Its responsibilities are intentionally narrow:

* Execute algorithms.
* Produce standardized events.
* Measure performance.
* Return structured JSON.

By remaining independent from the frontend and backend, the engine becomes reusable, testable, maintainable, and easy to extend while enabling a rich visualization experience in React.
