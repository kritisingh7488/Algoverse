# AlgoVerse — UI Acceptance Criteria

> Purpose
>
> This document defines the quality standards that every frontend page, component, laboratory, and visualization must satisfy before it can be considered complete.
>
> A feature is **not complete because it exists.**
>
> A feature is complete only when every requirement in this document has been verified.
>
> Every AI coding agent must validate its work against this checklist before marking any task as finished.

---

# Completion Philosophy

Pages are **never** considered complete simply because

- the page renders
- the build succeeds
- no TypeScript or ESLint errors exist
- buttons are visible
- the route loads

A page is complete only when it provides a polished, interactive, educational, and production-ready experience.

---

# Global Acceptance Criteria

Every page must satisfy all of the following.

---

## Visual Design

✓ Uses the approved design system.

✓ Uses approved typography.

✓ Uses approved colour palette.

✓ Uses approved spacing.

✓ Uses approved shadows.

✓ Uses approved border radius.

✓ Uses approved gradients.

✓ Uses approved icons.

✓ Uses approved mascot placement.

✓ Matches the overall AlgoVerse theme.

---

## Theme Support

Every page must fully support

✓ Light Theme

✓ Dark Theme

✓ Theme persistence

✓ Theme transitions

✓ Theme-aware illustrations

✓ Theme-aware charts

✓ Theme-aware code blocks

✓ Theme-aware visualizations

---

## Responsiveness

Must function correctly on

✓ Desktop

✓ Laptop

✓ Tablet

✓ Mobile

No clipping.

No overflow.

No horizontal scrolling.

No hidden controls.

---

## Accessibility

Supports

✓ Keyboard navigation

✓ Screen readers

✓ Visible focus

✓ Reduced motion

✓ Proper contrast

✓ Semantic HTML

✓ ARIA labels

---

## Performance

Every page should

Load smoothly.

Maintain 60 FPS.

Avoid layout shifts.

Avoid unnecessary rerenders.

Lazy-load heavy components.

Optimise images.

Optimise SVG assets.

---

## Navigation

Every navigation element must

Navigate correctly.

Highlight current page.

Support keyboard navigation.

Remain responsive.

Never become inaccessible.

---

# Components

Every visible component must

Render correctly.

Respond to interaction.

Support light and dark themes.

Support hover.

Support focus.

Support disabled state.

Support loading state where appropriate.

Support error state where appropriate.

---

# Forms

Every form must

Validate input.

Display useful errors.

Prevent invalid submission.

Support keyboard input.

Provide loading feedback.

Never lose user data unexpectedly.

---

# Laboratory Requirements

A laboratory is considered complete only if users can

✓ Create custom input.

✓ Edit custom input.

✓ Delete input.

✓ Reset input.

✓ Generate random input.

✓ Load sample input.

✓ Replay animation.

✓ Pause animation.

✓ Resume animation.

✓ Step forward.

✓ Step backward.

✓ Change animation speed.

✓ Restart execution.

✓ Execute multiple algorithms.

---

# Visualization Requirements

Every visualization must

Use real algorithm execution.

Never use prerecorded animations.

Never use hardcoded sequences.

Always reflect current algorithm state.

Always react to user input.

Synchronize with explanations.

Synchronize with code highlighting.

Synchronize with statistics.

Remain responsive.

Support theme switching.

---

# Algorithm Requirements

Every algorithm listed in the UI must

Actually execute.

Produce correct output.

Handle edge cases.

Handle invalid input.

Handle empty input.

Support replay.

Support stepping.

Support educational explanations.

Support complexity analysis.

---

# Statistics

Every displayed statistic must be generated from real execution.

Examples

Comparisons

Swaps

Execution Time

Memory Usage

Visited Nodes

Queue Size

Recursion Depth

Tree Height

DP States

No statistic may be hardcoded.

---

# Benchmark Center

Complete only if

✓ Executes real algorithms.

✓ Uses identical datasets.

✓ Measures actual execution time.

✓ Measures comparisons.

✓ Measures swaps.

✓ Measures memory usage.

✓ Displays reproducible results.

✓ Allows dataset configuration.

---

# Code Playground

Complete only if

✓ Code compiles.

✓ Code executes.

✓ Custom input works.

✓ stdout works.

✓ stderr works.

✓ Compile errors display.

✓ Runtime errors display.

✓ Execution time displays.

✓ Memory usage displays.

✓ Multiple languages supported.

Never display fake output.

---

# Canvas

Visualization canvas must

Resize automatically.

Remain centred.

Never clip controls.

Never hide buttons.

Support zoom if necessary.

Support panning if necessary.

---

# Layout

No page should contain

Hidden buttons.

Controls outside containers.

Overlapping components.

Broken alignment.

Unusable whitespace.

Crowded interfaces.

---

# Mascot System

Mascots must

Appear in approved locations.

Support theme switching.

Animate subtly.

Never block controls.

Never cover content.

Never distract users.

---

# Motion

Animations must

Remain smooth.

Match the motion system.

Never delay interaction.

Never reduce usability.

---

# Empty States

Every empty state must include

Illustration.

Friendly explanation.

Suggested action.

Mascot.

---

# Loading States

Every loading state must include

Skeleton loader.

Progress indicator.

Helpful feedback.

Never only a spinner.

---

# Error States

Every error must

Explain the problem.

Suggest a solution.

Allow retry.

Remain friendly.

Avoid technical jargon where possible.

---

# AI Self Audit

Before marking a feature complete, verify

□ Every visible button works.

□ Every dropdown option works.

□ Every slider works.

□ Every algorithm works.

□ Every route works.

□ Every visualization works.

□ Every chart works.

□ Every animation works.

□ Every explanation updates correctly.

□ Every statistic is real.

□ Every form validates correctly.

□ Every API call succeeds.

□ Every backend endpoint functions.

□ Every page supports light mode.

□ Every page supports dark mode.

□ Every component follows the design system.

---

# Manual User Review

A feature is **NOT COMPLETE** until

1. Local preview is started.

2. The user tests the feature.

3. User feedback is collected.

4. Requested revisions are implemented.

5. User explicitly approves.

Only after approval may

- documentation be updated
- progress be recorded
- Git commit be created
- implementation continue

---

# Final Principle

AlgoVerse should never be considered finished because it "looks complete."

It is complete only when every interaction, visualization, animation, algorithm, and educational feature behaves exactly as intended and has been approved by the user.

---

# User Approval Gate

No implementation phase may be marked as complete until

- the local development server is running,
- the user has reviewed the implementation,
- all requested revisions have been completed,
- the user explicitly replies with **"Approved"**.

AI agents must never assume approval.

If approval is not received,

implementation remains in review.

Git commits should only be created after approval unless the user explicitly requests otherwise.