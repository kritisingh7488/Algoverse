# 44_MOTION_SYSTEM.md — Motion & Animation System

## 1. Animation Philosophy

In AlgoVerse, motion is not merely decorative — it is a primary instructional tool. Movement shows data flow:
- **Array Swapping**: Demonstrates position exchanges cleanly.
- **Pointer Shifts**: Visualizes `Low`, `Mid`, and `High` pointer adjustments during searches.
- **Tree Node Growth**: Highlights parent-child relationships as nodes enter the tree hierarchy.
- **Stack & Queue Motion**: Illustrates LIFO vs. FIFO arrival and departure dynamics.

---

## 2. Timing & Easing Curves

AlgoVerse uses **Framer Motion** spring physics for natural, fluid state transitions.

| Motion Type | Duration / Physics | Easing / Spring Config | Usage |
| :--- | :--- | :--- | :--- |
| **Node Insertion** | `type: "spring"` | `stiffness: 350, damping: 25` | Array node push, tree node spawn |
| **Array Swap** | `duration: 0.4s` | `easeInOut` | Sorting bar swap, array reverse |
| **Pointer Highlight** | `duration: 0.3s` | `easeOut` | Pseudocode line highlight, pointer movement |
| **Modal Scale** | `type: "spring"` | `stiffness: 400, damping: 30` | Popup dialogs, achievement unlocks |
| **Hover Feedback** | `duration: 0.15s` | `easeOut` | Button hover (`scale-105`), card lift |

---

## 3. Visualizer State Animation Specifications

```
State Colors & Scale Physics:
Default Node:   #FFFFFF (Border: Primary/30) ──> Scale 1.0
Comparing:      #3B82F6 (Blue-500)           ──> Scale 1.05 + Blue Glow
Active / Swap:  #EC4899 (Pink-500)           ──> Scale 1.15 + Pink Ring
Sorted / Found: #10B981 (Emerald-500)        ──> Scale 1.15 + Green Shadow
```

### 1. Array Element Swapping Motion
When two array indices $i$ and $j$ swap:
1. Both elements elevate along the Z-axis (`scale-110 shadow-lg`).
2. Color changes to Pink Accent (`bg-accent text-white`).
3. Elements smoothly slide horizontally to swap coordinates (`layout` prop in Framer Motion).
4. Settle into new indices with soft spring recoil.

### 2. Tree Traversal Glow Motion
During In-Order/Pre-Order/Post-Order traversals:
1. Target SVG node scales up (`scale-115`).
2. Border glows with Amber Ring (`ring-4 ring-amber-200 bg-amber-400`).
3. Connected parent-child edge line animates stroke color from `#E5E7EB` to `#A855F7`.
4. Traversal sequence array appends visited value at the bottom toolbar.

---

## 4. Playback Speed Scaling

The global playback engine controls step timing via the `speed` factor:

$$\text{Step Delay (ms)} = \frac{700}{\text{Speed Factor}}$$

- **0.5x Speed**: $1400\text{ ms per step}$ (Detailed step inspection for beginners).
- **1.0x Speed (Default)**: $700\text{ ms per step}$ (Balanced visualization).
- **2.0x Speed**: $350\text{ ms per step}$ (Fast execution for large arrays).

---

## 5. Motion Accessibility (`prefers-reduced-motion`)

For users sensitive to motion, AlgoVerse automatically respects system settings:
- Layout transitions switch from spring animations to instant opacity fades (`opacity: 0` to `opacity: 1`).
- Heavy continuous rotation animations are disabled.
