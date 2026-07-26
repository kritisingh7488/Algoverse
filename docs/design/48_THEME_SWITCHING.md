# AlgoVerse — Theme Switching System

> Purpose
>
> This document defines how AlgoVerse implements Light Mode and Dark Mode.
>
> Theme switching is a first-class feature of the platform.
>
> It should never simply invert colours.
>
> Every AI coding agent must follow this document when implementing themes, components, illustrations, charts, code blocks, visualizations, and animations.

---

# Theme Philosophy

AlgoVerse supports two carefully designed themes.

Both themes should feel

Premium

Cute

Comfortable

Educational

Consistent

The user should enjoy both themes equally.

Dark mode is NOT merely a dark version of light mode.

It has its own identity.

---

# Theme Identity

## Light Theme

Feeling

Morning

Fresh

Warm

Comfortable

Notebook

Study Desk

Soft

Optimistic

Color Palette

Cream

Pastel Beige

Coral

Soft Pink

Peach

Dusty Plum

Blue Cat

Black Cat

---

## Dark Theme

Feeling

Evening

Relaxing

Cozy

Calm

Library

Reading Lamp

Warm Glow

Focused

Color Palette

Deep Plum

Dark Lavender

Warm Brown

Muted Rose

Soft Orange

Warm Peach

Orange Cat

White Cat

---

# Theme Transition

Theme switching should

Animate smoothly.

Never flash white.

Never reload the page.

Never rebuild components.

Crossfade colours.

Crossfade gradients.

Swap mascot illustrations.

Update code editor theme.

Update chart colours.

Update syntax highlighting.

Update shadows.

Maintain current page state.

---

# Theme Toggle

Location

Sidebar Footer

Settings Page

Optional Quick Toggle in Navbar

Behaviour

Animated

Accessible

Keyboard Operable

Persists between sessions.

---

# Local Storage

Theme preference must be stored.

Priority

User Preference

↓

System Preference

↓

Default Light Theme

Theme must be restored on application startup.

---

# Backgrounds

## Light

Warm cream

Subtle gradients

Soft decorative blobs

Tiny paper texture (optional)

---

## Dark

Deep plum

Soft glow

Very subtle gradients

No pure black backgrounds

---

# Cards

Light

Pastel coral

Soft beige

Warm shadows

Dark

Dark plum

Warm highlights

Soft glow

Cards must never become flat.

---

# Buttons

Buttons change

Background

Hover

Shadow

Glow

Ripple

Icons

Automatically.

---

# Inputs

Theme aware

Placeholder

Border

Glow

Selection

Cursor

Focus Ring

Must adapt correctly.

---

# Typography

Text colour adapts.

Contrast always meets accessibility requirements.

---

# Charts

Every chart automatically updates

Palette

Axis

Labels

Grid

Tooltips

Legends

Animations remain unchanged.

---

# Code Blocks

Light

GitHub-like theme

Dark

One Dark Pro style

Never use low-contrast syntax themes.

---

# Monaco Editor

Theme switches automatically.

Supported

Light

Dark

Future custom AlgoVerse themes.

---

# Algorithm Visualizations

Theme switching updates

Bars

Nodes

Pointers

Graphs

Edges

Highlights

Current Node

Visited Node

Current Step

Complexity Panel

No algorithm state should reset.

---

# Playground

Canvas colours adapt.

Grid adapts.

Controls remain readable.

Selection highlights update.

---

# Benchmark Center

Charts

Cards

Statistics

Heatmaps

Tables

Automatically switch themes.

---

# Dashboard

Mascot changes.

Background changes.

Cards change.

Achievements update colours.

Progress bars update gradients.

---

# Community

Avatars remain unchanged.

Cards adapt.

Comments adapt.

Code snippets adapt.

---

# Notifications

Theme aware.

Same placement.

Same animations.

Different colours.

---

# Sidebar

Theme updates

Background

Icons

Active Item

Hover

Borders

Dividers

Shadow

---

# Decorative Elements

Light Theme

Flowers

Books

Paper

Plants

Paw Prints

Clouds

Stars

Dark Theme

Lantern Glow

Moon

Stars

Coffee

Books

Sparkles

Constellations

Warm lighting

---

# Mascot Switching

Light

Blue Cat

↓

Orange Cat

Black Cat

↓

White Cat

Do not simply recolour.

Use dedicated illustrations.

Crossfade during theme change.

---

# Accessibility

Theme switching must

Respect reduced motion.

Maintain contrast.

Remain keyboard accessible.

Announce changes to screen readers.

---

# Performance

Theme switching should complete in under

300ms

Avoid unnecessary rerenders.

Reuse CSS variables.

Prefer CSS custom properties over manual component updates.

---

# Future Expansion

Support additional themes.

Examples

Spring

Autumn

Winter

Festival

Exam Mode

Accessibility High Contrast

These themes must follow the same architecture.

---

# AI Rules

Never use pure black.

Never use pure white.

Never invert colours blindly.

Never reset user state.

Never recreate layouts.

Always preserve component consistency.

Every new component must support

Light Theme

Dark Theme

Accessibility

Theme persistence

---

# Definition of Complete

Theme Switching is complete only if

✓ Theme preference persists.

✓ Every page updates correctly.

✓ Every component supports both themes.

✓ Every chart updates.

✓ Every visualization updates.

✓ Monaco editor updates.

✓ Code blocks update.

✓ Mascots switch correctly.

✓ No flashes occur.

✓ Animations remain smooth.

✓ Algorithm execution continues uninterrupted.

---

# Final Principle

Light Mode should feel like studying in a cozy morning café.

Dark Mode should feel like studying late at night under a warm reading lamp.

Both should feel unmistakably like AlgoVerse.