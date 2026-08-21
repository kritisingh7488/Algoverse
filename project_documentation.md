# AlgoVerse - Project Documentation & Interview Guide

AlgoVerse is an interactive, real-time algorithm learning and visualization platform. It provides users with a hands-on environment to write, run, and visualize complex data structures and algorithms in real-time.

---

## 1. Current Implemented Features & Detailed Working

### 1.1 Authentication & User Management
* **Working**: Users can sign up, log in, and manage their profiles. Authentication is handled using **JSON Web Tokens (JWT)**. Passwords are cryptographically hashed using `bcrypt` before being stored in MongoDB.
* **Features**: Email verification, forgot/reset password flows, Google OAuth (frontend integration), and profile updates (name, avatars).
* **State Management**: The frontend uses `Zustand` to manage the global authentication state (`useAuthStore`). On app load, it automatically validates the token and fetches user details seamlessly.

### 1.2 Interactive Algorithm Laboratories (Labs)
* **Working**: The platform features multiple dedicated "Labs" (Sorting, Searching, Trees, Graphs, Strings, Backtracking, Dynamic Programming). Each lab visually demonstrates how algorithms operate step-by-step.
* **Architecture**: The frontend sends user inputs (e.g., an array to sort, or a node to insert into a BST) to the backend. The backend spins up a compiled **C++ Engine** via Node.js `child_process`. The C++ engine computes the steps and outputs a JSON stream of states. The Node.js server parses this JSON and sends it back to the React frontend, which uses `framer-motion` or D3/SVG to animate the transitions smoothly.

### 1.3 Real-Time Code Playground
* **Working**: A VS Code-like environment embedded in the browser that allows users to write C++, Python, or JavaScript code and interact with it in real-time.
* **Architecture**: 
  * **Frontend**: Uses `xterm.js` to provide an authentic terminal UI.
  * **Backend**: Uses `socket.io` for real-time bidirectional communication. It leverages `node-pty` to spawn pseudo-terminals, enabling interactive command-line programs (e.g., `cin` in C++ or `input()` in Python) to pause and wait for user input from the browser.
  * **Resilience**: If `node-pty` native bindings fail (e.g., due to cloud environment constraints), the server automatically falls back to standard `child_process.spawn` with local echo shims to maintain functionality.

### 1.4 Gamification & Dashboard
* **Working**: Users are incentivized to learn through a streak system, XP (Experience Points), and levels.
* **Features**: The dashboard displays heatmaps of recent activity, streak tracking, and course progress.

---

## 2. Technical Stack & Packages

### Frontend (Client-Side)
* **Framework**: React.js (Bootstrapped with Vite for instant server start and fast HMR).
* **Styling**: Tailwind CSS for utility-first styling, enabling rapid UI development and dark/light mode support.
* **State Management**: Zustand (lightweight, unopinionated state management without Redux boilerplate).
* **Routing**: React Router DOM (client-side routing, protected routes).
* **Terminal UI**: `xterm.js` and `xterm-addon-fit` for the interactive coding console.
* **Animations**: Framer Motion (used for UI transitions and algorithm step-by-step animations).
* **API Client**: Axios (configured with interceptors to automatically attach JWT tokens to headers).

### Backend (Server-Side)
* **Environment**: Node.js & Express.js.
* **Database**: MongoDB with Mongoose ODM (Object Data Modeling) for schemas (Users, Progress, etc.).
* **Real-time Communication**: Socket.io (for the interactive code playground).
* **System Interop**: `child_process` (`exec`, `spawn`) and `node-pty` for compiling and executing C++/Python safely.
* **Security & Auth**: `bcrypt` (hashing), `jsonwebtoken` (auth tokens), `cors` (Cross-Origin Resource Sharing).
* **File Uploads/Media**: Cloudinary package is configured (but currently avatars rely on external URLs).

---

## 3. Architecture, Routes, and APIs

### 3.1 REST API Routes
* **`/api/auth/*`**: Handles `/login`, `/register`, `/me` (token validation).
* **`/api/user/*`**: Handles profile updates, password changes, and fetching dashboard statistics.
* **`/api/labs/*`**: Dedicated endpoints for triggering the C++ engines (e.g., `/api/labs/tree/insert`).

### 3.2 WebSocket Events (Socket.io)
* **`run_code`**: Client sends language and code string. Server writes code to a temp file, compiles it asynchronously, and spawns the process.
* **`terminal_data`**: Bidirectional. Server sends stdout/stderr to client. Client sends keystrokes (`stdin`) to server.
* **`process_exit` & `kill_process`**: Handles lifecycle and graceful termination of hanging user code.

