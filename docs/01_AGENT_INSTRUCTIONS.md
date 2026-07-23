# AlgoVerse — AI Agent Instructions

> **Purpose**
>
> This document defines the mandatory development rules for every AI coding agent working on AlgoVerse.
>
> It acts as the project's engineering handbook.
>
> Every implementation must follow these rules.
>
> If any other document conflicts with this one, this file takes precedence unless `00_PROJECT_STATE.md` explicitly overrides it.

---

# Primary Objective

Build a production-quality educational platform that demonstrates:

* Advanced MERN Stack development
* High-performance C++ algorithm implementation
* Modern UI/UX
* Beautiful animations
* Scalable architecture
* Excellent software engineering practices

This project is intended to be portfolio quality and should feel like a polished SaaS application rather than a college assignment.

---

# AI Behavior Rules

Always:

* Read `00_PROJECT_STATE.md` first.
* Read the module document before implementing it.
* Understand existing architecture before writing code.
* Reuse existing components whenever possible.
* Prefer composition over duplication.
* Keep files organized.
* Maintain documentation.

Never:

* Rewrite completed modules.
* Delete features without documentation.
* Introduce breaking changes without updating related files.
* Ignore project architecture.
* Skip animations.
* Skip responsive behavior.
* Skip loading or error states.

---

# Development Philosophy

Every feature should satisfy four goals:

1. Functional
2. Beautiful
3. Reusable
4. Scalable

The platform should feel polished at every stage.

---

# Architecture Principles

Follow strict separation of concerns.

React handles:

* UI
* Animation
* State
* Rendering

Express handles:

* APIs
* Authentication
* Business logic
* Communication

C++ handles:

* Algorithm execution
* Event generation
* Performance benchmarking

MongoDB handles:

* Persistent storage

Never mix these responsibilities.

---

# Folder Rules

Never place unrelated code together.

Every feature should have:

* Components
* Hooks (if required)
* API service
* Backend controller
* Route
* Documentation

Keep folders clean.

---

# Component Rules

Components must:

* Have a single responsibility.
* Be reusable.
* Accept props instead of hardcoded values.
* Avoid duplicated logic.

Always check `29_COMPONENT_REGISTRY.md` before creating a new component.

If a similar component exists:

Reuse it.

Do not create another version.

---

# State Management Rules

Use:

Context API

Custom Hooks

Local State

Avoid unnecessary global state.

Only lift state when required.

Keep components as independent as possible.

---

# API Rules

Every endpoint must include:

* Validation
* Error handling
* Status codes
* Authentication (if required)
* Input sanitization

Never expose internal errors.

Always return structured JSON.

Example response format:

```json
{
  "success": true,
  "message": "Operation successful.",
  "data": {}
}
```

Error format:

```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

---

# Database Rules

Never duplicate data.

Normalize where practical.

Use references appropriately.

Every schema should include:

* createdAt
* updatedAt

Use Mongoose validation.

---

# Authentication Rules

Use JWT.

Passwords must be hashed.

Never store plaintext passwords.

Support:

* Login
* Signup
* Logout
* Google Login
* Forgot Password
* Reset Password
* Email Verification

Sessions should expire safely.

---

# C++ Rules

Every algorithm must be written from scratch.

Do not use existing visualization libraries.

Algorithms should produce visualization events.

Never generate HTML from C++.

Never generate animations from C++.

Return structured JSON only.

---

# Visualization Rules

React consumes visualization events.

Visualization must never modify algorithm logic.

Every visualizer should support:

Play

Pause

Resume

Restart

Previous Step

Next Step

Speed Control

Random Input

Custom Input

Reset

---

# Animation Rules

Every interaction should feel alive.

Buttons

Hover:

Scale 1.05

Cards

Hover:

Lift

Shadow Increase

Modals

Fade + Scale

Page Navigation

Fade + Slide

Sorting

Smooth swaps

Trees

Grow animation

Graphs

Traversal glow

Success

Confetti

Failure

Gentle shake

Loading

Skeleton UI

---

# Responsive Rules

Every page must support:

Desktop

Tablet

Mobile

No horizontal scrolling.

Touch interactions should remain usable.

---

# Accessibility Rules

Support:

Keyboard navigation

Visible focus states

ARIA labels

Reduced motion

Proper semantic HTML

Color contrast

---

# UI Consistency Rules

Every page should include:

Consistent spacing

Consistent typography

Consistent button styles

Consistent card styles

Consistent animation timing

Consistent icon sizes

No visual inconsistency.

---

# Error Handling Rules

Every API should handle:

400

401

403

404

409

422

429

500

Frontend must display friendly messages.

Never expose stack traces.

---

# Loading State Rules

Every asynchronous operation must display:

Loading spinner

OR

Skeleton loader

Buttons should disable while loading.

Prevent duplicate submissions.

---

# Empty State Rules

Every empty list should display:

Illustration

Helpful text

Call-to-action

Example:

"No bookmarked algorithms yet."

Button:

Explore Algorithms

---

# Notification Rules

Use toast notifications.

Examples:

Login Successful

Visualization Saved

Benchmark Completed

Bookmark Added

Contest Joined

Avoid intrusive alerts.

---

# Naming Conventions

Components:

PascalCase

Example:

SortingVisualizer.jsx

Hooks:

useSorting.js

Controllers:

authController.js

Routes:

authRoutes.js

Models:

User.js

Variables:

camelCase

Constants:

UPPER_SNAKE_CASE

---

# Code Quality Rules

Functions should remain small.

Avoid deeply nested logic.

Extract reusable utilities.

Prefer readability over cleverness.

Comment only when necessary.

---

# Performance Rules

Lazy load pages.

Memoize expensive renders.

Debounce searches.

Throttle resize listeners.

Optimize SVG rendering.

Avoid unnecessary re-renders.

---

# Security Rules

Validate all input.

Sanitize user content.

Protect JWT secrets.

Hash passwords.

Rate limit authentication endpoints.

Prevent XSS.

Prevent NoSQL injection.

---

# Documentation Rules

Whenever a feature changes:

Update:

00_PROJECT_STATE.md

Relevant module documentation

Roadmap

If architecture changes:

Update Architecture.md

If API changes:

Update API_SPEC.md

Never let documentation become outdated.

---

# Git Rules

One feature per commit.

Commit message examples:

feat: add bubble sort visualization

fix: resolve JWT refresh issue

refactor: improve graph rendering

docs: update dashboard specification

---

# Testing Expectations

Every major feature should be manually verified.

Future:

Unit tests

Integration tests

API tests

Component tests

Performance tests

---

# Resume Rules

When an AI session ends:

Update:

Current Task

Files Modified

Recently Completed

Next Planned Tasks

Never leave project state stale.

---

# Definition of Success

AlgoVerse should ultimately feel like:

A polished educational SaaS platform.

A premium developer tool.

A showcase of MERN expertise.

A showcase of advanced C++ algorithms.

A standout portfolio project suitable for software engineering interviews.

Every decision should move the project toward that goal.

---

# Autonomous Development Rules

The coding agent is operating with Turbo Mode enabled.

The agent may automatically

- execute PowerShell commands
- execute terminal commands
- install packages
- remove unused packages
- run npm commands
- run development servers
- run build commands
- run lint
- run tests
- edit project files
- update documentation
- update project state

without requesting confirmation.

The agent should complete as much work as possible autonomously.

Only pause when

- user credentials
- cloud configuration
- payment
- domain ownership
- external approvals

are required.
