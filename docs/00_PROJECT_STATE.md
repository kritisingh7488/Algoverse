# AlgoVerse — Project State

> **Purpose**
>
> This document is the **single source of truth** for the AlgoVerse project.
>
> Every AI coding agent (Antigravity, Claude Code, Codex, Cursor, Windsurf, Roo Code, etc.) MUST read this document before making any modification to the project.
>
> If development stops because of token limits, context limits, account switching, IDE restart, power failure, network interruption, or any other reason, the next AI session MUST begin by reading this file.
>
> This file is the permanent memory of the project and must always reflect the latest implementation state.

---

# Project Information

## Project Name

AlgoVerse

---

## Tagline

An Interactive Algorithm Laboratory for Learning, Visualizing, Benchmarking and Mastering Data Structures & Algorithms.

---

## Project Type

Full Stack Educational Platform

---

## Project Goal

Build a modern, beautiful, production-quality platform where users can

- Learn Data Structures
- Learn Algorithms
- Visualize execution
- Compare algorithms
- Benchmark implementations
- Practice coding
- Participate in contests
- Track progress
- Build custom structures
- Engage with the community

The project should demonstrate advanced software engineering, modern UI/UX, scalable architecture, MERN development and C++ algorithm implementation.

---

# Core Philosophy

AlgoVerse is NOT

- another CRUD application
- another LeetCode clone
- another static visualization website

AlgoVerse should feel like an interactive laboratory where every screen teaches something.

Every animation should have a purpose.

Every interaction should improve understanding.

Every feature should feel polished.

---

# Primary Objectives

The application should

- Teach visually.
- Encourage experimentation.
- Compare multiple algorithms.
- Benchmark implementations.
- Track user learning.
- Reward progress.
- Encourage community interaction.
- Become a flagship portfolio project.

---

# Target Users

Primary

- Computer Science Students
- University Students
- Coding Interview Candidates
- Competitive Programmers
- Self Learners

Secondary

- Teachers
- Coding Clubs
- Bootcamps
- Developers

---

# Supported Platforms

Desktop (Highest Priority)

Tablet

Mobile

Responsive Design Required

---

# Final Technology Stack

## Frontend

React

JavaScript

Vite

Tailwind CSS

React Router

Axios

Framer Motion

Monaco Editor

Recharts

Zustand

---

## Backend

Node.js

Express.js

JWT

bcrypt

Google OAuth

---

## Database

MongoDB Atlas

Mongoose

---

## Storage

Cloudinary

---

## DSA Engine

C++

STL

JSON Event Generator

---

## Deployment

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

---

## Development

Git

GitHub

ESLint

Prettier

---

# Architecture Overview

```text
Frontend

↓

Express API

↓

Business Logic

↓

C++ Algorithm Engine

↓

Visualization Events

↓

Frontend Renderer
```

---

# Core Rule

Algorithms NEVER manipulate UI.

Algorithms ONLY generate visualization events.

React ONLY renders events.

The visualization engine must remain completely independent from the algorithm engine.

---

# Design Philosophy

AlgoVerse should feel

Cute

Elegant

Premium

Interactive

Educational

Modern

Fast

Minimal

Professional

---

# Design Inspiration

- Linear
- Raycast
- Apple
- Framer
- Figma
- Notion
- Duolingo

The UI must be inspired by these products but never imitate them directly.

---

# Color Palette

Background

#FFF8FC

Primary

#A855F7

Secondary

#7C3AED

Accent

#FF7AC6

Success

#34D399

Warning

#FBBF24

Danger

#F87171

Dark Background

#111827

Text Primary

#1F2937

Text Secondary

#6B7280

---

# Typography

Headings

Poppins

Body

Inter

Code

JetBrains Mono

---

# UI Principles

Every screen should include

- Consistent spacing
- Smooth transitions
- Responsive layouts
- Hover interactions
- Loading states
- Empty states
- Error states
- Accessibility support

---

# Animation Philosophy

Animations should

Explain.

Teach.

Guide.

Never distract.

Target

60 FPS

---

# ===========================
# LIVE PROJECT STATE
# ===========================

This section changes continuously throughout development.

Every AI session MUST update it.

---

## Current Phase

Phase 14 (Full Stack Completion & Production Ready)

---

## Current Module

Full Stack Application

---

## Current Feature

All Frontend & Backend Modules Complete & Fully Verified

---

## Current File

frontend/src/App.jsx

---

## Current Agent

