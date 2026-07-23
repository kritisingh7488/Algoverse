# AlgoVerse — Animation System

## Purpose

This document defines the complete motion system for AlgoVerse.

Animations are a core part of the learning experience, not merely decorative effects.

Every animation should improve understanding, provide feedback, and make the application feel polished while maintaining excellent performance.

---

# Animation Philosophy

Motion should:

* Guide attention.
* Explain changes.
* Reinforce learning.
* Improve usability.
* Reward user actions.
* Never become distracting.

Animations should always have a purpose.

---

# Motion Principles

Every animation should be:

* Smooth
* Responsive
* Predictable
* Consistent
* Lightweight
* Accessible

Avoid flashy or unnecessary motion.

---

# Animation Library

Primary

Framer Motion

Secondary

CSS transitions

Native browser animations where appropriate.

Do not mix multiple animation libraries for similar purposes.

---

# Performance Targets

Target FPS

60 FPS

Avoid layout thrashing.

Avoid unnecessary re-renders.

Animate transforms and opacity whenever possible.

Avoid animating expensive properties.

---

# Global Animation Timing

Extra Fast

100ms

Fast

150ms

Normal

250ms

Medium

350ms

Slow

500ms

Very Slow

700ms

---

# Easing

Default

Spring

Fade

Ease Out

Progress Indicators

Linear

Bounce should be subtle.

---

# Animation Categories

* Page
* Navigation
* Buttons
* Cards
* Forms
* Dialogs
* Tooltips
* Visualizations
* Notifications
* Achievements
* Loading
* Empty States

---

# Page Transition

Trigger

Navigation

Animation

Fade

*

Slide Up

Duration

350ms

Pages should never abruptly change.

---

# Route Loading

While lazy loading:

Display

Skeleton

or

Animated placeholder

Never display a blank white screen.

---

# Navbar

On Load

Fade In

↓

Slide Down

Navigation Link Hover

Gradient underline

↓

Text color transition

Logo Hover

Tiny float

↓

Rotate 2°

Theme Toggle

Smooth icon morph

---

# Sidebar

Expand

Width animation

Collapse

Width animation

Menu Item Hover

Background tint

↓

Icon scales

↓

Text slides slightly

Active Item

Animated gradient indicator

---

# Buttons

Primary Button

Default

Gradient

Hover

Lift

↓

Shadow Increase

↓

Scale 1.03

Click

Compress

↓

Release

Loading

Spinner

↓

Disable click

Success

Checkmark transition

Danger

Subtle red glow

Never use aggressive scaling.

---

# Icon Buttons

Hover

Background tint

↓

Rotate 5°

↓

Scale 1.08

Click

Compress

Release

---

# Cards

Entry

Fade

↓

Slide Up

Hover

Lift

↓

Shadow

↓

Soft Glow

Exit

Fade

↓

Shrink

Cards should appear floating.

---

# Input Fields

Focus

Border animation

↓

Glow

Error

Gentle horizontal shake

Success

Green glow

Placeholder

Fade slightly on typing

---

# Search Bar

Expand

Width transition

Search Results

Fade

↓

Staggered list animation

Clear Button

Fade In

---

# Dropdowns

Open

Fade

↓

Scale

↓

Slide

Close

Reverse

Options

Stagger animation

---

# Tooltips

Appear

Fade

↓

Translate

Disappear

Fade

Delay

150ms

---

# Modals

Background

Blur

↓

Dark overlay

Dialog

Scale

↓

Fade

Close

Fade

↓

Shrink

Escape key

Smooth exit

---

# Toast Notifications

Entry

Slide from bottom-right

↓

Fade

Exit

Fade

↓

Slide down

Hover

Pause timer

Stack multiple toasts neatly.

---

# Tabs

Active Tab

Sliding indicator

Content

Fade transition

---

# Accordion

Expand

Height animation

↓

Fade

Collapse

Reverse

---

# Skeleton Loaders

Pulse animation

Slow shimmer

Never use static placeholders.

---

# Progress Bars

Smooth width animation

No sudden jumps.

---

# Counters

Animate values

Count Up

Used for:

Statistics

