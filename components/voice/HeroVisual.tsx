// Decorative animated background for the voice page: sound-wave bars,
// pulsing rings and a morphing orb. Purely visual — no state or logic.
export function HeroVisual() {
  // Bar heights and their staggered animation delays.
  const waveBars = [16, 28, 36, 28, 16];
  const waveDelays = [0, 0.1, 0.2, 0.3, 0.4];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center"
    >
      {/* Sound-wave bars */}
      <div className="mb-10 flex items-end gap-1.5">
        {waveBars.map((height, index) => (
          <div
            key={index}
            className="w-1 rounded-full bg-[#7A5C6B] animate-[wavebar_1.2s_ease-in-out_infinite]"
            style={{
              height,
              animationDelay: `${waveDelays[index]}s`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>

      {/* Pulsing rings + morphing orb */}
      <div className="relative w-44 h-44 lg:w-52 lg:h-52">
        {[0, 1.16, 2.32].map((delay) => (
          <div
            key={delay}
            className="absolute inset-0 m-auto w-40 h-40 rounded-full border border-[#7A5C6B]/20 animate-[ripple_3.5s_linear_infinite]"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
        <div className="absolute inset-0 rounded-full animate-morph bg-gradient-to-br from-[#7A5C6B] to-[#9B7A8A] opacity-80" />
      </div>
    </div>
  );
}
