# AlgoVerse — Page Layout Guide

> Purpose
>
> This document defines the structural layout of every major page in AlgoVerse.
>
> Every page must follow a consistent visual hierarchy and interaction pattern.
>
> Users should immediately recognize that every screen belongs to the same application.
>
> Every AI coding agent must read this document before creating or modifying any page.

---

# Global Layout

Every authenticated page follows the same structure.

```
┌──────────────────────────────────────────────────────────────┐
│                      Top Navigation                          │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│               │                                              │
│               │                                              │
│   Sidebar     │              Main Content                    │
│               │                                              │
│               │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│                  Floating Notifications                      │
└──────────────────────────────────────────────────────────────┘
```

---

# Navigation Rules

## Sidebar

Always contains

- Logo
- Dashboard
- Playground
- Labs
- Roadmap
- Benchmarks
- Code Playground
- Community
- Contests
- Profile
- Settings

Bottom

Theme Switch

User Avatar

Logout

Sidebar must

- collapse smoothly
- expand smoothly
- highlight current page
- remain sticky

---

## Top Navigation

Contains

Search Bar

Notifications

Daily Streak

XP

Current Level

Profile Avatar

Never overcrowd the navigation.

---

# Dashboard

The dashboard is the user's home.

Layout

```
Hero
↓

Continue Learning

↓

Daily Goals

↓

Learning Progress

↓

Recent Activity

↓

Recommended Labs

↓

Achievements

↓

Quick Access

↓

Footer
```

Hero Section

Contains

Mascot

Welcome Message

Current XP

Continue Button

Daily Quote

Soft animated background

---

# Playground

Purpose

Experiment with data structures.

Layout

```
Structure Selector

↓

Controls

↓

Visualization Canvas

↓

Explanation Panel

↓

Complexity Panel

↓

Code Panel
```

Visualization should occupy the largest area.

Controls should never overlap the visualization.

---

# Sorting Laboratory

Layout

```
Algorithm Selection

↓

Input Controls

↓

Visualization

↓

Statistics

↓

Explanation

↓

Code

↓

Complexity
```

Visualization must always remain centred.

Controls remain outside the canvas.

---

# Searching Laboratory

Layout identical to Sorting.

Replace statistics with

Current Index

Search Range

Comparisons

---

# Tree Laboratory

Layout

```
Tree Controls

↓

Canvas

↓

Traversal Controls

↓

Traversal Order

↓

Explanation

↓

Code

↓

Complexity
```

Tree should always stay centred.

Nodes must never overflow.

Canvas should automatically zoom or pan when needed.

---

# Graph Laboratory

Layout

```
Graph Controls

↓

Canvas

↓

Algorithm Controls

↓

Legend

↓

Explanation

↓

Complexity
```

Canvas should allow

Zoom

Pan

Drag

Edge creation

Vertex creation

Without overlapping controls.

---

# Dynamic Programming Studio

Layout

```
Problem Selection

↓

Input Parameters

↓

DP Table

↓

Visualization

↓

Explanation

↓

Code

↓

Complexity
```

DP table should resize automatically.

---

# String Algorithms

Layout

```
Algorithm

↓

Input

↓

Visualization

↓

Current Window

↓

Explanation

↓

Code
```

---

# Backtracking Studio

Layout

```
Problem

↓

Controls

↓

Board

↓

Recursive Tree

↓

Explanation
```

---

# Benchmark Center

Layout

```
Algorithm Selection

↓

Dataset Configuration

↓

Run Benchmark

↓

Results

↓

Charts

↓

Performance Analysis

↓

Export
```

Results should always be generated after execution.

Never display placeholder values.

---

# Code Playground

Layout

```
Language Selector

↓

Editor

↓

STDIN

↓

Run Button

↓

Console

↓

Execution Statistics
```

Console should always remain visible.

Errors should be clearly separated from output.

---

# Roadmap

Layout

```
Hero

↓

Learning Tracks

↓

Current Progress

↓

Upcoming Topics

↓

Achievements
```

---

# Community

Layout

```
Create Post

↓

Feed

↓

Trending

↓

Groups

↓

Leaderboard
```

---

# Contests

Layout

```
Upcoming

↓

Live

↓

Past

↓

Leaderboard
```

---

# Profile

Layout

```
Avatar

↓

Statistics

↓

Achievements

↓

Activity

↓

Badges

↓

Recent Learning
```

---

# Settings

Layout

```
Appearance

↓

Notifications

↓

Account

↓

Privacy

↓

Connected Accounts

↓

Danger Zone
```

---

# Empty Space Rules

Never leave large blank areas.

If space exists,

fill it with

- mascot
- illustration
- explanation
- statistics
- hints

Never with decoration alone.

---

# Canvas Rules

Every visualization canvas must

Remain centred.

Support resizing.

Never clip controls.

Never overflow horizontally.

Maintain padding.

Support zoom when required.

---

# Control Placement Rules

Controls should always remain

Outside the visualization.

Never overlap

Canvas

Tree

Graph

Bars

Animations

Users should always have access to controls.

---

# Information Hierarchy

Priority

1. Visualization

2. Controls

3. Explanation

4. Statistics

5. Code

6. Complexity

7. Decorative Elements

---

# Responsive Behaviour

Desktop

Multi-column layout.

Tablet

Two-column layout.

Mobile

Single-column layout.

Controls should collapse gracefully.

---

# Consistency Rules

Every page must contain

One mascot

One primary action

One explanation section

One consistent navigation

One footer

Theme switch support

---

# AI Rules

Every AI coding agent must

Follow this layout.

Do not redesign page structures independently.

Maintain consistency across every module.

When adding new pages,

follow the same hierarchy and spacing.

---

# Final Principle

Users should never need to learn how to use a new page.

Every page should feel immediately familiar while presenting different educational content.