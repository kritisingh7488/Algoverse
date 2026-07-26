# 43_MASCOT_SYSTEM.md — Mascot System & Illustration Rules

## 1. Mascot Identity: `AlgoCat` 🐱⚡

AlgoCat is the official mascot and learning companion of AlgoVerse. AlgoCat represents curiosity, agility, and precision. It appears across the application to encourage students, highlight edge cases, and guide users through complex algorithmic steps.

---

## 2. Mascot Expressions & Mood States

```
                 /\_/\
                ( o.o )  <-- "Looking for the target element!"
                 > ^ <
```

| State | Name | Emotional Trigger | Visual Representation | Dialogue Example |
| :--- | :--- | :--- | :--- | :--- |
| **Idle / Curious** | `AlgoCat-Search` | User is selecting an algorithm | Cat wearing round glasses looking through a magnifying glass | *"Which sorting algorithm shall we test today?"* |
| **Pondering** | `AlgoCat-Think` | Algorithm is executing comparisons | Cat scratching chin with a pencil over a notebook | *"Comparing arr[i] with arr[j]... Notice how QuickSort chooses its pivot!"* |
| **Celebratory** | `AlgoCat-Win` | Target found, array sorted, quiz passed | Cat wearing a mini graduation cap doing a high-five | *"Bingo! Target found in O(log N) time using Binary Search!"* |
| **Caution / Alert** | `AlgoCat-Alert` | Stack overflow, cycle detected, infinite loop warning | Cat with wide eyes holding a yellow warning flag | *"Watch out! Popping an empty stack leads to Stack Underflow!"* |
| **Code Helper** | `AlgoCat-Coder` | Code Playground or interview tip box | Cat typing on a mechanical keyboard with purple neon glow | *"Pro Tip: Space complexity can be reduced to O(1) using two pointers!"* |

---

## 3. Mascot Placement & Decoration Rules

### Rule 1: Never Obstruct the Workspace
- AlgoCat must **NEVER** cover canvas SVG elements, visualizer node bars, or pseudocode text.
- Mascot cards are strictly placed in:
  1. The **Educational Sidebar** (bottom of right column).
  2. Empty state placeholders (e.g. empty queue or cleared tree canvas).
  3. Milestone achievements & Quiz completion modal headers.

### Rule 2: Non-Intrusive Guidance
- Mascot dialogue boxes must be dismissible or auto-collapse into a subtle floating badge.
- Micro-illustrations must use soft ambient background tints (`bg-primary/5` or `bg-amber-50`).

---

## 4. Illustration Guidelines

### Color Palette for Mascot Assets
- **Fur Primary**: Warm Quartz White / Soft Amber Orange (`#F59E0B`).
- **Accent Collar**: Electric Purple (`#A855F7`).
- **Glow & Eyes**: Emerald Green (`#10B981`) or Magenta (`#EC4899`).

### SVG Vector Graphic Rules
- Clean 2px stroke lines with rounded caps (`stroke-linejoin="round" stroke-linecap="round"`).
- Scalable inline SVG format to maintain crisp vector rendering on High-DPI Retina screens.
