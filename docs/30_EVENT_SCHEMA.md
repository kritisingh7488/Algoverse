# AlgoVerse — Event Schema

# Purpose

The Event Schema is the communication contract between the C++ DSA Engine and the React Visualization Engine.

Every algorithm running inside the C++ engine MUST emit visualization events instead of directly manipulating the UI.

The frontend should NEVER calculate algorithm states.

It only renders events received from the backend.

This document defines every event type used across AlgoVerse.

---

# Event Flow

```text
User Action

↓

React

↓

Express API

↓

C++ DSA Engine

↓

Generate Events

↓

JSON Response

↓

Playback Engine

↓

Animation System

↓

Visualization
```

---

# Event Principles

Every visualization

- is event-driven.
- is deterministic.
- can be replayed.
- can be paused.
- can be resumed.
- can be reversed.
- supports different playback speeds.

---

# Base Event Structure

Every visualization event follows

```json
{
  "id": 1,
  "type": "compare",
  "timestamp": 0,
  "step": 12,
  "description": "Comparing elements",
  "payload": {}
}
```

---

# Required Fields

Every event contains

```text
id

type

timestamp

step

description

payload
```

---

# Optional Fields

```text
animation

duration

color

highlight

metadata

audio

tooltip
```

---

# Event Categories

Sorting

Searching

Array

Linked List

Stack

Queue

Tree

Graph

Heap

Trie

DP

String

Backtracking

Benchmark

Contest

General

---

# Sorting Events

---

## compare

Purpose

Highlight two elements.

Payload

```json
{
  "left":3,
  "right":7
}
```

---

## swap

Payload

```json
{
  "i":2,
  "j":5
}
```

---

## overwrite

Payload

```json
{
  "index":4,
  "value":18
}
```

---

## pivot

Payload

```json
{
  "index":6
}
```

---

## partition

Payload

```json
{
  "left":0,
  "right":10
}
```

---

## merge

Payload

```json
{
  "left":0,
  "mid":4,
  "right":8
}
```

---

## sorted

Payload

```json
{
  "index":5
}
```

---

# Searching Events

---

## visit

```json
{
  "index":7
}
```

---

## found

```json
{
  "index":4
}
```

---

## not_found

```json
{}
```

---

## move_left

```json
{
  "mid":5
}
```

---

## move_right

```json
{
  "mid":8
}
```

---

# Array Events

insert

delete

update

highlight

resize

rotate

reverse

Each contains

```text
index

value
```

---

# Linked List Events

create_node

visit_node

insert_node

delete_node

reverse_link

move_pointer

head_update

tail_update

---

# Stack Events

push

pop

peek

overflow

underflow

---

# Queue Events

enqueue

dequeue

front

rear

overflow

underflow

---

# Tree Events

visit

insert

delete

rotate_left

rotate_right

balance

highlight_path

search

found

---

# Graph Events

visit_node

visit_edge

enqueue

dequeue

push_stack

pop_stack

relax_edge

color_node

color_edge

discover

finish

---

# Heap Events

insert

extract_min

extract_max

heapify_up

heapify_down

swap

---

# Trie Events

create_node

visit_character

mark_terminal

search

insert

delete

---

# DP Events

create_table

update_cell

highlight_transition

memo_hit

memo_miss

state_complete

---

# String Events

compare

match

mismatch

shift

hash_update

prefix_update

suffix_update

pattern_found

---

# Backtracking Events

recursive_call

decision

constraint_check

backtrack

solution_found

return

---

# Benchmark Events

benchmark_start

iteration_start

metric_update

chart_update

benchmark_complete

---

# Contest Events

submission

verdict

leaderboard_update

rank_change

timer_update

---

# General Events

play

pause

resume

restart

reset

complete

error

warning

loading

---

# Animation Metadata

Each event may include

```json
{
 "animation":"bounce",
 "duration":300,
 "color":"green"
}
```

---

# Supported Animations

Fade

Scale

Bounce

Slide

Glow

Pulse

Rotate

Morph

Shake

Highlight

---

# Playback Engine

Supports

Play

Pause

Resume

Previous

Next

Restart

Skip

Seek

Speed

---

# Playback Speeds

0.25x

0.5x

1x

2x

4x

8x

Instant

---

# Event Validation

Every event must verify

- Valid id
- Valid type
- Valid payload
- Sequential step
- Timestamp order
- Supported animation

Invalid events are discarded.

---

# Event Versioning

Every event contains

```json
{
 "version":"1.0.0"
}
```

Future schema changes should remain backward compatible.

---

# Serialization

Events travel as

```text
C++

↓

JSON

↓

Express

↓

React

↓

Renderer
```

---

# Performance Rules

- Only changed states are emitted.
- Never resend complete structures.
- Batch consecutive events when possible.
- Compress large payloads.
- Lazy load replay history.

---

# Event Storage

Each saved session stores

Events

Metadata

Playback Speed

Algorithm

Input

Statistics

Timestamp

User

Version

---

# Future Events

Memory Allocation

Pointer Updates

Garbage Collection

CPU Profiling

GPU Profiling

AI Explanations

Voice Narration

Collaborative Playback

---

# Definition of Done

The Event Schema is complete when

- Every algorithm emits standardized events.
- React renders using only events.
- Playback works for every module.
- Events are versioned.
- Events are replayable.
- Events remain backward compatible.
- Performance remains efficient.

---

# 30_EVENT_SCHEMA.md Completed
