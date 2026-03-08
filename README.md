# Sorting Algorithm Visualizer

A production-ready, portfolio-grade web application for visualizing sorting algorithms with a premium modern UI, smooth animations, and comprehensive educational features.

## Features

- **Six Sorting Algorithms**: Bubble, Insertion, Selection, Quick, Merge, and Heap Sort
- **Step-by-Step Visualization**: Animated bars with distinct states (compare, swap, pivot, sorted)
- **Comparison Mode**: Run multiple algorithms on the same array and compare performance
- **Live Stats Dashboard**: Comparisons, swaps, writes, elapsed time, recursion depth
- **Complexity Overview**: Best/average/worst case, space complexity, stability, pros & cons
- **Performance Charts**: Recharts-based visualization of actual runtime metrics
- **Educational Mode**: Pseudo-code panel, step explanations, algorithm descriptions
- **Array Presets**: Random, nearly sorted, reversed, duplicate-heavy
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Semantic HTML, ARIA labels, reduced motion support, keyboard navigation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Hero**: CSS-animated floating bars (algorithm-inspired)
- **UI Components**: Radix UI primitives (shadcn-style)
- **Charts**: Recharts
- **State**: Zustand
- **Icons**: Lucide React

## Architecture

### Folder Structure

```
app/
  layout.tsx
  page.tsx
  globals.css

components/
  layout/       # Navbar, Footer
  shared/       # Hero, HeroScene3D
  ui/           # Button, Card, Select, Slider, etc.

features/
  algorithms/
    data/           # (metadata)
    engine/         # Sort engine types & utils
    implementations/ # Bubble, Insertion, Selection, Quick, Merge, Heap
    metadata/       # Complexity, descriptions, pseudo-code
    types/          # Operation types, AlgorithmId

  visualizer/
    components/  # AlgorithmSelector, ArrayControls, SortingBars, ControlDock
    hooks/       # useSortRunner
    store/       # Zustand store
    utils/       # Array generators

  comparison/
    components/  # ComparisonGrid

  stats/
    components/  # StatsCard, LiveStatsDashboard, PerformanceChart

  education/
    components/  # PseudocodePanel, EducationalGuide, FAQ

lib/
  utils.ts
```

### Visualization Engine

Algorithms emit an **operation stream** that the UI consumes for animation:

- `compare(i, j)` - Highlight two elements being compared
- `swap(i, j)` - Swap values and animate
- `overwrite(index, value)` - Write a value (e.g., merge sort)
- `setPivot(index)` - Mark pivot element
- `markSorted(index)` - Mark element as sorted
- `setRange(start, end)` - Active partition (quick/merge)
- `setHeapBoundary(index)` - Heap sort boundary
- `setActive(indices)` - Highlight active elements
- `clearActive` - Clear highlights
- `complete` - Sort finished

Metrics (comparisons, swaps, writes, recursion depth, duration) are tracked independently.

### State Management (Zustand)

- Selected algorithm, array, bar states
- Visualization status (idle, running, paused, complete)
- Speed, array size, preset
- Metrics, current step, teach mode
- Theme, reduced motion

## Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development
npm run dev

# Build
npm run build

# Production
npm run start
```

## Scripts

| Script   | Description                    |
| -------- | ------------------------------ |
| `dev`    | Start development server      |
| `build`  | Create production build        |
| `start`  | Run production server          |
| `lint`   | Run ESLint                     |
| `format` | Format with Prettier           |

## Deployment

The app is static-friendly. Deploy to Vercel, Netlify, or any static host:

```bash
npm run build
# Output in .next/ - use `next start` for Node.js or export static if configured
```

## Algorithm Complexity Reference

| Algorithm   | Best      | Average   | Worst     | Space | Stable | In-Place |
| ----------- | --------- | --------- | --------- | ----- | ------ | -------- |
| Bubble      | O(n)      | O(n²)     | O(n²)     | O(1)  | Yes    | Yes      |
| Insertion   | O(n)      | O(n²)     | O(n²)     | O(1)  | Yes    | Yes      |
| Selection   | O(n²)     | O(n²)     | O(n²)     | O(1)  | No     | Yes      |
| Quick       | O(n log n)| O(n log n)| O(n²)     | O(log n) | No  | Yes      |
| Merge       | O(n log n)| O(n log n)| O(n log n)| O(n)  | Yes    | No       |
| Heap        | O(n log n)| O(n log n)| O(n log n)| O(1)  | No     | Yes      |

*Note: Measured execution time is affected by browser runtime and animation overhead.*

## Future Improvements

- Custom array input (paste values)
- Sound effects toggle
- Export stats as JSON
- Full-screen comparison mode
- Benchmark mode (run N times, average)
- Additional algorithms (Shell, Counting, Radix)
- Colorblind-friendly palette option