Main Agent

---

## Active Sub-Agents

Record every active sub-agent.

Format

Agent Name

Assigned Module

Current File

Status

Example

Frontend Agent

Dashboard

Dashboard.jsx

Completed

---

Backend Agent

Authentication

authController.js

In Progress

---

Visualization Agent

Sorting Lab

MergeSortVisualizer.jsx

Waiting

---

## Current Branch

Example

main

develop

feature/authentication

---

## Build Status

Working

---

## Last Successful Build

Date

Time

---

## Last Successful Commit

Commit Hash

Commit Message

---

## Current Priority

Highest priority task.

Only ONE priority should exist.

---

## Files Completed This Session

backend/models/User.js
backend/utils/jwt.js
backend/middleware/auth.js
backend/controllers/authController.js
backend/routes/authRoutes.js
frontend/src/api/axios.js
frontend/src/store/authStore.js
frontend/src/components/common/Button.jsx
frontend/src/components/common/Input.jsx
frontend/src/layouts/AuthLayout.jsx
frontend/src/pages/auth/Login.jsx
frontend/src/pages/auth/Signup.jsx
frontend/src/pages/auth/ForgotPassword.jsx
frontend/src/pages/auth/ResetPassword.jsx
frontend/src/pages/auth/VerifyEmail.jsx
frontend/src/components/layout/Navbar.jsx
frontend/src/components/layout/Sidebar.jsx
frontend/src/components/layout/Footer.jsx
frontend/src/layouts/AppLayout.jsx
frontend/src/components/common/LoadingScreen.jsx
frontend/src/pages/NotFound.jsx
frontend/src/pages/LandingPage.jsx
frontend/src/pages/Dashboard.jsx
frontend/src/pages/Playground.jsx
frontend/src/pages/BenchmarkCenter.jsx
frontend/src/pages/CodePlayground.jsx
frontend/src/pages/Community.jsx
frontend/src/pages/Contests.jsx
frontend/src/pages/Profile.jsx
frontend/src/pages/Settings.jsx
frontend/src/pages/Admin.jsx
frontend/src/pages/Roadmap.jsx
frontend/src/pages/labs/SortingLab.jsx
frontend/src/pages/labs/SearchingLab.jsx
frontend/src/pages/labs/TreeLab.jsx
frontend/src/pages/labs/GraphLab.jsx
frontend/src/pages/labs/DPStudio.jsx
frontend/src/App.jsx

---

## Files Modified This Session

List every modified file.

---

## Files Currently In Progress

This section should normally contain

ZERO

or

ONE

file.

Never leave multiple files half-completed.

---

## Interrupted During

If the previous AI session stopped unexpectedly, record

File

Component

Function

Last Completed Section

Example

SortingVisualizer.jsx

Animation Timeline

Stopped while implementing playback controls.

---

## Resume From

Live Authentication Testing (Requires external setup)

---

# Recovery Rules

Development may stop unexpectedly because of

- AI token limits
- Daily quota limits
- Account switching
- IDE restart
- Power failure
- Network interruption
- Unexpected crashes

Therefore

The project must always be recoverable.

---

## Recovery Rule 1

Never leave more than ONE source file unfinished.

Complete one file.

Save it.

Then move to another.

---

## Recovery Rule 2

Immediately after completing a file

- Save the file.
- Verify syntax.
- Verify imports.
- Verify exports.
- Update this document.
- Continue.

Never postpone updating project state.

---

## Recovery Rule 3

Never rely on chat history.

Never rely on model memory.

Never rely on previous conversations.

Documentation is the permanent memory.

---

## Recovery Rule 4

If development stops unexpectedly

The next AI session MUST

1. Read this file.
2. Read 01_AGENT_INSTRUCTIONS.md.
3. Read 34_MASTER_AGENT_PROMPT.md.
4. Read the documentation for the current module.
5. Resume from "Resume From".

---

## Recovery Rule 5

If a file is incomplete

Do NOT begin another feature.

Always finish the current file first.

---

# Development Roadmap

Implementation Order

Phase 1

Project Setup

Phase 2

Authentication

Phase 3

Application Shell

Phase 4

Landing Page

Phase 5

Dashboard

Phase 6

Data Structure Playground

Phase 7

Sorting Lab

Phase 8

Searching Lab

Phase 9

Tree Lab

Phase 10

Graph Lab

Phase 11

Dynamic Programming Studio

Phase 12

String Algorithms

Phase 13

