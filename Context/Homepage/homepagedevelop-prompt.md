# Aura AI — Homepage Build Prompt

## Overview
Build a modern, warm-toned AI voice assistant landing page for "Aura AI." 
The design emphasizes coziness, human connection, and seamless smart-home integration. 
The aesthetic is "warm minimalism" — clean layouts with soft cream backgrounds, 
muted mauve accents, and rounded UI elements.

## Tech Stack
analyze my-app/package.json what packages i added use those package to build impressive website

## Page Structure

### 1. Navigation (Sticky Header)
- **Layout:** Flexbox row, space-between, items-center
- **Height:** ~72px
- **Background:** Transparent (becomes `bg-[#FDFBF7]/90 backdrop-blur-sm` on scroll)
- **Left:** "Aura AI" text logo — font-bold, text-xl, tracking-tight, color `#7A5C6B`
- **Center:** Nav links — "Voices" | "Features" | "Journal" | "Pricing"
  - Font: text-sm, font-medium, color `#5C5C5C`, hover color `#7A5C6B`
  - Spacing: gap-8
- **Right:** CTA button "Try Aura"
  - Background: `#7A5C6B`, text-white, rounded-full, px-6 py-2.5
  - Font: text-sm, font-medium
  - Hover: scale-105, shadow-md transition

### 2. Hero Section
- **Layout:** CSS Grid — 2 columns (55% text / 45% image) on desktop, stack on mobile
- **Padding:** py-20 px-6 lg:px-16 max-w-7xl mx-auto
- **Left Column:**
  - **Headline:** "Experience Warmth in Intelligence"
    - Font: text-5xl lg:text-6xl, font-bold, leading-tight, color `#1A1A1A`
  - **Subheadline:** "Aura AI blends seamless voice interaction with an intuitive, 
    glowing interface designed to feel like a natural extension of your home."
    - Font: text-lg, color `#5C5C5C`, max-w-md, mt-6
  - **CTA Group:** flex gap-4, mt-8
    - Primary: "Meet Aura" — bg `#7A5C6B`, text-white, rounded-full, px-8 py-3
    - Secondary: "Learn More" — border border-gray-200, bg-white, rounded-full, px-8 py-3
- **Right Column:**
  - **Hero Image:** Rounded-3xl overflow-hidden, shadow-2xl
  - Aspect ratio: ~16:10
  - Subtle floating animation (translateY oscillation)

### 3. Latest Journal Section
- **Background:** `#FDFBF7` (same as page)
- **Padding:** py-20 px-6 lg:px-16 max-w-7xl mx-auto
- **Header:** flex justify-between items-end
  - Title: "Latest Journal" — text-3xl font-bold color `#1A1A1A`
  - Link: "View all →" — text-sm font-medium color `#7A5C6B` with arrow icon
- **Grid:** 2 columns, gap-8
- **Journal Cards:**
  - Background: white
  - Border-radius: rounded-2xl
  - Shadow: `shadow-sm hover:shadow-lg` transition
  - **Image:** Top, aspect-ratio 16:9, rounded-t-2xl, object-cover
  - **Tag:** Absolute positioned top-left inside image, bg-white/90 backdrop-blur, 
    rounded-full px-3 py-1, text-xs font-semibold uppercase tracking-wider color `#7A5C6B`
  - **Content:** p-6
    - Title: text-xl font-bold color `#1A1A1A`
    - Excerpt: text-sm color `#5C5C5C`, mt-2, line-clamp-2
    - Link: "Read story →" text-sm font-medium color `#7A5C6B`, mt-4 inline-flex

### 4. Footer
- **Background:** white or `#FDFBF7`
- **Border-top:** 1px solid `#F0F0F0`
- **Padding:** py-8 px-6 lg:px-16 max-w-7xl mx-auto
- **Layout:** flex justify-between items-center
- **Left:**
  - "Aura AI" — text-lg font-bold color `#7A5C6B`
  - "© 2024 Aura AI. Crafted with love." — text-xs color `#9CA3AF` mt-1
- **Right:** flex gap-6
  - Links: "Privacy Policy" | "Terms of Service" | "Contact Us" | "Careers"
  - text-sm color `#9CA3AF`, hover color `#7A5C6B`

## Responsive Behavior
- **Mobile (&lt; 768px):** Single column, hamburger menu, stacked hero, single column journal
- **Tablet (768px - 1024px):** 2-column journal maintained, hero stacks
- **Desktop (&gt; 1024px):** Full layout as described

## Animations & Interactions
- Page load: Staggered fade-in (opacity 0→1, translateY 20→0) for hero text
- Button hovers: scale(1.02), transition 200ms ease-out
- Card hovers: translateY(-4px), shadow increase
- Nav links: Underline slide-in from left on hover
- Smooth scroll behavior for anchor links

## Accessibility
- All images have descriptive alt text
- Buttons have clear focus rings
- Color contrast meets WCAG AA
- Semantic HTML (header, main, section, footer, nav)