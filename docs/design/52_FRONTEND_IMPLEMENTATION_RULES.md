# AlgoVerse — Frontend Implementation Rules

> Purpose
>
> This document defines the engineering standards for implementing the AlgoVerse frontend.
>
> It complements the UI Design documentation by specifying **how** the frontend must be built.
>
> Every AI coding agent must read this document before implementing or modifying frontend code.
>
> If any implementation conflicts with these rules, these rules take precedence unless explicitly overridden by the user.

---

# Philosophy

The frontend is not merely a collection of pages.

It is a reusable application built from a consistent design system.

Every page should reuse existing components.

Every component should reuse existing utilities.

Every style should reuse design tokens.

Every animation should reuse motion variants.

Never duplicate functionality.

---

# Frontend Architecture

Use

Pages

↓

Layouts

↓

Feature Components

↓

Shared Components

↓

Hooks

↓

Utilities

↓

Design Tokens

Business logic must never live inside presentation components.

---

# React Principles

Use

Functional Components

React Hooks

Composition

Reusable Components

Controlled Components

Never use large monolithic components.

---

# Component Size

Target

100–250 lines

Maximum

400 lines

If a component exceeds

400 lines

split it.

---

# Page Size

Pages should mainly compose components.

Business logic belongs in

Hooks

Services

Utilities

Stores

---

# Component Responsibilities

One component

One responsibility.

Bad

Dashboard.jsx

Contains

Authentication

Charts

Forms

Sidebar

API Calls

Animations

Good

Dashboard.jsx

↓

Hero

↓

ProgressCard

↓

RecentActivity

↓

QuickActions

↓

Achievements

---

# State Management

Use

Context

or

Zustand

Keep state close to where it is used.

Avoid unnecessary global state.

---

# Styling Rules

Never hardcode

Colours

Radius

Spacing

Fonts

Shadows

Transitions

Always consume

Design Tokens

Tailwind Theme

Shared Styles

---

# Theme Support

Every new component must

Support Light Theme

Support Dark Theme

Support Theme Switching

Never add a component that works in only one theme.

---

# Accessibility

Every component must support

Keyboard navigation

Visible focus

ARIA labels

Reduced motion

Screen readers

Proper contrast

---

# Motion

Never invent animations.

Reuse

Motion System

Motion Variants

Animation Tokens

Framer Motion Components

---

# Icons

Only

Lucide

Heroicons (fallback)

Never mix icon libraries.

---

# Illustrations

Always follow

Mascot System

Illustration Guide

Never import random artwork.

---

# Forms

Every form must support

Validation

Loading

Errors

Success

Keyboard submission

Focus management

---

# API Calls

Never call APIs directly inside UI components.

Use

Services

Hooks

Stores

Repositories

---

# Error Handling

Never silently fail.

Always

Explain

Recover

Retry

Log

Display friendly messages.

---

# Loading

Never leave users guessing.

Use

Skeletons

Progress

Friendly messages

Mascots

---

# Laboratory Implementation

Every laboratory must consist of

Algorithm Engine

↓

Event Generator

↓

Visualization Engine

↓

Playback Controller

↓

Explanation Engine

↓

UI

Never place algorithm logic inside UI components.

---

# Visualization Rules

UI consumes events.

Algorithm generates events.

The UI never calculates algorithm behaviour.

The UI only renders.

---

# Code Reuse

Before writing new code

Search the repository.

Reuse existing

Components

Hooks

Utilities

Animations

Layouts

Styles

Never duplicate.

---

# Performance

Use

Memoization

Lazy Loading

Code Splitting

Virtualization where appropriate

Avoid unnecessary renders.

---

# Folder Structure

Every feature should contain

components/

hooks/

services/

utils/

types/

assets/

Feature logic should remain isolated.

---

# Routing

Use

Nested Routes

Protected Routes

Lazy Loaded Pages

Shared Layouts

Never duplicate layouts.

---

# Testing During Development

Before considering a task complete

Run

npm run lint

npm run build

Verify

No console errors

No warnings

Responsive layout

Theme switching

Keyboard navigation

---

# Local Review

Every implementation cycle must end with

Start development server

Provide preview URL

Wait for user review

Implement revisions

Repeat until approved

Do not continue automatically.

---

# Git Rules

After approval

Update

Project State

Progress

Session Handoff

Commit

Push (if requested)

Never commit before approval unless explicitly instructed.

---

# AI Self Review

Before requesting user review verify

□ No duplicated components

□ No duplicated styles

□ No hardcoded colours

□ No hardcoded spacing

□ No fake data

□ No placeholder UI

□ Theme support

□ Responsive

□ Accessibility

□ Motion consistency

□ Build passes

□ Lint passes

□ Preview available

---

# Refactoring

If existing code violates these rules

Refactor it.

Do not preserve poor architecture merely to avoid change.

Small, safe refactors are encouraged throughout development.

---

# Future Expansion

Every implementation should make future additions easier.

Never optimise only for the current feature.

Build reusable foundations.

---

# AI Rules

Every AI coding agent must

Read all design documentation.

Reuse existing code.

Build incrementally.

Request review frequently.

Never assume approval.

Never sacrifice maintainability for speed.

---

# Definition of Complete

A frontend implementation is complete only if

✓ It follows the design system.

✓ It follows the component library.

✓ It follows the motion system.

✓ It supports both themes.

✓ It is responsive.

✓ It is accessible.

✓ It passes lint.

✓ It passes build.

✓ It has been reviewed by the user.

✓ The user explicitly approves.

---

# Final Principle

Frontend code should be elegant, reusable, maintainable, and delightful.

Every line of code should make AlgoVerse easier to extend rather than harder to maintain.