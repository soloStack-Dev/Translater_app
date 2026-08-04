# Aura AI — Voices Page Build Prompt

## Overview
Build the "Voices" page for Aura AI — a minimal, immersive voice interaction interface. 
The page centers around a large microphone button with a liquid/gooey morphing animation, 
surrounded by an animated sound wave visualizer. The background is a warm radial gradient 
that creates a soft, glowing atmosphere. The entire experience should feel alive, organic, 
and responsive to voice input.

## Tech Stack
analyze my-app/package.json what packages i added use those package to build impressive website
## Page Structure

### 1. Navigation (Sticky Header — Shared)
- Same as other pages, but "Voices" link has active state:
  - Color: `#7A5C6B`
  - Underline: 2px solid `#7A5C6B`, offset 4px
- "Try Aura" button style on this page: 
  - Background: `#FCE8F0` (soft pink), text: `#7A5C6B`
  - Border: 1px solid `#FCE8F0`
  - Hover: bg `#7A5C6B`, text white

### 2. Voice Interaction Hero Section
- **Layout:** Full viewport height minus navbar (min-h-[calc(100vh-72px)])
- **Background:** Radial gradient
  - Center: `#FDF6ED` (warm cream)
  - Outer edges: `#F5E6C8` (soft peach/beige)
  - CSS: `radial-gradient(ellipse at center, #FDF6ED 0%, #F5E6C8 70%, #F0DEC0 100%)`
- **Content:** Flex column, items-center, justify-center, gap-8

#### A. Sound Wave Visualizer (Above Mic)
- **Element:** 5 vertical bars arranged horizontally
- **Container:** flex, gap-2, items-center, justify-center
- **Bar Style:**
  - Width: 4px
  - Border-radius: 9999px (fully rounded caps)
  - Color: `#7A5C6B`
  - Default height: varies (staggered: 16px, 24px, 32px, 24px, 16px)
- **Animation:** Continuous wave oscillation
  - Each bar animates height independently
  - Timing: ease-in-out, infinite loop
  - Duration: staggered between 0.6s - 1.2s
  - Heights oscillate between 12px and 40px
  - Creates a "breathing" audio wave effect

#### B. Liquid Morphing Circle Block (The Core Feature)
- **Container:** Relative, 200px x 200px (or responsive: w-48 h-48 lg:w-56 lg:h-56)
- **Liquid Blob Background (Behind the button):**
  - Use SVG filter gooey effect OR CSS border-radius morphing
  - **Option A — SVG Gooey Filter (Recommended):**
    ```html
    &lt;svg style="position: absolute; width: 0; height: 0;"&gt;
      &lt;defs&gt;
        &lt;filter id="gooey"&gt;
          &lt;feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" /&gt;
          &lt;feColorMatrix in="blur" mode="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 20 -10" result="goo" /&gt;
          &lt;feBlend in="SourceGraphic" in2="goo" /&gt;
        &lt;/filter&gt;
      &lt;/defs&gt;
    &lt;/svg&gt;
    ```
    - Create 3-4 orbiting circles inside the container
    - Each circle: 60px-80px, bg `#7A5C6B`, opacity 0.6
    - Animate each on a different orbital path using CSS keyframes
    - Apply `filter: url(#gooey)` to the container
    - The overlapping blurred circles merge into a single morphing blob!
  - **Option B — CSS Border-Radius Morphing:**
    ```css
    .liquid-blob {
      background: linear-gradient(135deg, #7A5C6B, #9B7A8A);
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      animation: morph 8s ease-in-out infinite;
    }
    @keyframes morph {
      0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    }
    ```
- **Pulsing Ripple Rings (Around the blob):**
  - 3 concentric circles, absolute positioned, centered
  - Border: 1px solid `rgba(122, 92, 107, 0.2)`
  - Border-radius: 50%
  - Animation: scale from 1 → 1.5, opacity 0.4 → 0
  - Duration: 3s, infinite, staggered by 1s
  - Creates expanding sonar/ripple effect

