/**
 * Decorative animated background for the voice page:
 *  - Sound-wave bars (5 bars with staggered heights + delays)
 *  - Pulsing ripple rings
 *  - A morphing gradient orb
 *
 * Purely visual — no state, no logic. Marked `aria-hidden` so screen readers
 * skip this section and users don't hear "div, div, div, …".
 */
export function HeroVisual() {
  // Bar heights: tall in the centre, short on the edges (waveform shape).
  const waveBars = [16, 28, 36, 28, 16];
  // Each bar is delayed by 0.1s from the previous one.
  const waveDelays = [0, 0.1, 0.2, 0.3, 0.4];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center"
    >
      {/* ─── Sound-wave bars ─── */}
      <div className="mb-10 flex items-end gap-1.5">
        {waveBars.map((height, index) => (
          <div
            key={index}
            className="h-4 w-1 animate-[wavebar_1.2s_ease-in-out_infinite] rounded-full bg-accent-mauve"
            style={{
              height,
              animationDelay: `${waveDelays[index]}s`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>

      {/* ─── Ripple rings + morphing orb ─── */}
      <div className="relative h-44 w-44 lg:h-52 lg:w-52">
        {/* Three expanding rings, staggered by 1.16s each. */}
        {[0, 1.16, 2.32].map((delay) => (
          <div
            key={delay}
            className="absolute inset-0 m-auto h-40 w-40 animate-[ripple_3.5s_linear_infinite] rounded-full border border-accent-mauve/20"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        {/* The gooey gradient centre orb (morphs its border-radius via the
            `morph` keyframe defined in globals.css). */}
        <div className="absolute inset-0 animate-morph rounded-full bg-gradient-to-br from-accent-mauve to-dusty-mauve opacity-80" />
      </div>
    </div>
  );
}