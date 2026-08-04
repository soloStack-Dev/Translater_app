
---

## 2️⃣ Exact Design Prompt (Visual + Animation Specs)

```markdown
# Aura AI — Voices Page Design Specifications

## Background
- **Type:** Radial gradient
- **Center color:** `#FDF6ED` (warm ivory)
- **Mid color:** `#F5E6C8` (soft peach)
- **Edge color:** `#F0DEC0` (warm sand)
- **CSS:** `radial-gradient(ellipse at 50% 50%, #FDF6ED 0%, #F5E6C8 60%, #F0DEC0 100%)`
- **Feel:** Like a soft spotlight glowing from behind the mic

## Liquid Circle Block — Detailed Specs

### Container
- Size: 220px x 220px (desktop), 180px x 180px (mobile)
- Position: relative, centered horizontally and vertically in viewport

### Liquid Blob Layer (Behind Mic)
- **Technique:** SVG Gooey Filter
- **Filter:** `feGaussianBlur stdDeviation="12"` + `feColorMatrix` contrast
- **Orbs:** 3 circles, 50-70px diameter, color `#7A5C6B`, opacity 0.7
- **Motion:** Each orb rotates on a circular path around center at different speeds
  - Orb 1: 4s duration, 45px radius
  - Orb 2: 5.5s duration, 35px radius, counter-clockwise
  - Orb 3: 6s duration, 50px radius
- **Result:** The overlapping blurred orbs merge into a single organic, morphing 
  amoeba-like shape that constantly shifts and breathes

### Ripple Rings Layer
- 3 rings, absolutely centered behind the blob
- Border: 1.5px solid `rgba(122, 92, 107, 0.15)`
- Size: Start at 90px diameter, expand to 220px
- Opacity: Start 0.4, fade to 0
- Animation: 3.5s linear infinite, staggered by 1.16s
- Easing: Linear (constant expansion)

### Microphone Button
- Size: 88px diameter
- Background: `#7A5C6B`
- Icon: White microphone, 32px, centered
- Shadow: `0 12px 40px rgba(122, 92, 107, 0.35)`
- Z-index: Above blob and ripples
- **Listening State Animation:**
  - Scale: 1 → 1.08 → 1 (gentle heartbeat)
  - Duration: 2s, ease-in-out, infinite
  - Shadow pulses with scale

## Sound Wave Visualizer

| Bar | Default Height | Animation Delay | Color |
|-----|---------------|-----------------|-------|
| 1 | 16px | 0s | `#7A5C6B` |
| 2 | 28px | 0.1s | `#7A5C6B` |
| 3 | 36px | 0.2s | `#7A5C6B` |
| 4 | 28px | 0.3s | `#7A5C6B` |
| 5 | 16px | 0.4s | `#7A5C6B` |

- Width: 4px each
- Gap: 6px between bars
- Border-radius: 9999px
- Animation: scaleY 0.5 → 1.3, 0.8s ease-in-out infinite
- Transform-origin: center

## Status Text
- "Listening..."
- Font: Inter, 16px, weight 500
- Color: `#9B7A8A` (dusty mauve)
- Letter-spacing: 0.05em
- Animation: opacity 0.5 → 1, 2s ease-in-out infinite
- Position: 32px below mic button

## Active Nav State
- "Voices" link: color `#7A5C6B`, underline 2px solid `#7A5C6B`
- "Try Aura" button: bg `#FCE8F0`, text `#7A5C6B`, border-radius full, px-6 py-2

## Z-Index Layering (Bottom to Top)
1. Background gradient
2. Ripple rings (z-10)
3. Liquid blob container with SVG filter (z-20)
4. Microphone button (z-30)
5. Sound wave bars (z-40, positioned above everything)

## Reduced Motion
- Disable: blob rotation, ripple expansion, wave bar scaling, text opacity pulse
- Keep: Static blob shape (circle), static rings (single ring, no animation), 
  static wave bars at medium height