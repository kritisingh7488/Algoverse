# AlgoVerse — Component Library

> Purpose
>
> This document defines every reusable UI component used throughout AlgoVerse.
>
> Components must never be recreated with different styles.
>
> Every component should be reusable, theme-aware, responsive, animated, and accessible.
>
> Every AI coding agent must use this document before creating new UI components.

---

# Component Philosophy

Every component should

- Feel premium
- Feel playful
- Be reusable
- Support light & dark themes
- Be responsive
- Support keyboard navigation
- Follow the design system
- Use Framer Motion where appropriate

Never duplicate components.

Never create page-specific button styles.

---

# Buttons

## Primary Button

Purpose

Primary actions

Examples

Run

Visualize

Continue

Save

Properties

- Filled
- Gradient background
- Rounded corners
- Hover lift
- Soft shadow
- Loading state
- Disabled state
- Ripple animation

---

## Secondary Button

Purpose

Alternative actions

Examples

Reset

Cancel

Preview

---

## Outline Button

Transparent background

Colored border

Hover fills softly.

---

## Ghost Button

No border.

Used inside toolbars.

---

## Danger Button

Delete

Remove

Logout

Reset Data

---

# Inputs

Every input must support

- Label
- Placeholder
- Helper Text
- Validation
- Error State
- Success State
- Focus Animation
- Disabled State

Types

- Text
- Number
- Password
- Search
- Email

---

# Search Bar

Features

- Search icon
- Clear button
- Suggestions
- Keyboard shortcuts

---

# Dropdown

Supports

- Search
- Icons
- Keyboard navigation
- Groups
- Multi-select (where needed)

---

# Toggle

Used for

- Theme
- Settings
- Options

Animated.

Accessible.

---

# Slider

Used for

Animation Speed

Array Size

Node Size

Zoom

Should display current value.

---

# Cards

Every card includes

- Title
- Optional Icon
- Content
- Footer
- Hover Animation
- Theme Support

Variants

- Information
- Statistic
- Lesson
- Achievement
- Warning

---

# Statistic Card

Contains

- Icon
- Value
- Label
- Trend
- Animation

---

# Badge

Rounded pill.

Small.

Pastel colours.

Used for

- Difficulty
- XP
- Tags
- Status

---

# Tooltip

Shows

Explanation

Shortcut

Description

Appears on hover/focus.

---

# Modal

Supports

- Title
- Description
- Actions
- Close
- Keyboard escape
- Background blur

---

# Toast

Types

Success

Warning

Error

Info

Auto dismiss.

---

# Progress Components

XP Bar

Progress Ring

Level Badge

Achievement Counter

Streak Counter

Animated.

---

# Tabs

Smooth transition.

Active indicator.

Scrollable if needed.

---

# Accordion

Used for

FAQs

Algorithm Explanation

Theory

Complexity

---

# Code Block

Features

- Syntax Highlighting
- Copy Button
- Expand
- Line Numbers
- Theme Aware

---

# Console

Supports

- stdout
- stderr
- warnings
- execution time
- clear output

---

# Tables

Rounded

Responsive

Sortable

Searchable

---

# Charts

Supported

- Bar
- Line
- Area
- Pie
- Radar

Animated.

---

# Loading Components

Skeleton

Progress

Mascot Loader

Shimmer

---

# Empty States

Always include

Mascot

Message

Suggested Action

Illustration

---

# Error Components

Friendly Message

Retry Button

Explanation

Mascot

---

# Floating Action Button

Only where necessary.

Bottom-right.

Never obstruct content.

---

# Navigation Components

Sidebar

Top Navigation

Breadcrumbs

Pagination

Footer

---

# Laboratory Components

Every laboratory should reuse

Algorithm Selector

Visualization Canvas

Control Panel

Statistics Panel

Explanation Panel

Code Panel

Complexity Panel

Playback Controls

No lab should implement custom versions of these components.

---

# Accessibility

Every component supports

Keyboard

Screen Readers

Focus States

Reduced Motion

ARIA Labels

---

# AI Rules

Never duplicate components.

Always extend existing ones.

Maintain consistency.

If a new component is required,

add it to this library before implementation.

---

# Final Principle

Components are building blocks.

Every page should feel assembled from one unified design system rather than individually designed.