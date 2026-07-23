# AlgoVerse — MASTER_AGENT_PROMPT

# IMPORTANT

This file is the SINGLE SOURCE OF TRUTH for every AI coding agent working on AlgoVerse.

Before writing a single line of code, the AI MUST read this file.

Then it MUST read every documentation file inside `/docs`.

The AI must NEVER skip documentation.

---

# PROJECT OVERVIEW

Project Name

AlgoVerse

Purpose

Build the world's most beautiful interactive platform for learning Data Structures and Algorithms.

AlgoVerse combines

• Visual learning

• Interactive animations

• Code execution

• Benchmarking

• Contests

• Community

• Developer profile

• Learning analytics

into one complete ecosystem.

---

# TECH STACK

Frontend

React

JavaScript

Vite

TailwindCSS

Framer Motion

Monaco Editor

React Router

Zustand

Axios

Recharts

Backend

Node.js

Express

MongoDB

Algorithm Engine

C++

JSON Event System

Authentication

JWT

Google OAuth

Deployment

Vercel (Frontend)

Render (Backend)

MongoDB Atlas

---

# BEFORE STARTING

Always perform these steps.

Step 1

Read

00_PROJECT_STATE.md

Step 2

Read EVERY documentation file.

Do NOT skip files.

---

# FILE ORDER

Read in this exact order.

00_PROJECT_STATE

01_AGENT_INSTRUCTIONS

02_PRD

03_UI_UX_SPEC

04_DESIGN_SYSTEM

05_ARCHITECTURE

06_DATABASE_SCHEMA

07_API_SPEC

08_CPP_ENGINE

09_VISUALIZATION_ENGINE

10_ANIMATION_SYSTEM

11_AUTHENTICATION

12_DASHBOARD

13_HOME_LANDING

14_DATA_STRUCTURE_PLAYGROUND

15_SORTING_LAB

16_SEARCHING_LAB

17_TREE_LAB

18_GRAPH_LAB

19_DP_STUDIO

20_STRING_ALGORITHMS

21_BACKTRACKING

22_BENCHMARK_CENTER

23_CODE_PLAYGROUND

24_CONTESTS

25_COMMUNITY

26_PROFILE

27_SETTINGS

28_ADMIN

29_COMPONENT_REGISTRY

30_EVENT_SCHEMA

31_ROADMAP

32_TESTING

33_DEPLOYMENT

---

# DEVELOPMENT RULES

Never

❌ Rewrite existing architecture.

❌ Duplicate components.

❌ Ignore Design System.

❌ Ignore PRD.

❌ Create inconsistent UI.

❌ Hardcode values.

❌ Skip ESLint.

❌ Skip responsiveness.

❌ Skip accessibility.

❌ Skip animations.

Always

✅ Reuse components.

✅ Keep code modular.

✅ Keep files small.

✅ Create reusable hooks.

✅ Use modern ES6+ JavaScript throughout the project.

✅ Use Tailwind.

✅ Use Framer Motion.

✅ Maintain cute aesthetic.

---

# Autonomous Execution Rules

Assume Turbo Mode is enabled.

The agent may automatically

- execute PowerShell
- execute terminal commands
- install packages
- run npm commands
- run builds
- run lint
- run tests
- edit files
- create files
- rename files
- reorganize folders
- update documentation

The agent should complete all safe tasks autonomously.

Never ask for confirmation unless

- credentials
- cloud services
- production deployment
- payment
- destructive operations

are involved.

---

# External Service Rules

The following services require user-owned accounts or credentials.

- MongoDB Atlas
- Google OAuth
- Cloudinary
- Vercel
- Render
- GitHub Secrets
- DNS Providers
- Domain Providers

Whenever implementation reaches a feature requiring one or more of these services, the coding agent MUST

1. Complete every possible coding task that does not require credentials.

2. Generate `.env.example` if it does not already exist.

3. Document every required environment variable.

4. Explain exactly what the user must configure.

5. Update `00_PROJECT_STATE.md`.

6. Record pending items under

- Waiting For User
- Pending Manual Steps

7. Pause implementation.

8. Wait for user confirmation.

9. Resume automatically from the recorded project state.

The agent must NEVER

- invent credentials
- invent secrets
- invent OAuth values
- invent API keys
- invent database URIs
- invent passwords

---

# Command Execution Policy

The coding agent operates in Autonomous Turbo Mode.

Assume terminal access, PowerShell execution, and automatic command approval are enabled.

The agent should prefer autonomous execution whenever it is safe to do so.

The agent may automatically

- execute PowerShell commands
- execute terminal commands
- install dependencies
- uninstall unused dependencies
- update dependencies
- run npm install
- run npm run dev
- run npm run build
- run npm run lint
- run npm test
- execute Git status
- execute Git diff
- create folders
- create files
- rename files
- move files
- reorganize folders
- update documentation
- update project state

without requesting confirmation.

If a command fails

the agent must

1. Read the complete error output.

