# AlgoVerse — System Architecture

## Purpose

This document defines the overall software architecture of AlgoVerse.

It describes how every layer of the application communicates, where responsibilities belong, how new features should be added, and how the MERN stack integrates with the C++ algorithm engine.

Every implementation must follow this architecture.

---

# Architecture Goals

The architecture should be:

* Modular
* Scalable
* Maintainable
* Testable
* Extensible
* High Performance
* Easy to understand
* AI-agent friendly

---

# High-Level Architecture

```text
                 User
                  │
                  ▼
          React Frontend
                  │
          REST API / Socket.io
                  │
          Express Backend
                  │
      Business Logic Layer
          │             │
          │             │
          ▼             ▼
 MongoDB Database   C++ Algorithm Engine
          │             │
          └──────► JSON Visualization Events
                          │
                          ▼
              React Visualization Engine
                          │
                          ▼
                     User Interface
```

---

# Technology Responsibilities

## React

Responsible for:

* UI
* Routing
* State
* Forms
* API Calls
* Visualizations
* Animations
* User interactions

React MUST NOT contain algorithm implementations.

---

## Express

Responsible for:

* Authentication
* APIs
* Validation
* Business Logic
* Authorization
* Database Communication
* C++ Engine Communication

Express MUST NOT perform visualization.

---

## MongoDB

Responsible for:

* Persistent storage
* User progress
* Saved visualizations
* Bookmarks
* Community data
* Contest data
* Statistics

MongoDB MUST NOT store temporary animation state.

---

## C++ Engine

Responsible for:

* Algorithm execution
* Benchmarking
* Event generation
* Complexity calculations

The C++ engine MUST NEVER:

* Generate HTML
* Generate CSS
* Generate React Components
* Handle authentication
* Access MongoDB directly

---

# Project Structure

```text
AlgoVerse/

client/
server/
cpp-engine/
docs/
```

---

# Client Structure

```text
client/

src/

assets/

components/

pages/

layouts/

hooks/

contexts/

services/

animations/

visualizers/

utils/

constants/

types/

styles/
```

---

# Server Structure

```text
server/

controllers/

routes/

middleware/

models/

services/

utils/

config/

socket/

validators/
```

---

# C++ Engine Structure

```text
cpp-engine/

sorting/

searching/

trees/

graphs/

dp/

strings/

backtracking/

benchmark/

shared/

executables/
```

Each folder contains only algorithm implementations for its category.

---

# Architectural Layers

## Layer 1

Presentation Layer

Technology

React

Contains

* Components
* Pages
* Layouts
* Animations

---

## Layer 2

Application Layer

Technology

Express

Contains

* Controllers
* Services
* Routes

---

## Layer 3

Domain Layer

Contains

Business logic.

Example

User Progress

Bookmarks

Achievements

Contest ranking

Recommendation logic

---

## Layer 4

Algorithm Layer

Technology

C++

Contains

Algorithm implementations.

---

## Layer 5

Persistence Layer

Technology

MongoDB

Stores application data.

---

# Request Flow

Example

User clicks

Run Bubble Sort

↓

React sends request

↓

Express validates input

↓

Express invokes C++ Engine

↓

C++ returns visualization events

↓

Express returns JSON

↓

React stores events

↓

Visualization engine animates them

---

# Authentication Flow

Signup

↓

Validate

↓

Hash password

↓

Store user

↓

Generate JWT

↓

Return user

↓

Frontend stores token securely

↓

Protected routes become accessible

---

# Visualization Flow

Every visualization follows the same pipeline.

Input

↓

Validation

↓

Algorithm Execution

↓

Event Generation

↓

JSON Response

↓

React Playback

↓

Animation

↓

Completion

No visualization should directly depend on algorithm implementation details.

---

# Event-Driven Architecture

The visualization engine is event-based.

Algorithms emit events.

The frontend consumes events.

Example

```json
{
  "type": "compare",
  "i": 2,
  "j": 5
}
```

Another example

```json
{
  "type": "visit",
  "node": 7
}
```

Every algorithm must use the same standardized event system.

---

# Component Architecture

Components should follow this hierarchy.

```text
Page

↓

Feature Component

↓

Reusable Component

↓

Primitive UI Component
```

Example

```text
SortingPage

↓

SortingVisualizer

↓

ControlPanel

↓

PrimaryButton
```

Never skip hierarchy.

---

# State Management

Global State

Context API

Local State

useState

Complex Logic

Custom Hooks

Avoid unnecessary global state.

---

# API Architecture

Each module follows:

```text
Route

↓

Controller

↓

Service

↓

Database or C++ Engine

↓

Response
```

Controllers should remain thin.

Business logic belongs in services.

---

# Database Access

Models should only be accessed inside services.

Controllers should never manipulate database models directly.

---

# C++ Integration

Node communicates with C++ using child processes.

General flow:

1. Express prepares input.
2. Input is serialized.
3. C++ executable is invoked.
4. Algorithm executes.
5. Events are generated.
6. JSON output is returned.
7. Express forwards the response.

The communication layer should be isolated so it can later be replaced with a dedicated C++ microservice if desired.

---

# Error Flow

Every layer should handle its own errors.

Frontend

User-friendly messages

Backend

Structured JSON

C++

Error codes

Never expose stack traces.

---

# Logging

Backend

Request logs

Authentication logs

Error logs

Contest logs

Visualization logs

Future

Centralized logging.

---

# Security Architecture

Authentication

JWT

Authorization

Role Based

Passwords

Bcrypt

Validation

Express Middleware

Protected Routes

Middleware

Rate Limiting

Authentication APIs

Future

Refresh token rotation.

---

# Performance Strategy

Frontend

Lazy Loading

Code Splitting

Memoization

Virtualization if needed

Backend

Efficient queries

Indexes

Pagination

Caching (future)

C++

Efficient STL usage

Avoid unnecessary copies

Benchmark algorithms

---

# Scalability

Adding a new algorithm should require:

1. C++ implementation
2. Event generation
3. API registration
4. React visualizer registration
5. Documentation update

No architectural changes should be necessary.

---

# Dependency Rules

React

Depends on Express

Express

Depends on MongoDB and C++

C++

Depends only on STL and shared utilities

C++ should never depend on React or Express.

---

# Communication Rules

Modules communicate only through public interfaces.

Never import files across unrelated modules.

Example

Sorting should not directly access Graph module internals.

Use shared utilities where appropriate.

---

# Future Expansion

The architecture should allow future addition of:

* AI Tutor
* Online Judge
* Mobile Application
* Dockerized execution
* Plugin system
* Classroom mode
* Premium subscriptions
* Multi-language execution engine

without requiring major rewrites.

---

# Architecture Principles Summary

* Single Responsibility
* Separation of Concerns
* Reusability
* Modularity
* Event-Driven Visualization
* Scalable Folder Structure
* Thin Controllers
* Service-Based Business Logic
* Standardized API Responses
* Independent C++ Algorithm Engine

Every new feature must fit into this architecture rather than introducing a new pattern.
