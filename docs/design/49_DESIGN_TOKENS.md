# AlgoVerse — Design Tokens

> Purpose
>
> This document defines every reusable design token used throughout AlgoVerse.
>
> Design tokens are the lowest level of the design system.
>
> Every frontend component must consume these tokens instead of using hardcoded values.
>
> Never hardcode colors, spacing, shadows, border radius, or animation values inside components.

---

# Philosophy

Every visual decision should come from a reusable token.

Changing one token should update the entire application.

Never duplicate values.

---

# Color Tokens

## Light Theme

--color-background

#FFF8F2

--color-surface

#F8EDE3

--color-card

#FFE6DD

--color-primary

#FF8A80

--color-primary-hover

#FF7266

--color-secondary

#8B5CF6

--color-secondary-hover

#7C3AED

--color-accent

#FFB38A

--color-success

#72D98B

--color-warning

#FFC857

--color-error

#F87171

--color-info

#7CC6FE

--color-text-primary

#3D3535

--color-text-secondary

#7A6E6E

--color-border

#EADDD4

---

## Dark Theme

--color-background

#20162F

--color-surface

#2B1E3E

--color-card

#3A2747

--color-primary

#FF9F68

--color-secondary

#C084FC

--color-accent

#FFB088

--color-success

#7AE582

--color-warning

#FFD166

--color-error

#FF7A7A

--color-info

#8ED8FF

--color-text-primary

#FFF8F5

--color-text-secondary

#DCCFEA

--color-border

#4A355F

---

# Gradient Tokens

--gradient-primary

Coral → Peach

--gradient-secondary

Lavender → Plum

--gradient-success

Mint → Emerald

--gradient-warning

Yellow → Orange

--gradient-background-light

Warm Cream → Beige

--gradient-background-dark

Deep Plum → Dark Lavender

Never introduce new gradients without documentation.

---

# Typography Tokens

--font-heading

Fredoka

--font-body

Nunito

--font-code

JetBrains Mono

---

# Font Sizes

--text-hero

48px

--text-page-title

36px

--text-section

28px

--text-card-title

22px

--text-body

16px

--text-caption

14px

--text-small

12px

---

# Radius Tokens

--radius-card

28px

--radius-button

18px

--radius-input

18px

--radius-dialog

30px

--radius-pill

999px

---

# Shadow Tokens

--shadow-soft

Cards

--shadow-medium

Floating panels

--shadow-large

Dialogs

Never use hard black shadows.

Always use soft colored shadows.

---

# Spacing Tokens

Use an 8-point system.

--space-1

4px

--space-2

8px

--space-3

12px

--space-4

16px

--space-5

24px

--space-6

32px

--space-7

40px

--space-8

48px

--space-9

64px

--space-10

96px

Never use arbitrary spacing.

---

# Motion Tokens

--transition-fast

150ms

--transition-normal

250ms

--transition-slow

350ms

--transition-page

500ms

Preferred easing

easeOut

easeInOut

spring

---

# Z-Index Tokens

Sidebar

Navigation

Dropdown

Tooltip

Modal

Toast

Never use arbitrary z-index values.

---

# Component Rules

Every component must use

Design Tokens

↓

Tailwind Theme

↓

Component

Never

Hardcode values.

---

# Tailwind Rules

All colors should map to Tailwind theme variables.

Never write

bg-[#FF8A80]

inside components.

Use

bg-primary

instead.

---

# CSS Variable Rules

Expose every token as CSS variables.

Light theme

:root

Dark theme

[data-theme="dark"]

Theme switching should update variables only.

Avoid rerendering components.

---

# AI Rules

Never introduce new tokens without updating this document.

Never hardcode colors.

Never hardcode spacing.

Never hardcode radius.

Never hardcode shadows.

Always consume design tokens.

---

# Definition of Complete

The design token system is complete only if

✓ Every color uses tokens.

✓ Every spacing uses tokens.

✓ Every shadow uses tokens.

✓ Every radius uses tokens.

✓ Every transition uses tokens.

✓ Light and dark themes share the same token architecture.

✓ Components never hardcode visual values.

---

# Final Principle

Every visual decision in AlgoVerse should originate from a reusable design token.

Changing one token should consistently update the entire application.