2. Determine the root cause.

3. Apply the smallest safe fix.

4. Retry the command once.

5. Continue automatically if successful.

The agent should not stop after the first error if it is capable of fixing the issue autonomously.

The agent must pause only when

- user credentials are required
- cloud account configuration is required
- payment is required
- domain ownership is required
- legal acceptance is required
- external authentication requires user interaction
- a destructive Git operation would be required
- multiple valid architectural decisions exist and user preference is required

The agent must NEVER automatically execute

- git reset --hard
- git clean -fd
- git push --force
- force pushes
- branch deletion
- history rewriting
- deleting user-created source code without verification
- exposing secrets
- inventing credentials

If implementation is blocked by user configuration

the agent must

1. Finish every remaining coding task that does not require the missing configuration.

2. Save all modified files.

3. Update

00_PROJECT_STATE.md

including

- Waiting For User
- Pending Manual Steps
- Resume From
- Last Safe Checkpoint

4. Generate

.env.example

if required.

5. Generate deployment or setup instructions if required.

6. Clearly explain exactly what the user must do.

7. Pause implementation.

8. Resume automatically after the user confirms completion.

---

# UI STYLE

Theme

Cute

Modern

Elegant

Minimal

Soft

Rounded

Glassmorphism

Gradient

Pastel

Professional

Inspirations

Figma

Linear

Raycast

Apple

GitHub

Duolingo

Notion

Do NOT build generic dashboards.

Every screen should feel premium.

---

# COLOR PALETTE

Primary

#7C5CFC

Secondary

#A78BFA

Accent

#FF8AC2

Background

#FFF9FD

Card

#FFFFFF

Text

#2D2D2D

Success

#4ADE80

Warning

#FBBF24

Danger

#FB7185

---

# ANIMATION RULES

Use Framer Motion.

Everything should animate.

Examples

Cards

Buttons

Sidebar

Timeline

Statistics

Graphs

Charts

Modals

Lists

Badges

Progress Bars

Hover

Page Transition

Confetti

XP

Achievement Unlock

Keep animations smooth.

Never excessive.

---

# COMPONENT RULES

Before creating a component

Check

29_COMPONENT_REGISTRY.md

If component exists

Reuse it.

Never duplicate UI.

---

# EVENT RULES

Never compute visualization in React.

Always use

30_EVENT_SCHEMA.md

React

↓

Renderer

↓

Events

Only.

---

# CPP RULES

All algorithms execute in C++.

React NEVER performs DSA.

Express ONLY forwards requests.

Visualization uses generated events.

---

# RESPONSIVENESS

Must support

Mobile

Tablet

Laptop

Desktop

Ultra Wide

---

# ACCESSIBILITY

Support

Keyboard

Screen Readers

ARIA

Reduced Motion

High Contrast

Semantic HTML

---

# PERFORMANCE

Always

Lazy load pages.

Memoize expensive components.

Use virtualization.

Use efficient API caching strategies.

Optimize bundle size.

Avoid unnecessary renders.

---

# CODE QUALITY

Always

ESLint + Clean JavaScript

ESLint

Prettier

Reusable Hooks

Reusable Components

Meaningful Names

No magic numbers.

No duplicated logic.

---

# FILE STRUCTURE

Never randomly create folders.

Follow architecture exactly.

---

# WHEN CONTEXT RUNS OUT

Before stopping

Update

00_PROJECT_STATE.md

Include

Completed Features

Current File

Current Component

Current API

Pending Work

Known Issues

Next Task

Never stop without updating project state.

---

# WHEN USER RETURNS

Read

00_PROJECT_STATE.md

Continue exactly from

Next Task.

Never ask user

"What were we doing?"

---

# IF USER ASKS

Continue

Resume

Next

Keep Going

Then

Read

00_PROJECT_STATE.md

Resume automatically.

---

# IF NEW FEATURE IS REQUESTED

Before coding

Check

PRD

Architecture

API

Database

Component Registry

Event Schema

Only then

Integrate feature.

Never break architecture.

---

# TESTING

Every feature must include

Loading State

Error State

Empty State

Responsive State

Accessibility

Animations

Lint Clean

---

# DEFINITION OF DONE

A feature is complete ONLY IF

✓ UI Complete

✓ Backend Complete

✓ Database Complete

✓ API Complete

✓ Responsive

✓ Accessible

✓ Animated

✓ Lint Clean

✓ Error Handling

✓ Loading State

✓ Empty State

✓ Tested

✓ Added to Project State

---

# FINAL OBJECTIVE

Build a production-ready platform.

Not a college project.

Every screen should feel polished.

Every animation should feel intentional.

Every interaction should delight the user.

Every feature should be scalable.

AlgoVerse should be a portfolio-level flagship project that demonstrates senior-level MERN engineering, modern UI/UX, advanced DSA visualization, and production-ready architecture.

---

# END OF MASTER AGENT PROMPT

This file must always be read before any development begins.