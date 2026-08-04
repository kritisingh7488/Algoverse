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

---

## 5. Interview Questions (Basic to Advanced)

### Basic (React, Node, JS)
1. What is the Virtual DOM in React and why is it fast?
2. What is the difference between `let`, `const`, and `var`?
3. How does Node.js handle asynchronous operations despite being single-threaded?
4. What is Middleware in Express.js? Can you give an example?
5. Why did we use Tailwind CSS instead of traditional CSS files?
6. Explain the purpose of `useEffect` in React.
7. What is a JWT and how does it authenticate users?
8. What is the purpose of `bcrypt`? Why not just encrypt passwords?
9. Explain the difference between SQL (PostgreSQL) and NoSQL (MongoDB).
10. What is CORS and why is it necessary for this project?
11. How does React Router handle navigation without reloading the page?
12. What is an API interceptor in Axios?
13. What is the difference between local storage and session storage?
14. What does the `package.json` file do?
15. What is the difference between `npm install` and `npm install --save-dev`?

### Intermediate (Architecture, State, Mongoose)
16. Why did we choose Zustand over Redux for state management?
17. Explain how the C++ Engine communicates with the Node.js backend.
18. What is `child_process.spawn` vs `child_process.exec` in Node.js?
19. How did you prevent the Node.js event loop from blocking while compiling C++ code?
20. What is a Pseudo-Terminal (PTY) and why was `node-pty` needed for the playground?
21. How do you handle schema validation in Mongoose?
22. Explain the flow of a WebSocket connection using Socket.io.
23. What happens if a user submits an infinite loop in the Code Playground? How is this handled?
24. How did you resolve the "Flash of Unstyled Content" (FOUC) when managing the dark/light theme?
25. Describe how Framer Motion handles layout animations in the algorithm visualizers.
26. How do you manage secrets and API keys in the deployment environment?
27. What is standard input (`stdin`) and standard output (`stdout`)?
28. Explain how the React `useRef` hook solved the stale state closure bug in the terminal input handler.
29. Why use Vite over Create React App (CRA)?
30. How does token expiration work, and what happens when a JWT expires?
31. What are Mongoose Hooks (pre/post middleware) and how could they be used for hashing passwords?
32. What is a reverse proxy? Does Render use one?
33. Explain the difference between Long Polling and WebSockets.
34. How would you optimize the React components to prevent unnecessary re-renders during fast algorithm animations?
35. How does Vercel serve the frontend application compared to a traditional Node server?

### Advanced (System Design, Security, Edge Cases)
36. If 1,000 users run C++ code simultaneously, what bottleneck will the backend hit first? How would you scale it?
37. How can you securely sandbox user-submitted C++ code to prevent them from reading backend `.env` files?
38. Explain how you would implement a load balancer for the WebSocket connections. What is "sticky sessions"?
39. If `node-pty` fails to build in the production environment, how does the system degrade gracefully?
40. How would you migrate the backend to use WebAssembly (WASM) to run C++ entirely in the user's browser?
41. What is Cross-Site Scripting (XSS), and how does React protect against it when displaying code output?
42. How do you mitigate Denial of Service (DoS) attacks on the `/compile` endpoint?
43. Explain how D3.js or SVG calculates node coordinates dynamically for a changing Binary Tree.
44. If the database goes down, how should the backend respond to the frontend?
45. How does Socket.io handle dropped connections and reconnections?
46. What are the memory implications of storing terminal history in the React frontend?
47. How would you implement rate-limiting on the backend?
48. Explain the algorithmic time complexity of the backend's JSON parsing when receiving data from the C++ engine.
49. How would you design a schema to store a user's code snippet history efficiently?
50. What is the difference between Horizontal and Vertical scaling? Which applies better to our Node execution backend?

### Scenario & Interview Specific
51. **Scenario**: A user reports that the terminal freezes only when they run Python code requiring input. Walk me through your debugging process.
52. **Scenario**: You notice the MongoDB database CPU is at 100%. What queries do you check first?
53. **Design**: How would you implement a "Collaborative Coding" feature like Google Docs into the Playground?
54. **Architecture**: Why decouple the C++ algorithm logic from the Node.js API instead of writing the algorithms directly in JavaScript?
55. **Code Review**: If you saw a developer using `execSync` to run user code, how would you explain why it's a critical error?
56. **Security**: How would you prevent a user from executing `system("rm -rf /")` in the C++ playground?
57. **Performance**: How do you handle rendering a graph with 10,000 nodes without freezing the browser?
58. **DevOps**: Explain the process of setting up continuous integration (CI) for this repository.
59. **Product**: If you had one week to improve user retention on AlgoVerse, what feature would you build and why?
60. **Self-Reflection**: What was the most technically challenging part of building the interactive terminal, and how was it solved?

---

## 6. Advanced Feature Deep-Dive & Specifics

### 6.1 Engine Verifiers (Testing UI)
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

### Additional Interview Specifics

61. **Architecture**: How did you implement Draggable Nodes in the Graph/Tree visualizers without causing massive re-rendering lag?
62. **Testing**: How does the Engine Verifier guarantee that the user's graph traversal exactly matches the standard C++ output?
63. **Concurrency**: When running a Multi-Comparison (e.g., racing 3 sorting algorithms), how does the Node backend handle the concurrent execution without blocking?
