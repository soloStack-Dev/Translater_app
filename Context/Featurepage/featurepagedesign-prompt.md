# Aura AI — Features Page Design Specifications

## Color Additions (Beyond Homepage Palette)

| Token | Hex | Usage |
|-------|-----|-------|
| `--section-title` | `#7A5C6B` | Features page headlines |
| `--icon-bg` | `#FCE8F0` | Soft pink circle behind icons |
| `--privacy-bg` | `#F5E6C8` | Warm beige card background |
| `--watermark` | `rgba(122,92,107,0.08)` | Subtle background illustrations |
| `--caption` | `#9CA3AF` | Image captions |

## Typography (Features Page Specific)

| Element | Font | Weight | Size | Color | Alignment |
|---------|------|--------|------|-------|-----------|
| Page H1 | Inter | 700 | 48px | `#7A5C6B` | Center |
| Mission Body | Inter | 400 | 16-18px | `#5C5C5C` | Center |
| Section H2 | Inter | 700 | 30px | `#7A5C6B` | Center |
| Card Title | Inter | 700 | 20px | `#7A5C6B` | Left |
| Card Body | Inter | 400 | 14px | `#5C5C5C` | Left |
| Caption | Inter | 400 | 13px | `#9CA3AF` | Center |

## Spacing

- Mission section top padding: 96px (below navbar)
- Mission text max-width: 640px
- Hero image max-width: 1024px (max-w-5xl)
- Section vertical padding: 80px
- Card internal padding: 32px (standard), 40px (privacy)
- Grid gaps: 32px

## Component Styles

### Icon Circle
- Size: 48px diameter
- Background: `#FCE8F0`
- Border-radius: 50%
- Icon: 20px, stroke-width 1.5, color `#7A5C6B`
- Margin-bottom: 20px

### Standard Feature Card
- Background: `#FFFFFF`
- Border-radius: 20px
- Padding: 32px
- Shadow: `0 2px 8px rgba(0,0,0,0.04)`
- No border

### Privacy Card (Special)
- Background: `#F5E6C8`
- Border-radius: 24px
- Padding: 40px
- No shadow (flat design)
- Watermark: Shield icon, 120px, 8% opacity mauve, positioned bottom-right
- Text color for title: `#1A1A1A` (stronger contrast on beige)

### Hero Image
- Border-radius: 24px
- Full width of container
- Cinematic wide crop (21:9 aspect)
- Caption below: 16px gap, italic feel but regular weight

## Visual Hierarchy
1. Page headline (largest, mauve, centered)
2. Hero image (dominant visual)
3. Section title "The Pillars of Aura"
4. 3-column feature grid
5. 2-column asymmetric secondary features
6. Footer

## Interaction States
- Cards: hover translateY(-2px), shadow increase
- Nav: active link has `#7A5C6B` color
- Caption: no interaction