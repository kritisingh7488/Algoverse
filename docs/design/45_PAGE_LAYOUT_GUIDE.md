# 45_PAGE_LAYOUT_GUIDE.md — Page Layout & Architecture Guide

## 1. Global Shell Structure (`AppLayout.jsx`)

Every page in AlgoVerse is wrapped in `AppLayout.jsx`, establishing a consistent header, navigation sidebar, main content viewport, and footer.

```
+-------------------------------------------------------------------------------+
| TOP NAVBAR: Logo | Global Search | Topic Links | XP Badge | Profile Avatar    |
+-------------------------------------------------------------------------------+
|               |                                                               |
| LEFT SIDEBAR  |                      MAIN CONTENT AREA                        |
| (Collapsible) |                   (Max-Width: 1440px Centered)                |
|               |                                                               |
| - Home        |  [Page Header Title & Quick Action Bar]                       |
| - Playground  |                                                               |
| - Labs        |  [Grid Content Layout (12 Columns)]                           |
| - Benchmarks  |                                                               |
| - Quizzes     |                                                               |
| - Roadmap     |                                                               |
| - Community   |                                                               |
| - Profile     |                                                               |
|               |                                                               |
+-------------------------------------------------------------------------------+
| FOOTER: Quick Links | Version Info | Status Indicator                         |
+-------------------------------------------------------------------------------+
```

---

## 2. Page Specific Layout Standards

### A. Dashboard / Home Landing (`Home.jsx` & `Dashboard.jsx`)
- **Hero Banner**: Full-width gradient card with call-to-action button, daily XP progress, and active streak counter.
- **Laboratory Feature Grid**: 3-column responsive card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) highlighting core labs (Sorting, Searching, Trees, Graphs, DP).
- **Recent Activity & Recommended Roadmap Step**: Split 2-column view (`lg:grid-cols-12`: 8 cols for recent labs, 4 cols for roadmap widget).

### B. Interactive Laboratories (`Playground.jsx`, `SortingLab.jsx`, `SearchingLab.jsx`, `TreeLab.jsx`, `GraphLab.jsx`, `DPStudio.jsx`)
All laboratory pages strictly enforce the 3-Column Split Architecture:
- **Left Column (`col-span-3`)**: Algorithm Selector list & Custom Dataset Input forms (CSV text boxes, randomizers, preset buttons).
- **Center Column (`col-span-6`)**: SVG / Canvas Visualizer Window (fixed height `340px`–`360px`) + Playback Controls Toolbar (`Play`, `Pause`, `Step Prev`, `Step Next`, `Speed 0.5x–2x`).
- **Right Column (`col-span-3`)**: Pseudocode Box with active line highlighter + Conceptual Intuition & Interview Tips card.

### C. Benchmark Center (`BenchmarkCenter.jsx`)
- **Left Controls (`col-span-4`)**: Category dropdown, multi-select algorithm checkboxes, dataset size slider (50–1000), distribution type selector.
- **Right Results (`col-span-8`)**: Live progress bar, Winner Highlight Badge, Execution Runtime Bar Chart, and Detailed Performance Table (`Runtime ms`, `Comparisons`, `Swaps`, `Memory KB`).

### D. Code Playground (`CodePlayground.jsx`)
- **Header**: Language Selector (C++, Java, Python, JavaScript), Run Code CTA button.
- **Left Column (`col-span-7`)**: Code Editor window with line numbers, template reset button, and STDIN input box.
- **Right Column (`col-span-5`)**: Dark Execution Console displaying live `STDOUT`, `STDERR` / compiler errors, and execution runtime duration.

### E. Learning Roadmap (`Roadmap.jsx`)
- **Vertical Milestone Path**: Connected node timeline tracking user progression through Data Structures, Searching, Sorting, Trees, Graphs, and DP.
- **Topic Cards**: Displays milestone title, difficulty badge, estimated duration, and completion status button.

### F. User Profile & Settings (`Profile.jsx` & `Settings.jsx`)
- **Profile Header**: Avatar, username, level badge, XP progress bar.
- **Stats Grid**: Total algorithms solved, quiz scores, benchmark runs, unlocked achievement badges.
- **Settings Form**: Account info, theme mode toggle, notification preferences, security settings.
