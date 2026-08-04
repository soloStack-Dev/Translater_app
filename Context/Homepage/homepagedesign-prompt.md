# Aura AI — Exact Design Specifications

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FDFBF7` | Page background |
| `--bg-card` | `#FFFFFF` | Card backgrounds |
| `--text-primary` | `#1A1A1A` | Headlines, primary text |
| `--text-secondary` | `#5C5C5C` | Body text, descriptions |
| `--text-muted` | `#9CA3AF` | Footer links, captions |
| `--accent` | `#7A5C6B` | Primary buttons, logo, links, tags |
| `--accent-hover` | `#6A4C5B` | Button hover states |
| `--border` | `#F0F0F0` | Dividers, card borders |
| `--border-light` | `#E5E5E5` | Input borders |

## Typography

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| Logo | Inter | 700 | 20px | 1.2 | -0.02em |
| H1 (Hero) | Inter | 700 | 56px / 3.5rem | 1.1 | -0.03em |
| H2 (Section) | Inter | 700 | 30px / 1.875rem | 1.2 | -0.02em |
| H3 (Card Title) | Inter | 700 | 20px / 1.25rem | 1.3 | -0.01em |
| Body | Inter | 400 | 16px / 1rem | 1.6 | 0 |
| Caption | Inter | 500 | 12px / 0.75rem | 1.4 | 0.05em |
| Nav Links | Inter | 500 | 14px / 0.875rem | 1.5 | 0 |
| Button | Inter | 500 | 14px / 0.875rem | 1 | 0 |

## Spacing System

- **Section Padding:** 80px vertical (py-20), 64px horizontal on desktop (px-16)
- **Container Max-Width:** 1280px (max-w-7xl)
- **Grid Gap:** 32px (gap-8)
- **Card Padding:** 24px (p-6)
- **Button Padding:** 12px 32px (px-8 py-3)

## Component Styles

### Primary Button
- Background: `#7A5C6B`
- Text: `#FFFFFF`
- Border-radius: 9999px (fully rounded)
- Padding: 12px 32px
- Shadow: none default, `0 4px 14px rgba(122, 92, 107, 0.25)` on hover
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

### Secondary Button
- Background: `#FFFFFF`
- Border: 1px solid `#E5E5E5`
- Text: `#1A1A1A`
- Border-radius: 9999px
- Hover: border-color `#7A5C6B`, text-color `#7A5C6B`

### Cards
- Background: `#FFFFFF`
- Border-radius: 16px (rounded-2xl)
- Shadow: `0 1px 3px rgba(0,0,0,0.05)`
- Hover Shadow: `0 10px 40px rgba(0,0,0,0.08)`
- Hover Transform: translateY(-4px)
- Transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)

### Tags (Pills)
- Background: `rgba(255, 255, 255, 0.9)` with backdrop-blur
- Border-radius: 9999px
- Padding: 4px 12px
- Font: 12px uppercase, font-weight 600, letter-spacing 0.05em
- Color: `#7A5C6B`

## Hero Image Treatment
- Border-radius: 24px (rounded-3xl)
- Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.15)`
- Slight inner glow or gradient overlay optional

## Layout Grid
- 12-column grid
- Gutter: 32px
- Margins: 64px (desktop), 24px (mobile)

## Micro-interactions
- Nav link hover: color transition 150ms, subtle underline from left
- Card hover: 300ms ease-out, lift + shadow
- Button hover: 200ms ease-out, slight scale + shadow
- Page entrance: 600ms staggered fade-up (opacity 0→1, y: 20→0)