Backtracking

Phase 14

Benchmark Center

Phase 15

Code Playground

Phase 16

Community

Phase 17

Contests

Phase 18

Profile

Phase 19

Settings

Phase 20

Admin

Phase 21

Testing

Phase 22

Deployment

---

# Project Rules

Every feature must

- Follow the architecture.
- Reuse existing components.
- Remain responsive.
- Include animations.
- Handle loading states.
- Handle empty states.
- Handle errors.
- Follow accessibility standards.
- Pass linting.
- Match documentation.

---

# Coding Rules

Never

- Duplicate components.
- Duplicate APIs.
- Hardcode data.
- Mix business logic into UI.
- Manipulate UI from the C++ engine.
- Ignore project documentation.
- Skip updating project state.

Always

- Build reusable components.
- Keep files modular.
- Keep functions small.
- Prefer composition over duplication.
- Follow the documented architecture.

---

# File Completion Checklist

A file is complete only if

☐ Syntax is valid

☐ Imports are correct

☐ Exports are correct

☐ Lint passes

☐ Component renders

☐ Related documentation updated

☐ Project state updated

☐ File saved

Never continue before every applicable item is complete.

---

# Documentation Synchronization Rules

Whenever implementation changes

Immediately update affected documentation.

Possible documents include

- Architecture
- Database Schema
- API Specification
- Authentication
- Component Registry
- Event Schema
- Deployment
- Roadmap

Never allow implementation and documentation to diverge.

---

# Git Workflow

Recommended Branches

main

↓

develop

↓

feature/<feature-name>

Commit after every completed feature.

Recommended commit format

feat: authentication completed

feat: sorting visualization completed

feat: dashboard completed

fix: merge sort playback

docs: update architecture

---

## Waiting For User

- MongoDB Atlas URI
- Cloudinary Credentials
- Google OAuth Credentials

If this section is not empty, implementation depending on these services must pause until the user completes configuration.

---

## Pending Manual Steps

- Create MongoDB Atlas Cluster
- Configure Google OAuth
- Configure Cloudinary
- Add environment variables to `.env` based on `.env.example`

---

## Last Safe Checkpoint

Always record

- Last completed file
- Last successful build
- Last successful lint
- Last Git commit

This represents the safest recovery point if development is interrupted.

---

# Session Completion Checklist

Before ending ANY AI session

Verify

☐ Current file completed

☐ File saved

☐ Project builds (if applicable)

☐ 00_PROJECT_STATE.md updated

☐ Documentation updated (if required)

☐ All completed files have been physically saved to disk.

☐ Resume From updated

☐ Current File updated

☐ Files Completed This Session updated

☐ Files In Progress updated

☐ Next Priority updated

Only after all applicable items are complete may the AI session end.

---

# AI Resume Instructions

Every new AI session MUST perform these steps in order.

1. Read 00_PROJECT_STATE.md completely.

2. Read 34_MASTER_AGENT_PROMPT.md.

3. Read 01_AGENT_INSTRUCTIONS.md.

4. Read only the documentation required for the current module.

5. Resume from the file listed under

Resume From

6. Complete that file before opening another file.

7. Update project state immediately after completion.

Never restart completed work.

Never ask

"What were we working on?"

The answer must always exist inside

00_PROJECT_STATE.md.

---

# Critical Rule for Agent-Driven Development

This project is intentionally developed using multiple AI models, multiple ChatGPT accounts, and autonomous coding agents.

Therefore

Every completed file is considered a checkpoint.

Agents MUST

- Finish one file.
- Save one file.
- Update project state.
- Then continue.

Sub-agents follow the same rule.

No agent may leave multiple unfinished files.

Project continuity is more important than development speed.

---

# Definition of Done

A feature is complete only when

- Frontend is complete.
- Backend is complete.
- Database changes are complete.
- APIs are complete.
- Responsive design works.
- Accessibility requirements are satisfied.
- Animations are implemented.
- Loading state exists.
- Empty state exists.
- Error handling exists.
- ESLint passes.
- Documentation is synchronized.
- Project state is updated.
- Feature has been committed to Git.

---

# Notes

This document is the permanent memory of AlgoVerse.

Whenever uncertainty exists,

trust this document over conversation history.

Every significant architectural decision, implementation milestone, interruption, and completed feature should be reflected here.

This document should always allow a completely new AI session to resume development without asking the user what happened previously.

---

# 00_PROJECT_STATE.md Completed