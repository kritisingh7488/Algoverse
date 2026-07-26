# AlgoVerse — Motion System

> Purpose
>
> This document defines the animation language and motion philosophy used throughout AlgoVerse.
>
> Motion is part of the educational experience.
>
> Animations should make the interface feel alive while helping users understand algorithms.
>
> Every AI coding agent must follow this document when implementing animations, transitions, hover effects, loading states, visualizations, and page interactions.
>
> Motion should always improve usability.
>
> Motion should never become decoration for its own sake.

---

# Motion Philosophy

Animations should feel

Soft

Natural

Comfortable

Playful

Responsive

Educational

Premium

Never

Fast

Chaotic

Distracting

Flashy

Overwhelming

---

# Motion Goals

Motion should

Guide attention.

Reward interaction.

Improve understanding.

Reduce abrupt transitions.

Increase delight.

Support learning.

Never slow users down.

---

# Motion Style

Think

Apple

Arc Browser

Linear

Framer

Notion

Nintendo

Duolingo

The experience should feel polished rather than flashy.

---

# Global Animation Duration

Micro Interaction

100–180ms

Hover

180–250ms

Cards

220–280ms

Dialogs

250–320ms

Page Transition

350–500ms

Algorithm Animation

User Controlled

Never use animations longer than necessary.

---

# Motion Curves

Preferred

easeOut

easeInOut

spring

Use spring animations whenever components physically move.

Avoid

linear

unless representing algorithm execution.

---

# Hover Behaviour

Buttons

Slight lift

Scale 1.03

Soft shadow increase

Cards

Lift

Rotate less than 1°

Increase shadow

Icons

Tiny rotation

Tiny scale

Links

Underline

Soft colour transition

---

# Click Behaviour

Buttons should

Compress slightly

Release naturally

Never instantly change state.

---

# Sidebar

Opening

Slide

Fade

Active item

Soft highlight

Animated indicator

Theme switch

Smooth transition

Never abruptly appear.

---

# Navigation

Changing pages

Fade

Slide

Maintain scroll position where appropriate.

Avoid white flashes.

---

# Cards

Cards should

Lift slightly

Cast deeper shadow

Show subtle gradient shift

Never bounce aggressively.

---

# Inputs

Focus

Glow

Border transition

Label animation

Error

Gentle shake

Success

Soft highlight

---

# Dropdowns

Fade

Scale

Shadow

Never instantly appear.

---

# Modals

Background blur

Fade

Scale

Close

Reverse animation

---

# Notifications

Slide from top right

Fade

Disappear automatically

Manual close

---

# Progress Bars

Animated fill

Smooth easing

Milestones

Tiny celebration

Sparkles

Never flash.

---

# Charts

Animate values

Animate bars

Animate lines

Animate legends

No sudden jumps.

---

# Theme Switching

Theme switching is one of the most important animations.

It should

Crossfade colours.

Animate gradients.

Swap mascots.

Update shadows.

Update illustrations.

Update icons.

Update charts.

Update code theme.

Never reload the page.

Never flash white.

---

# Mascot Behaviour

Mascots should feel alive.

Idle

Breathing

Blinking

Tail movement

Thinking

Head tilt

Listening

Ear twitch

Celebration

Small jump

Sparkles

Wave

Never

Dance continuously.

Spin.

Run around the screen.

Distract users.

---

# Algorithm Animation

Algorithm animations are educational.

They should always synchronize with algorithm execution.

Examples

Bubble Sort

Comparison

↓

Highlight

Swap

↓

Move

Pointer

↓

Glow

Merge Sort

Split

↓

Animate separation

Merge

↓

Animate combination

Binary Search

Pointer movement

↓

Smooth slide

Tree Traversal

Node visit

↓

Glow

↓

Scale

↓

Explain

Graph Traversal

Visited node

↓

Colour transition

↓

Edge animation

↓

Queue update

Never fake animation.

Every animation must come from algorithm state.

---

# Code Highlighting

Current executing line

Glow

Background highlight

Pointer animation

Smooth scrolling

Never jump unexpectedly.

---

# Educational Motion

Motion should explain

Current step

Previous step

Next step

Decision made

Variable changes

Pointer movement

Recursive calls

Stack changes

Queue changes

Tree updates

Graph traversal

---

# Success States

Correct answer

Soft confetti

Mascot celebration

Progress increase

Glow

Badge animation

---

# Error States

Never punish users.

Use

Soft shake

Helpful message

Retry

Encouraging mascot

Never use loud red flashing.

---

# Empty States

Fade illustration

Small floating animation

Friendly message

Call to action

---

# Loading States

Skeletons

Animated shimmer

Mascot activity

Progress indicator

Never show only a spinner.

---

# Page Transitions

Every page transition should

Fade

Slide

Maintain visual continuity

Avoid abrupt layout shifts.

---

# Scroll Behaviour

Smooth scrolling

Reveal animations

Section transitions

Sticky navigation

---

# Performance Rules

Maintain

60 FPS

GPU accelerated animations

Transform

Opacity

Avoid layout thrashing.

Never animate

Width

Height

Top

Left

unless absolutely necessary.

---

# Reduced Motion

Respect operating system preferences.

Disable decorative animations.

Retain educational animations where necessary.

---

# Consistency Rules

Every new animation must

Support light theme.

Support dark theme.

Remain accessible.

Remain performant.

Match existing animation timing.

---

# AI Rules

Every AI coding agent must

Reuse existing animation variants.

Never invent inconsistent motion.

Never overanimate.

Never delay interactions.

Always prioritise usability over decoration.

---

# Final Principle

Motion is not decoration.

Motion is communication.

Every animation should help users understand, navigate, or enjoy the learning experience.