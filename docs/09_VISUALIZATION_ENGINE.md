# AlgoVerse — Visualization Engine

## Purpose

This document defines the architecture, rendering pipeline, playback engine, and visualization standards for AlgoVerse.

The Visualization Engine is responsible for transforming standardized algorithm events received from the C++ Engine into beautiful, interactive, educational animations.

The Visualization Engine **must never execute algorithms**.

Its only responsibility is to render and animate events.

---

# Philosophy

Visualization should help users understand **why** an algorithm behaves the way it does, not simply display movement.

Every animation should answer one of these questions:

* What happened?
* Why did it happen?
* What changed?
* What happens next?

The visualization must remain educational first and decorative second.

---

# Core Principle

Algorithm Engine

↓

Generates Events

↓

React Receives Events

↓

Playback Engine Reads Events

↓

Renderer Updates UI

↓

Animations Execute

No visualization should contain algorithm logic.

---

# Visualization Pipeline

```text
User Input

↓

API Request

↓

Express

↓

C++ Algorithm Engine

↓

JSON Events

↓

React State

↓

Playback Engine

↓

Renderer

↓

Animation

↓

Updated Visualization
```

---

# Rendering Technologies

## Arrays

Technology

HTML Divs

Framer Motion

---

## Linked Lists

Technology

SVG

Framer Motion

---

## Trees

Technology

SVG

---

## Graphs

Technology

React Flow

D3.js (where appropriate)

---

## Dynamic Programming Tables

Technology

HTML Tables

CSS Grid

---

## Tries

Technology

SVG

---

## Heaps

Technology

SVG

---

## Segment Trees

Technology

SVG

---

## Fenwick Trees

Technology

SVG

---

## Charts

Technology

Recharts

---

# Visualization Architecture

```text
Visualization Page

↓

Visualizer

↓

Playback Controller

↓

Renderer

↓

Reusable Components
```

Example

```text
SortingPage

↓

SortingVisualizer

↓

PlaybackEngine

↓

ArrayRenderer

↓

ArrayBar
```

---

# Playback Engine

The playback engine is shared across every visualization.

Responsibilities

* Read events
* Track current step
* Play
* Pause
* Resume
* Restart
* Previous Step
* Next Step
* Seek
* Speed Control

The playback engine should never know which algorithm generated the events.

---

# Playback States

Idle

Loading

Ready

Playing

Paused

Completed

Error

Every visualizer must support all states.

---

# Playback Controls

Every visualization must provide:

Play

Pause

Resume

Restart

Previous Step

Next Step

Jump to Beginning

Jump to End

Animation Speed

Reset

Export

---

# Speed Levels

Very Slow

0.25x

Slow

0.5x

Normal

1x

Fast

2x

Very Fast

4x

Changing speed should not restart playback.

---

# Timeline

Every algorithm execution displays a timeline.

Timeline contains

Completed Steps

Current Step

Upcoming Steps

Users can click any completed step to revisit it.

Future steps are read-only.

---

# Renderer Responsibilities

The renderer:

* Updates component state
* Triggers animations
* Updates explanation panel
* Highlights current elements
* Updates statistics

The renderer should never calculate algorithm results.

---

# Event Consumption

Every visualization consumes standardized events.

Example

```json
{
  "type":"compare",
  "i":2,
  "j":5
}
```

The visualization decides:

* Which bars to highlight
* Which color to use
* Which animation to play

---

# Global Event Types

Supported events include:

Compare

Swap

Overwrite

Visit

Insert

Delete

Rotate

Highlight

Push

Pop

Enqueue

Dequeue

Mark

Select

Complete

Every renderer should ignore unknown events safely.

---

# Animation Rules

Each event maps to an animation.

Compare

↓

Purple Highlight

Swap

↓

Smooth Position Exchange

Visit

↓

Blue Glow

Insert

↓

Scale In

Delete

↓

Fade Out

Rotate

↓

Tree Rotation Animation

Highlight

↓

Pulse

Complete

↓

Green Glow

↓

Confetti (optional)

---

# Sorting Visualization

Representation

Vertical bars

Each bar displays:

