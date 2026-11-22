/**
 * Subtle, premium week-complete celebration: soft confetti ribbons and a few
 * gentle sparkles. Pure CSS, no dependency, no noise.
 */
const PIECES = Array.from({ length: 18 }, (_, i) => i);
const COLORS = ["#4B5FE8", "#8B5CF6", "#10B981", "#F59E0B", "#38BDF8"];

export default function Celebration() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {PIECES.map((i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 5.5 + 3) % 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${(i % 6) * 0.35}s`,
            animationDuration: `${3.4 + (i % 4) * 0.5}s`,
          }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <span
          key={`s${i}`}
          className="celebration-sparkle"
          style={{
            left: `${18 + i * 22}%`,
            top: `${16 + (i % 2) * 40}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
