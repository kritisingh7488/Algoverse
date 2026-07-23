# AlgoVerse — Design System

## Purpose

This document defines the complete visual language of AlgoVerse.

Every page, component, animation, and interaction must follow this design system to ensure visual consistency throughout the application.

No UI should be created without following this document.

---

# Design Principles

AlgoVerse should feel:

* Modern
* Premium
* Cute
* Minimal
* Friendly
* Interactive
* Elegant
* Soft
* Educational

The interface should never feel crowded.

Every page should breathe through proper spacing and hierarchy.

---

# Visual Personality

Imagine if:

* Linear
* Arc Browser
* Framer
* Duolingo
* Apple

were combined into a single educational platform.

That is the target aesthetic.

---

# Design Keywords

Soft

Rounded

Playful

Glass

Gradient

Floating

Animated

Friendly

Premium

Readable

---

# Color Palette

## Primary

Purple

HEX

#A855F7

Purpose

Primary buttons

Active tabs

Links

Highlights

Icons

---

## Secondary

Deep Purple

HEX

#7C3AED

Purpose

Hover states

Gradients

Headers

---

## Accent

Pink

HEX

#FF7AC6

Purpose

Important highlights

Achievements

Confetti

Success animations

---

## Success

Green

HEX

#34D399

Purpose

Completed steps

Correct answers

Success messages

---

## Warning

Yellow

HEX

#FBBF24

Purpose

Warnings

Benchmark notices

Validation

---

## Error

Red

HEX

#F87171

Purpose

Errors

Delete buttons

Validation

---

## Information

Blue

HEX

#60A5FA

Purpose

Info cards

Hints

Tooltips

---

# Background Colors

Primary Background

#FFF8FC

Secondary Background

#FFFFFF

Section Background

#F8F5FF

Dark Mode Background

#111827

Dark Surface

#1F2937

---

# Text Colors

Primary

#1F2937

Secondary

#6B7280

Muted

#9CA3AF

White

#FFFFFF

---

# Gradients

Primary Gradient

Purple

↓

Pink

Secondary Gradient

Blue

↓

Purple

Accent Gradient

Pink

↓

Orange

Background Gradient

Very subtle

White

↓

Light Purple

Use gradients sparingly.

---

# Typography

## Heading Font

Poppins

Weights

600

700

800

---

## Body Font

Inter

Weights

400

500

600

---

## Code Font

JetBrains Mono

Used for

Code snippets

Complexities

Variables

Algorithm output

---

# Font Scale

Hero

56px

H1

42px

H2

34px

H3

28px

H4

24px

Body Large

18px

Body

16px

Small

14px

Caption

12px

---

# Border Radius

Buttons

16px

Cards

24px

Inputs

16px

Dialogs

28px

Tags

999px

Everything should feel rounded.

Avoid sharp corners.

---

# Shadows

Level 1

Very subtle

Cards

Level 2

Hover

Dialogs

Level 3

Large floating elements

Never use harsh shadows.

---

# Glassmorphism

Used for

Navbar

Dialogs

Floating cards

Sidebar

Settings panels

Properties

Blur

Semi-transparent white

Soft border

Soft shadow

---

# Spacing System

Base Unit

8px

Common Values

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

Avoid arbitrary spacing.

---

# Icons

Use

Lucide React

Style

Outline

Rounded

Minimal

Consistent stroke width

No mixed icon sets.

---

# Buttons

## Primary

Purple Gradient

White Text

Rounded

Hover

Lift

Glow

Shadow Increase

Click

Compress

Release

---

## Secondary

White Background

Purple Border

Purple Text

Hover

Light Purple Fill

---

## Ghost

Transparent

Hover

Tinted background

---

## Danger

Red

Confirmation required

Hover

Glow

---

## Icon Button

Circular

Hover

Scale

Background Tint

---

# Inputs

Rounded

16px radius

Padding

16px

Focus

Purple border

Glow

Error

Red border

Success

Green border

Placeholder

Muted

---

# Cards

Rounded

24px

Glass effect

Soft shadow

Padding

24px

Hover

Lift

Shadow

Glow

Cards should never appear flat.

---

# Badges

Rounded pill

Small

Used for

Difficulty

Status

Achievements

Notifications

Examples

Easy

Medium

Hard

Completed

Live

Premium

---

# Chips

Used for

Tags

Categories

Filters

Hover

Tint

Selected

Gradient Fill

---

# Avatars

Circular

Online indicator

Hover

Scale

Glow

---

# Dividers

Very subtle

Low opacity

Large spacing

Never visually heavy.

---

# Tables

Rounded container

Sticky header

Alternating hover

Responsive

Skeleton loading

---

# Charts

Rounded corners

Soft colors

Animated entry

Hover tooltips

No harsh colors.

---

# Animations

Use

Framer Motion

Avoid CSS-only animations for major interactions.

---

# Animation Timing

Fast

150ms

Normal

250ms

Medium

350ms

Slow

500ms

---

# Easing

Spring

Default

Ease Out

Fade

Linear only for progress indicators.

---

# Hover Behaviour

Buttons

Lift

Cards

Lift

Icons

Rotate slightly

Inputs

Glow

Images

Scale

---

# Loading

Skeleton

Pulse

Spinner

Progress Bar

Avoid text-only loading indicators.

---

# Scrollbars

Thin

Rounded

Theme colored

Hidden where appropriate

---

# Illustrations

Style

Soft

Flat

Friendly

Rounded

Avoid harsh vector illustrations.

---

# Empty States

Every empty page includes

Illustration

Heading

Description

Primary Action

Optional Secondary Action

---

# Success States

Green

Animated check

Subtle confetti

Toast

---

# Error States

Illustration

Friendly language

Retry button

Support link (future)

---

# Responsive Grid

Desktop

4 columns

Tablet

2 columns

Mobile

1 column

---

# Component Consistency

Every reusable component should have

Default

Hover

Active

Focused

Loading

Disabled

Error (if applicable)

Success (if applicable)

No component should exist with only a default state.

---

# Accessibility

Minimum touch target

44px

Visible focus outline

High contrast support

Keyboard navigation

ARIA labels

Reduced motion support

---

# Motion Guidelines

Motion should:

Guide attention

Explain change

Provide feedback

Celebrate success

Never distract.

Avoid excessive bouncing, spinning, or flashing.

---

# Reusable UI Components

The design system should be built around reusable components such as:

* PrimaryButton
* SecondaryButton
* IconButton
* GlassCard
* SectionHeader
* AnimatedModal
* Toast
* Tooltip
* SearchBar
* ThemeToggle
* SkeletonCard
* EmptyState
* LoadingSpinner
* StatsCard
* FloatingPanel
* UserAvatar
* Badge
* Chip
* Dropdown
* Tabs
* Accordion
* Pagination
* ConfirmationDialog

These components should be referenced from the Component Registry and reused across the application rather than recreated.

---

# Design Goals

Every screen should immediately communicate:

Professional quality

Attention to detail

Consistency

Delight

Performance

Users should feel that they are using a polished product rather than a student project.

Every design decision should reinforce the identity of AlgoVerse as a premium interactive learning platform.