Value

Height

Current State

Bar States

Default

Comparing

Swapping

Sorted

Pivot

Selected

Hover

Animation

Swap

↓

Spring Movement

Compare

↓

Color Change

Sorted

↓

Green Transition

---

# Searching Visualization

Highlight

Current Index

Search Region

Visited Elements

Found Element

Failed Search

Pointer movement should animate smoothly.

---

# Linked List Visualization

Display

Nodes

Pointers

Head

Tail

Animations

Insert

↓

Slide In

Delete

↓

Fade Out

Pointer Update

↓

Animated Arrow Transition

---

# Stack Visualization

Operations

Push

↓

Top grows

Pop

↓

Top disappears

Peek

↓

Highlight

---

# Queue Visualization

Operations

Enqueue

↓

Right Side Entry

Dequeue

↓

Left Side Exit

Front

↓

Highlight

Rear

↓

Highlight

---

# Tree Visualization

Display

Nodes

Edges

Levels

Root

Animations

Insert

↓

Node grows

Delete

↓

Fade

Rotation

↓

Entire subtree animates

Traversal

↓

Visited node glows

---

# Graph Visualization

Display

Nodes

Edges

Weights

Animations

Visited Node

↓

Blue Glow

Current Edge

↓

Purple

Shortest Path

↓

Green

Queue

↓

Visible Side Panel

Priority Queue

↓

Live Table

---

# Dynamic Programming Visualization

Display

DP Table

Current Cell

Dependencies

Memoization Cache

Animations

Cell Write

↓

Glow

Cell Read

↓

Highlight

Transition

↓

Arrow Animation

---

# String Visualization

Display

Text

Pattern

Current Match

Prefix Table

Animations

Comparison

↓

Highlight Characters

Mismatch

↓

Red Flash

Match

↓

Green Glow

Shift

↓

Pattern Slides

---

# Backtracking Visualization

Display

Decision Tree

Current Choice

Backtrack Path

Animations

Choose

↓

Highlight

Reject

↓

Fade

Backtrack

↓

Reverse Animation

Solution

↓

Green Path

---

# Explanation Panel

Every visualization updates:

Current Step

Current Event

Current Variables

Current Explanation

Complexity

Pseudo Code Highlight

The explanation should stay synchronized with playback.

---

# Statistics Panel

Live updates include:

Comparisons

Swaps

Visited Nodes

Queue Size

Stack Size

Current Depth

Memory Estimate

Execution Time

---

# Visualization Layout

```text
Toolbar

↓

Visualization

↓

Timeline

↓

Explanation Panel

↓

Statistics
```

Layout must remain consistent across all modules.

---

# User Interaction

Users can:

Zoom

Pan (Graphs)

Drag Nodes

Edit Input

Reset

Replay

Change Speed

Export Snapshot

Save Visualization

Bookmark Algorithm

Like Algorithm

Share Visualization (future)

---

# Responsiveness

Desktop

Full visualization

Tablet

Reduced side panels

Mobile

Stacked layout

Playback controls remain accessible.

---

# Accessibility

Keyboard controls

Space

Play / Pause

Left Arrow

Previous Step

Right Arrow

Next Step

Home

Beginning

End

Final Step

Focus indicators required.

---

# Performance Rules

Only animate changed elements.

Avoid full re-renders.

Memoize expensive renders.

Virtualize large datasets where practical.

Keep animation smooth even for large inputs.

---

# Error Handling

If visualization fails:

Show illustration

Explain issue

Provide Retry button

Never crash the page.

---

# Future Enhancements

* 3D Visualizations
* WebGL Rendering
* Collaborative Playback
* Annotation Layer
* Voice Narration
* AR/VR Visualizations
* Export as Video
* Interactive Quizzes During Playback

---

# Summary

The Visualization Engine is responsible for converting standardized algorithm events into interactive educational experiences.

It should remain:

* Independent from algorithm logic
* Independent from backend logic
* Reusable across all modules
* Consistent in behavior
* Smooth in performance
* Educational in presentation

Every new visualization added to AlgoVerse must integrate with this engine instead of implementing a custom playback system.
