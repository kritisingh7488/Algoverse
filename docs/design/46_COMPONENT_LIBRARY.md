# 46_COMPONENT_LIBRARY.md — Component Library & UI Specifications

## 1. Primary Component Catalog

### A. Buttons (`Button.jsx`)
Buttons support 4 primary variants and 3 sizes, equipped with smooth hover scales and active click compression effects.

```jsx
// Variant Definitions
<Button variant="primary">Primary Action</Button>   // Purple gradient background (#A855F7)
<Button variant="secondary">Secondary</Button>       // Light violet tint (#EDE9FE)
<Button variant="outline">Outline Action</Button>   // Gray border with hover fill
<Button variant="danger">Delete / Clear</Button>    // Red outline / pink hover fill
```

| Variant | Base Background | Text Color | Hover Effect | Shadow |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `bg-primary` (`#A855F7`) | `text-white` | `hover:bg-primary/90 scale-102` | `shadow-md shadow-primary/20` |
| **Secondary** | `bg-primary/10` | `text-primary` | `hover:bg-primary/20` | None |
| **Outline** | `bg-white border border-gray-200` | `text-gray-700` | `hover:bg-gray-50 border-gray-300` | `shadow-xs` |
| **Danger** | `bg-white border border-red-200` | `text-red-600` | `hover:bg-red-50 border-red-300` | None |

---

### B. Input Controls & Form Elements

```jsx
// Standard Input
<input 
  type="text" 
  className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:outline-none focus:border-primary"
/>

// Select Dropdown
<select className="px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold font-poppins focus:outline-none focus:border-primary">
  <option>Binary Search Tree</option>
</select>
```

- **Focus Ring**: Enforces `focus:border-primary focus:ring-2 focus:ring-primary/20`.
- **Monospace Input**: Used for array CSV inputs, node values, and index targets (`font-mono text-xs`).

---

### C. Cards & Containers

- **Standard Card**: `bg-white p-6 rounded-3xl border border-gray-100 shadow-xs`.
- **Interactive Card**: `bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-pointer`.
- **Canvas Container**: `bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-[360px] relative overflow-hidden flex flex-col justify-between`.

---

### D. Badges & Status Indicators

| Badge Type | Visual Styling | Example Usage |
| :--- | :--- | :--- |
| **Top Pointer** | `text-[10px] font-mono font-bold text-accent bg-pink-50 px-2 py-0.5 rounded-full` | `TOP ↑` (Stack) |
| **Front Pointer** | `text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full` | `FRONT` (Queue) |
| **Head Pointer** | `text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full` | `HEAD` (Linked List) |
| **Complexity Tag** | `text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500` | `O(N log N)` |
| **Winner Badge** | `text-[10px] uppercase font-bold tracking-wider text-emerald-600 font-poppins` | `Fastest Algorithm` |

---

### E. Stepper & Playback Controls Toolbar

```
+-------------------------------------------------------------------------------+
|  [▶ Play/Pause] [◀ Step Prev] [▶ Step Next] [🔄 Reset] [🔀 Random]  | Speed: [0.5x] [1x] [2x] |
+-------------------------------------------------------------------------------+
```

- **Play/Pause Button**: `p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20`.
- **Step Buttons**: `p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-700`.
- **Speed Factor Pills**: `px-2.5 py-1 rounded-lg text-xs font-mono font-medium`.

---

### F. Pseudocode Viewer with Line Highlighter

```jsx
<div className="bg-gray-900 rounded-2xl p-4 font-mono text-[11px] text-gray-300 space-y-1 overflow-x-auto">
  {pseudocode.map((line, idx) => (
    <div key={idx} className={`px-2 py-0.5 rounded transition-colors ${
      activeLine === idx ? 'bg-primary/40 text-white font-bold border-l-2 border-primary' : 'opacity-70'
    }`}>
      {line}
    </div>
  ))}
</div>
```