Benchmarks

Achievements

---

# Charts

Entry

Grow

↓

Fade

Tooltip

Smooth fade

Dataset change

Animated transition

---

# Hero Section

Background blobs

Float continuously

Mouse movement

Parallax effect

Headline

Gradient animation

CTA Buttons

Gentle pulse every few seconds

---

# Floating Elements

Background shapes

Move slowly

Randomized paths

Very low opacity

Should never distract.

---

# Achievement Unlock

Badge

Scale

↓

Glow

↓

Confetti

↓

Toast

Sound support (future)

---

# Confetti

Trigger

Major achievements only

Examples

100 Problems Solved

Contest Winner

Longest Streak

Do not overuse confetti.

---

# Empty States

Illustration

Fade

↓

Bounce slightly

CTA

Pulse every few seconds

---

# Error States

Illustration

Fade

Retry button

Gentle attention pulse

Never flash red repeatedly.

---

# Visualization Animations

All visualization animations should use the same motion language.

---

## Array

Compare

Purple glow

Swap

Spring movement

Overwrite

Height transition

Sorted

Green glow

---

## Linked List

Node Insert

Slide

↓

Scale

Delete

Fade

Arrow Update

Smooth redraw

---

## Stack

Push

Node drops from top

Pop

Node rises out

Peek

Glow

---

## Queue

Enqueue

Slide from right

Dequeue

Slide left

Front

Highlight

Rear

Highlight

---

## Heap

Insert

Node grows

Swap

Position transition

Heapify

Animated movement

---

## Tree

Insert

Scale In

Delete

Fade Out

Traversal

Node glow

Rotation

Entire subtree rotates smoothly

Root should remain visually stable.

---

## Trie

New Node

Grow

Search

Current node glows

Match

Green

Mismatch

Red

---

## Graph

Node Visit

Blue glow

Edge Visit

Purple

Shortest Path

Green

Queue updates

Animated list

Priority Queue

Live updates

---

## Dynamic Programming

Cell Read

Highlight

Cell Write

Glow

Transition

Arrow animation

Memoization Hit

Golden flash

---

## Strings

Character Compare

Highlight

Shift

Slide

Match

Green

Mismatch

Red

Prefix Table

Glow

---

## Backtracking

Choose

Highlight

Reject

Fade

Backtrack

Reverse path

Solution

Green path animation

---

# Timeline Animation

Current step

Pulse

Completed

Slide Left

Upcoming

Fade

Seeking

Smooth interpolation

---

# Playback Controls

Play

Icon morph

Pause

Icon morph

Speed Change

Slider animation

Restart

Rotation animation

---

# Bookmark

Outline

↓

Fill

↓

Scale

↓

Glow

---

# Like

Heart outline

↓

Fill

↓

Burst animation

↓

Counter increments

Failure

Rollback animation

---

# Notifications Icon

Unread

Gentle shake every few seconds

Read

No animation

---

# Avatar

Hover

Scale

↓

Glow

Dropdown

Slide

↓

Fade

---

# Theme Switch

Light ↔ Dark

Crossfade

Background transition

Icon morph

No abrupt flashes.

---

# Scroll Animations

Sections animate only once.

Fade

↓

Slide Up

Use intersection observers.

Avoid repeated animations.

---

# Reduced Motion

If the user prefers reduced motion:

Disable

* Floating backgrounds
* Continuous animations
* Confetti
* Large transitions

Keep:

* Essential feedback
* Focus indicators
* Loading states

---

# Animation Rules

Never chain too many animations.

Never animate every element simultaneously.

Never delay important interactions.

Always prioritize responsiveness over visual effects.

Animations should enhance learning, not reduce usability.

---

# Future Motion Features

* Physics-based interactions
* Haptic feedback (mobile)
* Audio feedback (optional)
* Interactive particle effects
* Export animations as video
* Animated tutorials

---

# Summary

The Animation System defines the visual personality of AlgoVerse.

Every interaction should communicate quality, clarity, and responsiveness.

Motion should help users understand algorithms, celebrate progress, and make the platform enjoyable to use while remaining fast, accessible, and consistent across the entire application.
