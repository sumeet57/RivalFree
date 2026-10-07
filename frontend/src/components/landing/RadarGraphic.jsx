// The hero visual: rivals cluster on one side, the radar finds the empty space.
const rivals = [
  { x: 120, y: 120 }, { x: 165, y: 85 }, { x: 95, y: 195 },
  { x: 150, y: 170 }, { x: 215, y: 130 }, { x: 110, y: 270 }, { x: 175, y: 300 },
];

export default function RadarGraphic() {
  return (
    <figure className="mx-auto w-full max-w-md">
      <div className="relative aspect-square overflow-hidden rounded-full bg-console shadow-[0_0_80px_rgb(13_122_134/0.25)]">
        <svg viewBox="0 0 400 400" className="absolute inset-0" role="img" aria-label="Radar showing seven rivals and one open feature void">
          {[60, 110, 160, 198].map((r) => (
            <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#2dd4bf" strokeOpacity="0.18" />
          ))}
          <line x1="200" y1="2" x2="200" y2="398" stroke="#2dd4bf" strokeOpacity="0.12" />
          <line x1="2" y1="200" x2="398" y2="200" stroke="#2dd4bf" strokeOpacity="0.12" />

          {rivals.map((p, i) => (
            <circle key={i} className="blip" style={{ animationDelay: `${i * 0.4}s` }} cx={p.x} cy={p.y} r="5" fill="#5eead4" />
          ))}

          <circle className="void-ring" cx="290" cy="285" r="50" fill="#2dd4bf" fillOpacity="0.1" stroke="#5eead4" strokeDasharray="5 5" />
          <text x="290" y="289" textAnchor="middle" fill="#99f6e4" fontSize="12" fontFamily="JetBrains Mono, monospace">
            feature void
          </text>
        </svg>
        <div className="radar-sweep absolute inset-0 rounded-full" />
      </div>
      <figcaption className="mt-4 text-center font-mono text-xs text-muted">
        7 rivals mapped, 1 open space found
      </figcaption>
    </figure>
  );
}
