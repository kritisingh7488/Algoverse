# AlgoVerse — Frontend Review & Development Process

> Purpose
>
> This document defines the mandatory development workflow for every frontend implementation.
>
> Every feature must follow this process.
>
> AI coding agents must never skip or reorder these steps unless explicitly instructed by the user.
>
> The objective is to ensure that every feature is implemented correctly, reviewed thoroughly, and approved before development continues.

---

# Development Philosophy

Development should be

Small

Incremental

Verifiable

Reviewable

Maintainable

Never attempt to complete large portions of the application without intermediate user reviews.

---

# Core Principle

Every implementation follows

Read

↓

Analyse

↓

Plan

↓

Implement

↓

Self Audit

↓

Preview

↓

User Review

↓

Revise

↓

Approve

↓

Commit

↓

Continue

---

# Step 1 — Documentation Review

Before modifying any frontend code

Read

00_PROJECT_STATE.md

41_THEME_SPEC.md

42_DESIGN_SYSTEM.md

43_MASCOT_SYSTEM.md

44_MOTION_SYSTEM.md

45_PAGE_LAYOUT_GUIDE.md

46_COMPONENT_LIBRARY.md

47_VISUALIZATION_GUIDELINES.md

48_THEME_SWITCHING.md

49_DESIGN_TOKENS.md

50_UI_ACCEPTANCE_CRITERIA.md

51_ASSET_AND_ILLUSTRATION_GUIDE.md

52_FRONTEND_IMPLEMENTATION_RULES.md

progress/IMPLEMENTATION_PROGRESS.md

progress/SESSION_HANDOFF.md

Never skip documentation review.

---

# Step 2 — Repository Audit

Analyse

Existing Components

Layouts

Hooks

Stores

Utilities

Animations

Assets

Before writing new code

Search for reusable implementations.

Never duplicate functionality.

---

# Step 3 — Implementation Plan

Before writing code

Determine

Feature

Dependencies

Affected Components

Affected Pages

Potential Refactoring

Potential Risks

Expected Review Items

Implementation should always be planned before coding.

---

# Step 4 — Implementation

Implement

One feature

One module

One improvement

Avoid mixing unrelated work into the same implementation cycle.

---

# Step 5 — Internal Verification

Verify

Lint

Production Build

No TypeScript errors

No ESLint errors

No Console errors

No Broken Imports

No Runtime errors

Every visible control works

Every algorithm still functions

---

# Step 6 — UI Verification

Review

Spacing

Colours

Typography

Responsiveness

Animations

Theme Support

Accessibility

Mascot Placement

Component Consistency

Canvas Layout

Overflow

Nothing should be clipped.

Nothing should overlap.

---

# Step 7 — Feature Verification

Verify every interaction.

Examples

Buttons

Dropdowns

Sliders

Forms

Search

Playback Controls

Visualization Controls

Theme Switching

Benchmark Execution

Compiler Execution

Everything visible must function.

---

# Step 8 — Local Preview

Start

npm run dev

Provide

Preview URL

Feature Summary

Affected Files

Known Limitations

Wait.

Never continue automatically.

---

# Step 9 — User Review

The user will

Explore

Test

Break

Review

Provide Feedback

Collect every issue.

Do not defend the implementation.

Do not justify bugs.

Simply record requested changes.

---

# Step 10 — Revision

Apply

Every requested change.

Repeat

Preview

↓

Review

↓

Revision

Until approved.

---

# Step 11 — User Approval

Implementation is approved only if the user explicitly replies with

Approved

Looks good

Proceed

Continue

Any equivalent explicit approval.

Silence is not approval.

No response is not approval.

Positive assumptions are not approval.

---

# Step 12 — Documentation

After approval

Update

PROJECT_STATE

IMPLEMENTATION_PROGRESS

SESSION_HANDOFF

Any affected documentation

Documentation must accurately reflect implementation.

Never claim features are complete when they are not.

---

# Step 13 — Git Commit

Only after approval

Commit

Meaningful Commit Message

Example

feat: implement fully interactive AVL visualization

fix: correct Merge Sort event generation

refactor: migrate dashboard to design token system

Avoid vague commit messages.

---

# Step 14 — Next Feature

Only after

Approval

Commit

Documentation

Begin the next planned feature.

Never begin another feature while the current one remains under review.

---

# Mandatory Self Audit

Before requesting review verify

□ Feature complete

□ No placeholder UI

□ No mocked behaviour

□ No fake statistics

□ No hardcoded output

□ No duplicated components

□ No duplicated styles

□ Theme support

□ Responsive

□ Accessible

□ Build passes

□ Lint passes

□ Preview available

□ Documentation updated

---

# Review Checklist

Every review request must include

Current Feature

Files Modified

Summary

Preview URL

How To Test

Known Issues

Awaiting User Review

Nothing else.

---

# Prohibited Behaviour

Never

Claim "100% Complete" without review.

Skip preview.

Skip lint.

Skip build.

Continue after requesting review.

Commit before approval.

Ignore user feedback.

Mark placeholder implementations as complete.

---

# Continuous Improvement

Small refactors are encouraged.

If existing code violates

Design System

Component Library

Motion System

Design Tokens

Implementation Rules

Refactor safely.

Never preserve poor architecture merely to avoid change.

---

# Emergency Exception

If implementation is blocked by

Cloud Credentials

External APIs

MongoDB Atlas

OAuth

Cloudinary

Deployment

Environment Variables

Stop implementation.

Explain

Why it is blocked.

Exactly what the user must do.

Resume automatically after the requirement is satisfied.

---

# AI Rules

Every AI coding agent must

Work incrementally.

Request review frequently.

Never skip quality checks.

Never overestimate completion.

Always prefer correctness over speed.

---

# Final Principle

The goal is not to finish the project quickly.

The goal is to build a beautiful, maintainable, production-quality educational platform through continuous implementation, verification, review, and refinement.