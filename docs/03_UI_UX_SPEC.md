# AlgoVerse — UI / UX Specification

## Purpose

This document defines the complete visual and interaction experience of AlgoVerse.

Every screen, component, animation, spacing rule, interaction, empty state, loading state and responsive behavior must follow this specification.

If implementation differs from this document, this document is considered the source of truth.

---

# Design Philosophy

AlgoVerse should never feel like a typical college project.

The UI should feel:

* Premium
* Cute
* Modern
* Interactive
* Soft
* Minimal
* Elegant
* Educational
* Playful without being childish

The interface should make users want to explore.

Every interaction should feel rewarding.

---

# Design Inspiration

Use inspiration from

* Linear
* Arc Browser
* Raycast
* Framer
* Apple
* Notion
* Duolingo
* Figma

Do NOT copy their designs.

Create a unique identity.

---

# Visual Style

Rounded corners

Soft shadows

Floating cards

Pastel gradients

Glassmorphism

Blur effects

Subtle floating background shapes

Animated blobs

Soft glowing accents

Minimal icons

Large whitespace

Clean typography

---

# Global Layout

Every page follows

```
Navbar

↓

Main Content

↓

Floating Action Elements (if needed)

↓

Footer
```

Desktop uses a centered container.

Maximum content width:

1400px

Padding:

32px desktop

20px tablet

16px mobile

---

# Navigation Bar

Fixed to top.

Glassmorphism background.

Blur effect.

Height:

72px

Contains:

Logo

Navigation Links

Global Search

Theme Toggle

Notifications

User Avatar

Login Button (Guest)

Signup Button (Guest)

Profile Dropdown (Logged In)

---

# Navbar Behaviour

Scrolling

↓

Slight shadow appears.

Background opacity increases.

Logo

↓

Tiny bounce on hover.

Navigation Links

↓

Underline animation.

Active page

↓

Gradient underline.

Search

↓

Expands smoothly.

Avatar

↓

Scale 1.05 on hover.

Notification icon

↓

Tiny shake when unread notifications exist.

---

# Sidebar (Dashboard Pages)

Collapsed

80px

Expanded

280px

Contains

Dashboard

Playground

Sorting

Searching

Trees

Graphs

Dynamic Programming

Strings

Backtracking

Benchmarks

Community

Profile

Settings

Hover

↓

Icon scales.

Selected Item

↓

Purple background

↓

Rounded pill

↓

Glow

---

# Footer

Contains

Logo

Quick Links

GitHub

Contact

Version

Copyright

Minimal.

---

# Theme Support

Required

Light Mode

Dark Mode

Future

Auto System Theme

Theme switching should animate smoothly.

---

# Global Buttons

Primary

Rounded

Gradient

Hover

↓

Lift

↓

Shadow increase

↓

Scale 1.03

Click

↓

Compress

↓

Release

Loading

↓

Spinner replaces icon.

Disabled

↓

Reduced opacity

↓

Cursor not allowed

---

Secondary Button

Outlined

Soft border

Hover

↓

Background tint

---

Danger Button

Red

Hover

↓

Glow

Confirmation dialog required.

---

# Input Fields

Rounded

Soft border

Focus

↓

Purple glow

↓

Border animation

Validation

Success

↓

Green border

Error

↓

Red border

Helper text appears below.

---

# Cards

Glassmorphism

Rounded 24px

Soft shadow

Hover

↓

Translate upward

↓

Shadow increase

↓

Background slightly brighter

Cards should never feel flat.

---

# Tooltips

Fade in

150ms

Arrow

Rounded corners

Blur background

---

# Modals

Open

↓

Scale

↓

Fade

Close

↓

Fade

↓

Shrink

Click outside

↓

Close (where appropriate)

Escape

↓

Close

---

# Toast Notifications

Bottom right

Success

Green

Error

Red

Warning

Yellow

Info

Purple

Auto dismiss

4 seconds

Hover pauses timer.

---

# Empty States

Every empty page must include:

Illustration

Helpful message

Primary CTA

Example

"No saved visualizations yet."

Button

Explore Playground

Never show blank pages.

---

# Loading States

Use skeleton loaders.

Never show plain text loading.

Examples

Cards

↓