### 3.3 Deployment Architecture
* **Frontend**: Deployed on **Vercel**. Vercel acts as a CDN, serving the statically built React assets instantly globally.
* **Backend**: Deployed on **Render**. A Node.js web service that connects to a managed MongoDB instance (e.g., MongoDB Atlas).
* **CI/CD**: Pushing to the `main` branch on GitHub automatically triggers build pipelines on both Vercel and Render.

---

## 4. Future Aspects & Roadmap

1. **Dockerized Sandboxing**: Currently, user code runs directly on the Render host machine. A critical future upgrade is using Docker containers or WebAssembly (WASM) to securely sandbox user code execution to prevent malicious operations.
2. **Multiplayer/Collaborative Rooms**: Allowing two users to share a code playground via WebRTC or Socket.io.
3. **Advanced AI Integration**: Integrating an LLM to analyze user code, explain algorithmic complexities (Big O), or suggest optimizations in real-time.


## 5. Advanced Feature Deep-Dive & Specifics

### 5.1 Engine Verifiers (Testing UI)
* **Working**: Engine Verifiers are testing interfaces built directly into the Labs (e.g., Tree Lab and Graph Lab) that allow users to validate their custom algorithms against the internal C++ engines.
* **Architecture**: The UI features quick-action buttons (like "Test BFS", "Test DFS", "Verify BST") positioned at the top of the lab. Clicking these sends the current data structure's state (as a serialized adjacency list or edge list) to a specialized `/verify` endpoint on the Node.js backend. The backend executes a hidden C++ verifier engine that runs the strict, correct algorithm, capturing the exact traversal order or validation boolean, and returns it to the frontend to compare against the user's manual step-by-step result.

### 6.2 Multi-Comparisons (Comparing Algorithms)
* **Working**: Users can compare two algorithms side-by-side in real-time (e.g., Bubble Sort vs Quick Sort).
* **Architecture**: The frontend maintains an independent `stepIndex`, `isPlaying` state, and playback interval for each algorithm. When the "Run Comparison" button is clicked, the React application maps over the selected algorithms and fires parallel asynchronous API requests to the Node.js backend. The backend spins up multiple C++ processes concurrently. Once all JSON streams are returned, the React components render two separate SVG/Framer-Motion canvas views side-by-side, synchronizing their `setTimeout` playback loops so the user can visually race them against each other.

### 6.3 Post-Execution Summary Tables
* **Working**: After an algorithm finishes playing its animation steps, a highly detailed summary table fades in.
* **Features**: It displays the total number of operations, theoretical Time/Space Complexity (Big O), and the exact execution time (in milliseconds) captured by the C++ engine. This provides students with an immediate, tangible understanding of algorithm efficiency.

### 6.4 Random Data Generation (Graphs & Trees)
* **Working**: Users can click "Generate Random Graph" or "Generate Random Tree" to instantly populate the canvas.
* **Architecture**: 
  * **Trees**: The frontend generates a random array of integers, randomly shuffles them using a Fisher-Yates algorithm, and iteratively calls the BST `insert` function to build a valid Binary Search Tree structure in memory before rendering.
  * **Graphs**: The frontend generates a random number of vertices (e.g., 5-10) and then iterates through all possible pairs, using a random probability threshold (e.g., 30%) to decide whether to add an edge. It ensures the graph remains connected by building a minimum spanning tree first, then randomly adding the remaining edges.

### 6.5 Visualization & Draggable Nodes
* **Working**: Data structures are not static; users can click and drag individual nodes around the canvas to re-arrange the visual layout without breaking the underlying logical structure.
* **Architecture**: 
  * **SVG over Canvas**: We use SVG (Scalable Vector Graphics) rather than HTML5 `<canvas>` because SVG elements are treated as DOM nodes. This allows us to attach standard React `onMouseDown`, `onMouseMove`, and `onMouseUp` event listeners directly to the individual circles (nodes).
  * **Drag Physics**: When a node is dragged, React updates a `draggedPositions` state dictionary with the new `(x, y)` coordinates relative to the SVG container. 
  * **Framer Motion vs SVG**: For linear structures (Sorting Arrays), we use `framer-motion` layout animations. For complex, connected structures (Trees/Graphs), we map over the node array to render `<circle>` elements, and map over the edge array to render `<line>` elements that dynamically connect the `(x,y)` coordinates of the nodes in real-time.

---