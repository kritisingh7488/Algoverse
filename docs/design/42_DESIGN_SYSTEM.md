# AlgoVerse — Design System

> Purpose
>
> This document defines the complete visual design system of AlgoVerse.
>
> Every frontend component must follow these rules.
>
> No page may introduce its own styling that conflicts with this document.
>
> Consistency is more important than creativity.
>
> Every AI coding agent must read this file before modifying any frontend component.

---

# Design Principles

Every component should be

Simple

Cute

Premium

Comfortable

Readable

Consistent

Animated

Accessible

Responsive

---

# Visual Hierarchy

The interface should naturally guide the user's eyes.

Priority order

1. Primary Action
2. Current Learning Progress
3. Visualization
4. Controls
5. Supporting Information
6. Decorations

Decorations must never compete with important content.

---

# Color System

## Light Theme

### Background

Warm Cream

#FFF8F2

---

### Surface

Pastel Beige

#F8EDE3

---

### Elevated Surface

#FFF3EB

---

### Card

Pastel Coral

#FFE6DD

---

### Primary

Coral Pink

#FF8A80

---

### Primary Hover

#FF7266

---

### Secondary

Soft Plum

#8B5CF6

---

### Secondary Hover

#7C3AED

---

### Accent

Pastel Peach

#FFB38A

---

### Highlight

Pastel Yellow

#FFE89C

---

### Success

#72D98B

---

### Warning

#FFC857

---

### Error

#F87171

---

### Information

#7CC6FE

---

### Border

#EADDD4

---

### Divider

#EFE4DD

---

### Text Primary

#3D3535

---

### Text Secondary

#7A6E6E

---

### Disabled Text

#B8AAAA

---

# Dark Theme

Background

#20162F

Surface

#2B1E3E

Elevated Surface

#352547

Card

#3A2747

Primary

#FF9F68

Primary Hover

#FFA97A

Secondary

#C084FC

Accent

#FFB088

Highlight

#FFD479

Success

#7AE582

Warning

#FFD166

Danger

#FF7A7A

Information

#8ED8FF

Text Primary

#FFF8F5

Text Secondary

#DCCFEA

Border

#4A355F

Divider

#43314F

---

# Gradients

Only soft gradients.

Never use harsh neon gradients.

Allowed

Coral → Peach

Lavender → Plum

Pink → Coral

Cream → Beige

Orange → Peach

Dark Plum → Lavender

Gradient opacity should remain subtle.

---

# Elevation System

Level 0

Flat

Level 1

Soft shadow

Level 2

Card shadow

Level 3

Floating panel

Level 4

Modal

Never use harsh black shadows.

Use soft colored shadows matching the theme.

---

# Border Radius

Cards

28px

Buttons

18px

Inputs

18px

Dialogs

30px

Badges

999px

Tags

999px

Charts

24px

---

# Shadows

Use layered shadows.

Example

Shadow 1

Low opacity

Short distance

Shadow 2

Colored shadow

Very soft

Never use heavy black shadows.

---

# Typography

## Heading Font

Fredoka

Rounded

Friendly

Bold

---

## Body Font

Nunito

Readable

Soft

Modern

---

## Code Font

JetBrains Mono

---

# Typography Scale

Hero

48px

Page Title

36px

Section Title

28px

Card Title

22px

Body

16px

Caption

14px

Tiny Labels

12px

---

# Spacing System

Use an 8-point grid.

Allowed spacing

4

8

12

16

20

24

32

40

48

64

96

Never use arbitrary spacing.

---

# Cards

Every card should have

Rounded corners

Soft shadows

Subtle gradients

Comfortable padding

Hover lift

Smooth transition

Cards should never feel flat.

---

# Buttons

Primary

Filled Coral

Rounded

Soft shadow

Hover lift

Secondary

Soft Plum

Outline

Ghost

Transparent

Text only

Danger

Soft Red

Success

Green

Loading buttons must animate.

Disabled buttons should remain visible.

---

# Inputs

Rounded

Soft borders

Large click area

Focus glow

Placeholder should remain readable.

Never use sharp borders.

---

# Dropdowns

Rounded

Animated opening

Soft shadows

Searchable where appropriate.

---

# Sliders

Rounded track

Cute thumb

Animated fill

---

# Toggle Switch

Rounded pill

Animated transition

Glow when active

---

# Progress Bars

Rounded

Gradient fill

Animated progress

Optional mascot celebration at milestones.

---

# Badges

Rounded pill

Pastel colors

Minimal text

---

# Tooltips

Soft fade

Rounded

Small shadow

Readable

---

# Modals

Large radius

Blurred backdrop

Soft entrance animation

---

# Navigation

Sidebar

Rounded

Floating

Icons

Labels

Active indicator

Animated selection

Top Navigation

Clean

Minimal

Sticky

---

# Icons

Use only one icon family.

Preferred

Lucide

Fallback

Heroicons

Never mix icon styles.

---

# Charts

Rounded containers

Pastel palette

Smooth animations

Readable labels

No harsh colors.

---

# Tables

Rounded container

Alternating row backgrounds

Hover highlight

Sticky header where useful.

---

# Code Blocks

Rounded

Monospace

Syntax highlighting

Copy button

Run button

Theme aware

---

# Empty States

Every empty state should contain

Mascot

Friendly message

Suggested action

Illustration

Never show blank screens.

---

# Loading States

Skeleton loaders

Progress animation

Cute mascot messages

Never use plain spinners alone.

---

# Error States

Friendly wording

Helpful suggestions

Cute illustration

Retry button

---

# Hover Behavior

Cards

Lift

Buttons

Scale slightly

Icons

Rotate slightly

Links

Underline

Inputs

Glow

---

# Responsive Design

Desktop First

Tablet

Fully supported

Mobile

Fully supported

No clipped content.

No horizontal scrolling.

---

# Accessibility

Minimum contrast AA

Keyboard navigation

Visible focus

ARIA labels

Reduced motion support

---

# Glassmorphism

Use sparingly.

Only for

Dialogs

Floating panels

Notifications

Never apply glass to every card.

---

# Decorative Elements

Allowed

Paw prints

Stars

Clouds

Tiny sparkles

Paper clips

Sticky notes

Bookmarks

Small plants

Coffee mugs

Tiny books

Not allowed

Random emojis

Heavy textures

Overcrowded decorations

---

# Theme Consistency Rules

Every new component must

Use approved colors.

Use approved radius.

Use approved spacing.

Use approved typography.

Support light mode.

Support dark mode.

Support accessibility.

Support animations.

---

# AI Rules

Never invent new colors.

Never invent new typography.

Never invent new spacing.

Never create inconsistent buttons.

Never introduce different shadows.

Always reuse existing components.

When in doubt,

follow this document.