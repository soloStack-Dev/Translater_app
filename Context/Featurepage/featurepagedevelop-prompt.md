# Aura AI — Features Page Build Prompt

## Overview
Build the "Features" page for Aura AI, maintaining the warm minimalism aesthetic 
(cream backgrounds, mauve accents, rounded elements). This page tells the brand story 
through a centered mission statement, a large atmospheric hero image, and a structured 
feature grid highlighting the product's core pillars. The mood is calm, trustworthy, 
and human-centric.

## Tech Stack
analyze my-app/package.json what packages i added use those package to build impressive website

## Page Structure

### 1. Navigation (Sticky Header — Shared)
- Same as homepage: Transparent → blur on scroll
- "Features" link should have active state (color `#7A5C6B` or underline)

### 2. Hero / Mission Section
- **Background:** `#FFFFFF` or `#FDFBF7`
- **Padding:** pt-24 pb-12 px-6 lg:px-16 max-w-4xl mx-auto (centered narrow container)
- **Content:** Centered text alignment
  - **Headline:** "Redefining Digital Interaction"
    - Font: text-4xl lg:text-5xl, font-bold, text-center, color `#7A5C6B` (mauve!)
    - Letter-spacing: -0.02em
  - **Mission Statement:** 
    "Our mission is to create a companion that feels less like software and more like 
    a gentle presence. Aura AI blends advanced emotional intelligence with comforting 
    design to provide a space where you can simply be yourself, supported by intuitive 
    and contextual empathy."
    - Font: text-base lg:text-lg, text-center, color `#5C5C5C`
    - Max-width: 640px (max-w-2xl), mx-auto, mt-6, leading-relaxed

### 3. Hero Image Section
- **Container:** max-w-5xl mx-auto px-6
- **Image:** Large, rounded-3xl overflow-hidden
  - Aspect ratio: ~21:9 or cinematic wide
  - Shadow: `0 25px 60px -15px rgba(0,0,0,0.15)`
- **Caption:** Below image, centered
  - Text: "Behind the Voice: Bringing warmth to digital spaces."
  - Font: text-sm, color `#9CA3AF`, mt-4, text-center

### 4. The Pillars of Aura (3-Column Grid)
- **Background:** `#FDFBF7`
- **Padding:** py-20 px-6 lg:px-16 max-w-6xl mx-auto
- **Section Title:** "The Pillars of Aura"
  - Font: text-3xl font-bold, text-center, color `#7A5C6B`
  - Margin-bottom: 48px
- **Grid:** 3 columns on desktop, 1 on mobile, gap-8
- **Feature Cards (Standard):**
  - Background: `#FFFFFF`
  - Border-radius: 20px (rounded-2xl)
  - Padding: 32px (p-8)
  - Shadow: `0 2px 8px rgba(0,0,0,0.04)`
  - Text-align: left
  - **Icon Container:** 
    - Size: 48px x 48px
    - Background: `#FCE8F0` (soft pink/lavender tint)
    - Border-radius: 50%
    - Display: flex, items-center, justify-center
    - Icon color: `#7A5C6B`
    - Icon size: 20px
    - Margin-bottom: 20px
  - **Title:** text-xl font-bold, color `#7A5C6B`, mt-4
  - **Description:** text-sm, color `#5C5C5C`, mt-3, leading-relaxed

### 5. Secondary Features Section (2-Column Asymmetric)
- **Background:** `#FFFFFF`
- **Padding:** py-16 px-6 lg:px-16 max-w-6xl mx-auto
- **Grid:** 2 columns, gap-8
- **Left Card — "Designed for Comfort":**
  - Same standard card style as above
  - Background: `#FFFFFF`
  - Icon: Chair/seat icon in pink circle
  - Title: text-xl font-bold, color `#7A5C6B`
  - Description: text-sm, color `#5C5C5C`
- **Right Card — "Privacy as a Standard":**
  - Background: `#F5E6C8` (warm beige/cream tone)
  - Border-radius: 24px (rounded-3xl)
  - Padding: 40px
  - Position: relative (for background watermark)
  - **Icon Container:** Same pink circle style, positioned top-left
  - **Title:** text-xl font-bold, color `#1A1A1A` (darker on beige)
  - **Description:** text-sm, color `#5C5C5C`
  - **Watermark:** Large faded shield+lock icon in bottom-right corner
    - Color: `rgba(122, 92, 107, 0.08)` (very subtle)
    - Size: ~120px
    - Position: absolute, bottom-4 right-4

### 6. Footer (Shared Component)
- Same as homepage: white background, top border `#F0F0F0`
- Left: Logo + copyright
- Right: Privacy Policy | Terms of Service | Contact Us | Careers

## Responsive Behavior
- **Mobile:** Single column for all grids, hero image full-width, text sizes reduce
- **Tablet:** 2-column for pillars (3rd wraps), privacy card full width
- **Desktop:** Full layout as described

## Animations
- Mission text: Fade-in + translateY on page load (stagger headline → paragraph)
- Hero image: Scale from 0.95 → 1.0 + fade-in on scroll into view
- Pillar cards: Staggered fade-up (100ms delay between each) on scroll
- Privacy watermark: Subtle parallax or gentle float animation
- Section titles: Fade-in on scroll

## Accessibility
- Semantic headings (h1 for page title, h2 for section, h3 for cards)
- Alt text for hero image
- Focus rings on all interactive elements
- Sufficient color contrast (beige card text checked)