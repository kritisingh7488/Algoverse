# 47_ASSET_GUIDE.md — Asset & Illustration Guidelines

## 1. Iconography Standards

AlgoVerse standardizes on **Lucide React Icons** (`lucide-react`) for all UI control elements, sidebar navigation, visualizer state badges, and educational card headers.

### Core Icon Assignment Table

| Function | Lucide Icon Component | Visual Representation |
| :--- | :--- | :--- |
| **Data Structures** | `<Layers />` | Layered stack/array icon |
| **Sorting Lab** | `<BarChart2 />` | Vertical bar chart icon |
| **Searching Lab** | `<Search />` | Magnifying glass icon |
| **Tree Lab** | `<GitFork />` | Branching tree node icon |
| **Graph Lab** | `<Network />` | Connected node network icon |
| **DP Studio** | `<Cpu />` | Processor chip icon |
| **String Lab** | `<Code />` | Code bracket icon |
| **Backtracking** | `<RotateCcw />` | Backtrack step arrow |
| **Benchmark Center** | `<BarChart3 />` | Multi-bar metrics chart |
| **Code Playground** | `<Terminal />` | Command line execution terminal |
| **Play / Pause** | `<Play />` / `<Pause />` | Playback media controls |
| **Step Prev / Next** | `<ChevronLeft />` / `<ChevronRight />` | Stepper arrows |
| **Randomize** | `<Shuffle />` | Random dataset generator |
| **Clear All** | `<Trash2 />` | Red trash icon |
| **Intuition Note** | `<Lightbulb />` | Yellow lightbulb icon |
| **Common Mistake** | `<AlertTriangle />` | Red warning triangle icon |
| **Interview Tip** | `<Sparkles />` | Emerald sparkle star icon |

---

## 2. Graphic Asset Management

### Folder & Path Structure
All custom images and generated visual assets are stored according to asset class:

```
frontend/public/assets/
├── branding/
│   ├── logo.svg              # Main AlgoVerse logo (Light)
│   ├── logo-dark.svg         # Main AlgoVerse logo (Dark)
│   └── favicon.ico           # Browser tab icon
├── mascot/
│   ├── algocat-idle.svg      # Search / Default state
│   ├── algocat-think.svg     # Comparing / Calculation state
│   ├── algocat-win.svg       # Success / Target found state
│   └── algocat-alert.svg     # Stack overflow / warning state
└── background/
    ├── grid-pattern.svg      # Subtle background grid pattern
    └── glow-gradient.svg     # Glassmorphic ambient backdrop
```

---

## 3. Asset Optimization Rules

1. **SVG First**: All icons and mascot illustrations must be vector-based inline SVGs to ensure crisp rendering at all screen resolutions (1x, 2x Retina, 4K).
2. **File Size Limit**:
   - Inline SVGs: `< 15 KB` per graphic.
   - Raster Images / Screenshots: compressed WebP/PNG `< 150 KB`.
3. **No Dynamic Remote Assets**: All static image assets are bundled locally in `frontend/public/` to allow complete offline functionality without external CDN dependencies.