Skeleton Cards

Tables

↓

Skeleton Rows

Trees

↓

Placeholder Nodes

Graphs

↓

Placeholder Canvas

---

# Error States

Friendly language.

Example

"We couldn't load your benchmarks."

Buttons

Retry

Go Home

Errors should never expose technical details.

---

# Landing Page

Sections

Hero

Feature Cards

Interactive Demo

Algorithm Categories

Statistics

Testimonials (future)

FAQ

Footer

---

## Hero

Large heading.

Animated gradient text.

Short description.

Primary Button

Start Learning

Secondary Button

Explore Algorithms

Right side

Animated algorithm visualization.

Background

Floating pastel blobs.

Mouse movement

↓

Background shifts slightly.

---

# Dashboard

Contains

Greeting

Learning Progress

Continue Learning

Recent Algorithms

Bookmarks

Achievements

Daily Streak

Weekly Activity

Statistics

Upcoming Contests

Announcements

Everything should appear in draggable cards (future enhancement).

---

# Profile Page

Sections

Avatar

Cover

Bio

Achievements

Favorite Algorithms

Recent Activity

Saved Visualizations

Contest History

Statistics

Edit Profile

Animations

Avatar

↓

Float

Achievement badges

↓

Pop on hover

---

# Playground Pages

Every algorithm page shares the same layout.

Left

Controls

Center

Visualization

Right

Explanation Panel

Bottom

Execution Timeline

---

# Control Panel

Contains

Generate Random

Custom Input

Play

Pause

Resume

Restart

Previous Step

Next Step

Animation Speed

Algorithm Selector

Theme

Export

Reset

Every control has tooltip.

---

# Visualization Area

Largest section.

Should always stay centered.

Must resize responsively.

No scrolling during visualization.

---

# Explanation Panel

Contains

Current Step

Current Operation

Pseudo Code

Complexity

Variables

Current State

Updates live during execution.

---

# Timeline

Displays

Every operation.

Current step highlighted.

Completed

↓

Green

Current

↓

Purple

Future

↓

Gray

---

# Benchmark Page

Cards

Runtime

Memory

Comparisons

Swaps

Recursive Calls

Charts below.

Export buttons top right.

---

# Community

Layout

Search

Create Post

Trending

Categories

Discussion Feed

Right Sidebar

Popular Tags

Top Contributors

Hover

↓

Cards lift.

Like

↓

Heart animation.

Bookmark

↓

Ribbon animation.

---

# Contest Page

Hero

Upcoming Contest

Live Timer

Problem List

Leaderboard

Contest Rules

Join Button

Joined state

↓

Animated checkmark.

---

# Settings

Grouped sections

Account

Appearance

Notifications

Security

Privacy

Danger Zone

Every section collapsible.

---

# Admin Dashboard

Statistics

Users

Reports

Problems

Contests

Moderation Queue

Charts

Tables

Filters

Search

Bulk actions

---

# Global Search

Expandable search bar.

Supports

Algorithms

Problems

Users

Posts

Discussions

Keyboard Shortcut

Ctrl + K

Results appear instantly.

---

# Animations

Buttons

200ms

Cards

250ms

Page Transition

350ms

Modal

250ms

Toast

300ms

Sorting

Smooth

Tree Rotation

Spring

Graph Traversal

Glow

Timeline

Slide

Loading

Pulse

Never use abrupt animations.

---

# Responsive Behaviour

Desktop

1400px+

Sidebar expanded.

Tablet

Sidebar collapses.

Mobile

Hamburger menu.

Bottom spacing increased.

Touch targets

Minimum 44px.

---

# Accessibility

Keyboard navigation

Tab order

Focus ring

ARIA labels

Reduced motion

Screen reader support

Semantic HTML

---

# Micro Interactions

Buttons

Bounce

Cards

Lift

Icons

Rotate slightly

Bookmark

Fill animation

Like

Heart burst

Achievement

Confetti

Success

Glow

Failure

Shake

Hover

Cursor pointer

---

# UX Principles

Reduce clicks.

Avoid clutter.

Always provide feedback.

Guide users visually.

Prioritize learning.

Celebrate progress.

Every interaction should feel intentional.

Every animation should reinforce understanding rather than distract from it.
