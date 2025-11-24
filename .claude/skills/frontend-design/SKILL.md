---
name: frontend-design
description: Create industrial, professional frontend interfaces with React Aria Components and Tailwind v4. Focus on tightly rounded corners, workhorse fonts, and slick micro-interactions.
license: Complete terms in LICENSE.txt
---

This skill guides the creation of **Industrial Professional** frontend interfaces.

## Tech Stack
- **Framework**: React Server Components (RSC)
- **UI Library**: React Aria Components (RAC)
- **Styling**: Tailwind CSS v4

## Design Philosophy: Industrial & Professional
- **Vibe**: Modern, utilitarian, robust, yet highly polished. Think "high-end dashboard" or "precision engineering tool".
- **Aesthetic**:
    - **Corners**: Tightly rounded (e.g., `rounded-sm`, `rounded`, or specific small pixel values like `2px` or `4px`). Avoid overly soft, large border radii (like `rounded-xl` or `rounded-2xl`) unless necessary for specific UI elements (like pills).
    - **Typography**: Use "workhorse" fonts that convey reliability and clarity (e.g., Inter, Roboto, IBM Plex Sans, Geist, JetBrains Mono for data).
    - **Visuals**: Clean lines, subtle borders, high contrast where needed for readability, but generally a refined palette.

## Interactions & Motion
- **Micro-interactions**: Every button press, hover, and focus state should feel responsive and tactile.
- **Animations**: "Slick" and "cool" but purposeful.
    - Use `framer-motion` or CSS transitions for smooth state changes.
    - Avoid bouncy or cartoony physics. Go for snappy, precise easing (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`).

## Implementation Details
- **React Aria Components**: Use RAC for all interactive elements (Buttons, Inputs, Selects, etc.) to ensure accessibility and robust behavior.
- **Design System**: ALWAYS prefer using components from `/src/components/ds` when available. These are the source of truth for the design system.
- **Tailwind v4**: Use the latest Tailwind features.
- **Structure**:
    - Distinct sections with clear hierarchy.
    - Use borders and subtle background differences to define areas (panels, sidebars).

**CRITICAL**: The output should feel like a premium tool used by professionals. It should be "workhorse" in function but "luxury" in feel.
