# 42_DESIGN_SYSTEM.md — Design Tokens & Core System

## 1. Color System & Tokens

### Primary Palette (Purple / Violet)
The primary brand colors represent wisdom, structure, and algorithmic elegance.

| Token Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| `color-primary-50` | `#F5F3FF` | `bg-primary/5` | Soft background tints, active sidebar buttons |
| `color-primary-100` | `#EDE9FE` | `bg-primary/10` | Badges, icon container backgrounds |
| `color-primary-500` | `#A855F7` | `bg-primary`, `text-primary` | Main CTA buttons, active state highlights |
| `color-primary-600` | `#7C3AED` | `bg-secondary` | Primary hover states, gradient accents |
| `color-primary-700` | `#6D28D9` | `text-primary-dark` | High-contrast text on light tints |

### Accent Palette (Pink / Rose)
Used for special highlights, active pointers, swap animations, and success notifications.

| Token Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| `color-accent-400` | `#FF7AC6` | `text-accent` | Vibrant text highlights |
| `color-accent-500` | `#EC4899` | `bg-accent` | Active element glows, swap animation states |
| `color-accent-100` | `#FCE7F3` | `bg-pink-50` | TOP pointer badges, toast notification background |

### Status Palette

| Status | Color Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | Emerald | `#10B981` | `text-emerald-600`, `bg-emerald-500` | Sorted bars, target found, tests passed |
| **Warning** | Amber | `#F59E0B` | `text-amber-500`, `bg-amber-400` | Current pointer/mid element, queue tail |
| **Danger** | Rose/Red | `#EF4444` | `text-red-600`, `bg-red-500` | Node deletion, stack overflow alert |
| **Info** | Blue | `#3B82F6` | `text-blue-600`, `bg-blue-50` | Comparing elements, visited graph nodes |

---

## 2. Typography System

AlgoVerse uses a strict 3-font hierarchy to cleanly demarcate display text, UI controls, and code logic.

```
Headings & Display  ──>  Poppins (Google Font)
UI Body & Inputs    ──>  Inter (Google Font)
Code & Monospace    ──>  JetBrains Mono / Monospace
```

### Font Scale & Hierarchy

| Usage Level | Font Family | Size | Weight | Line Height | Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Poppins | `2rem` (32px) | Bold (700) | `1.2` | `text-3xl font-bold font-poppins` |
| **Page Header** | Poppins | `1.5rem` (24px) | Bold (700) | `1.3` | `text-2xl font-bold font-poppins` |
| **Section Header** | Poppins | `1.125rem` (18px) | SemiBold (600) | `1.4` | `text-lg font-semibold font-poppins` |
| **Subheader / Badge** | Poppins | `0.75rem` (12px) | Bold (700) | `1.5` | `text-xs font-bold font-poppins uppercase` |
| **Body Regular** | Inter | `0.875rem` (14px) | Normal (400) | `1.5` | `text-sm font-inter` |
| **Body Small** | Inter | `0.75rem` (12px) | Normal (400) | `1.4` | `text-xs font-inter` |
| **Code / Pseudocode** | JetBrains Mono | `0.75rem` (12px) | Medium (500) | `1.6` | `font-mono text-xs` |
| **Array Value** | JetBrains Mono | `0.875rem` (14px) | Bold (700) | `1.0` | `font-mono text-sm font-bold` |

---

## 3. Spacing & Container Geometry

AlgoVerse utilizes a rounded, pill-inspired card geometry for a modern, approachable feel.

### Radius Scale
- `rounded-xl`: Inputs, small buttons, status tags (`12px`).
- `rounded-2xl`: Control panels, medium cards, structure node boxes (`16px`).
- `rounded-3xl`: Main laboratory containers, dashboard cards (`24px`).
- `rounded-full`: Circular badges, mascot tags, round node circles (`9999px`).

### Border & Elevation Tokens
- **Borders**: `border border-gray-100` (Light mode subtle divider).
- **Subtle Elevation**: `shadow-xs` (`0 1px 2px 0 rgba(0, 0, 0, 0.05)`).
- **Interactive Elevation**: `shadow-md shadow-primary/20` (Glowing primary CTA elevation).
- **Active Node Glow**: `shadow-lg shadow-accent/30 scale-110 ring-4 ring-accent/20`.

---

## 4. Layout Grid System

All laboratories follow a standard **12-Column Responsive Layout Grid**:

```
+---------------------------------------------------------------------------------+
|                                 PAGE HEADER BAR                                 |
+---------------------------------------------------------------------------------+
|  LEFT SIDEBAR   |               CENTER CANVAS               |   RIGHT SIDEBAR   |
|   (col-span-3)  |               (col-span-6)                |    (col-span-3)   |
|                 |                                           |                   |
| Algorithm List  |  +-------------------------------------+  |  Pseudocode Box   |
| Category Switch |  |     VISUALIZATION CANVAS AREA       |  |  (Line Highlighter)|
| Custom Inputs   |  +-------------------------------------+  |                   |
| Dataset Sliders |  |     PLAYBACK CONTROL TOOLBAR        |  |  Educational Notes|
|                 |  +-------------------------------------+  |  (Intuition/Tips) |
+---------------------------------------------------------------------------------+
```
