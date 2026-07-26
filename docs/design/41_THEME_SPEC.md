# 41_THEME_SPEC.md — Vision & Philosophy

## Executive Summary
AlgoVerse is designed to transform abstract data structures and complex algorithms into intuitive, visually mesmerizing, and deeply interactive educational experiences. The design philosophy balances professional software aesthetics with delightful human micro-interactions, combining a sleek glassmorphic light-theme default with high-contrast accessibility.

---

## 1. Core Vision & Pillars

### Pillar 1: Clarity Over Complexity
Algorithms are complex by nature. The interface must never add cognitive noise. Every canvas, pointer, highlight, and metric should provide immediate visual clarity.
- **High-contrast focal points**: Active elements use vivid gradients (Purple `#A855F7` to Pink `#EC4899`).
- **Clean white canvas backdrop**: Reduces eye fatigue during long study sessions.
- **De-cluttered layout hierarchy**: Strict separation of Navigation, Controls, Canvas, and Educational Notes.

### Pillar 2: Delightful Interactivity
Educational tools should feel responsive, playful, and alive.
- **Micro-interactions**: Subtle hover state scale effects (`scale-105`), click feedback pulses, and smooth spring physics via Framer Motion.
- **Mascot Companionship**: Playful algorithm cats (`AlgoCat`) guide students through tricky concepts, celebrate milestone wins, and offer subtle interview tips without intruding on the workspace.

### Pillar 3: Production-Grade Engineering
AlgoVerse is built for computer science students, software engineering applicants, and educators.
- **Zero Mocking**: All visualizers reflect true memory structures and exact mathematical state.
- **Empirical Metrics**: Benchmarks compute real execution durations in microseconds (`performance.now()`), accurate comparisons, and actual memory allocations.

---

## 2. Visual Identity & Brand Personality

| Attribute | Expression |
| :--- | :--- |
| **Tone** | Empowering, Precise, Playful, Modern |
| **Color Palette** | Soft Quartz Gray background, Crisp White containers, Violet & Magenta accents |
| **Typography** | Poppins (Headings/Display), Inter (Body UI), JetBrains Mono (Pseudocode & Data) |
| **Shape Language** | Rounded 3XL corners (`rounded-3xl`), soft pill badges (`rounded-full`), smooth borders (`border-gray-100`) |
| **Shadows & Depth** | Layered elevation with ultra-soft ambient drop shadows (`shadow-xs`, `shadow-md shadow-primary/20`) |

---

## 3. Theme Philosophy: Light Default & Adaptive Dark Mode

AlgoVerse defaults to a premium **Quartz Light Mode** designed for daytime productivity and classroom presentations, while supporting an optional **Obsidian Dark Mode** for night coding sessions.

```
Quartz Light Mode (Default)
├── Base Background: #F9FAFB (Gray-50)
├── Container Surfaces: #FFFFFF (White)
├── Primary Accent: #A855F7 (Purple-500)
├── Secondary Accent: #7C3AED (Violet-600)
└── Decorative Glow: #EC4899 (Pink-500)

Obsidian Dark Mode
├── Base Background: #090D16 (Deep Slate)
├── Container Surfaces: #111827 (Gray-900)
├── Primary Accent: #C084FC (Purple-400)
├── Secondary Accent: #A78BFA (Violet-400)
└── Decorative Glow: #F472B6 (Pink-400)
```

---

## 4. Accessibility & Contrast Compliance

- **WCAG AA Compliance**: Text contrast ratio >= 4.5:1 for standard text and 3:1 for large display elements.
- **Color-Blind Friendly Indicators**: Active search pointers combine colors with distinct letter labels (`L` for Low, `M` for Mid, `H` for High) so visual distinction does not rely solely on color perception.
- **Keyboard Navigation Focus**: Visible focus rings (`ring-2 ring-primary`) on all interactive controls.