#### C. Microphone Button
- **Position:** Absolute center of the liquid blob container
- **Size:** 80px x 80px (w-20 h-20)
- **Background:** `#7A5C6B`
- **Border-radius:** 50%
- **Icon:** Microphone (Lucide), white, 28px
- **Shadow:** `0 8px 32px rgba(122, 92, 107, 0.3)`
- **Hover:** scale(1.05), shadow increase
- **Active/Listening State:** 
  - Scale pulse: 1 → 1.1 → 1, 1.5s infinite
  - Shadow color intensifies to `rgba(122, 92, 107, 0.5)`

#### D. Status Text
- **Text:** "Listening..."
- **Font:** text-base, font-medium, color `#9B7A8A` (muted mauve)
- **Animation:** Opacity pulse 0.6 → 1, 2s infinite
- **Below the mic button:** mt-8

### 3. Footer (Shared)
- Same as homepage

## Animation Specifications

### Liquid Blob (GSAP + SVG Filter — Advanced)
```javascript
// Orbiting circles for gooey effect
const orbits = [
  { duration: 4, radius: 30, delay: 0 },
  { duration: 5, radius: 35, delay: 0.5 },
  { duration: 6, radius: 25, delay: 1 },
];

// Each circle rotates around center using GSAP
// The SVG filter merges them into a liquid shape

# CSS-Only Alternative

.liquid-container {
  filter: url(#gooey);
  position: relative;
  width: 200px;
  height: 200px;
}
.orb {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #7A5C6B;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin: -30px;
}
.orb:nth-child(1) { animation: orbit1 4s linear infinite; }
.orb:nth-child(2) { animation: orbit2 5s linear infinite; }
.orb:nth-child(3) { animation: orbit3 6s linear infinite; }

@keyframes orbit1 {
  0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
}
/* Similar for orbit2, orbit3 with different translateX values */

# Sound Wave Bars

.wave-bar {
  animation: wave 1s ease-in-out infinite;
}
.wave-bar:nth-child(1) { animation-delay: 0s; height: 20px; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; height: 32px; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; height: 40px; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; height: 32px; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; height: 20px; }

@keyframes wave {
  0%, 100% { transform: scaleY(0.6); }
  50% { transform: scaleY(1.4); }
}

# Ripple Effect

.ripple {
  position: absolute;
  border: 1px solid rgba(122, 92, 107, 0.3);
  border-radius: 50%;
  animation: ripple 3s linear infinite;
}
.ripple:nth-child(1) { animation-delay: 0s; }
.ripple:nth-child(2) { animation-delay: 1s; }
.ripple:nth-child(3) { animation-delay: 2s; }

@keyframes ripple {
  0% { width: 80px; height: 80px; opacity: 0.5; }
  100% { width: 200px; height: 200px; opacity: 0; }
}

const LiquidMic = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_center,_#FDF6ED_0%,_#F5E6C8_60%,_#F0DEC0_100%)]">
      
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Sound Wave */}
      <div className="flex items-center gap-1.5 mb-8">
        {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
          <div key={i} 
            className="w-1 bg-[#7A5C6B] rounded-full animate-wave"
            style={{ 
              height: [16, 28, 36, 28, 16][i],
              animationDelay: `${delay}s` 
            }} 
          />
        ))}
      </div>

      {/* Liquid Blob + Mic Container */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        
        {/* Ripple Rings */}
        {[0, 1.16, 2.32].map((delay, i) => (
          <div key={i} 
            className="absolute rounded-full border border-[#7A5C6B]/20 animate-ripple"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        {/* Gooey Blob Container */}
        <div className="absolute inset-0 flex items-center justify-center" 
             style={{ filter: 'url(#gooey)' }}>
          {[1, 2, 3].map((orb) => (
            <div key={orb} 
              className={`absolute w-16 h-16 bg-[#7A5C6B]/70 rounded-full animate-orbit${orb}`} 
            />
          ))}
        </div>

        {/* Mic Button */}
        <button className="relative z-10 w-22 h-22 bg-[#7A5C6B] rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(122,92,107,0.35)] animate-pulse-mic hover:scale-105 transition-transform">
          <Mic className="w-8 h-8 text-white" />
        </button>
      </div>

      <p className="mt-8 text-base font-medium text-[#9B7A8A] animate-pulse-text tracking-wide">
        Listening...
      </p>
    </div>
  );
};