import type { TriangleImageSpec } from "@/lib/types";

/**
 * Mock "photo" of a triangle post, rendered as an inline SVG scene.
 * Stands in for real photos until uploads land — swap this component for
 * <Image> then. Scenes are deterministic from the spec, so no network and
 * no layout shift.
 */
export default function TriangleImage({
  spec,
  title,
  className = "",
}: {
  spec: TriangleImageSpec;
  title: string;
  className?: string;
}) {
  const gradientId = `bg-${spec.scene}-${spec.from.slice(1)}-${spec.to.slice(1)}`;

  return (
    <svg
      viewBox="0 0 800 600"
      role="img"
      aria-label={title}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={spec.from} />
          <stop offset="100%" stopColor={spec.to} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#${gradientId})`} />
      <Scene spec={spec} />
    </svg>
  );
}

function Scene({ spec }: { spec: TriangleImageSpec }) {
  const { scene, accent } = spec;

  switch (scene) {
    case "mountain":
      return (
        <>
          <circle cx="640" cy="120" r="46" fill="#ffffff" opacity="0.75" />
          <polygon points="60,540 260,260 460,540" fill={accent} opacity="0.55" />
          <polygon points="240,540 480,150 720,540" fill={accent} />
          <polygon points="480,150 545,255 480,235 415,255" fill="#ffffff" opacity="0.9" />
          <rect y="540" width="800" height="60" fill="#000000" opacity="0.25" />
        </>
      );
    case "sign":
      return (
        <>
          <circle cx="150" cy="110" r="42" fill="#ffffff" opacity="0.8" />
          <rect x="388" y="330" width="24" height="230" rx="6" fill="#64748b" />
          <ellipse cx="400" cy="565" rx="120" ry="18" fill="#000000" opacity="0.15" />
          <polygon
            points="270,160 530,160 400,390"
            fill="#ffffff"
            stroke={accent}
            strokeWidth="40"
            strokeLinejoin="round"
          />
        </>
      );
    case "roof":
      return (
        <>
          <circle cx="130" cy="110" r="44" fill="#ffffff" opacity="0.8" />
          <rect x="255" y="330" width="290" height="210" fill="#fffbeb" />
          <rect x="370" y="420" width="70" height="120" fill={accent} opacity="0.8" />
          <rect x="290" y="370" width="55" height="55" fill={accent} opacity="0.35" />
          <polygon points="215,340 400,165 585,340" fill={accent} />
          <rect y="540" width="800" height="60" fill="#000000" opacity="0.15" />
        </>
      );
    case "sandwich":
      return (
        <>
          <ellipse cx="400" cy="490" rx="290" ry="52" fill="#ffffff" opacity="0.85" />
          <polygon points="170,460 470,460 470,220" fill="#fcd34d" stroke={accent} strokeWidth="14" strokeLinejoin="round" />
          <polygon points="330,480 630,480 630,240" fill="#fbbf24" stroke={accent} strokeWidth="14" strokeLinejoin="round" />
          <rect x="452" y="330" width="18" height="40" fill={accent} opacity="0.6" />
        </>
      );
    case "pyramid":
      return (
        <>
          <circle cx="660" cy="110" r="48" fill="#ffffff" opacity="0.85" />
          <rect y="480" width="800" height="120" fill="#000000" opacity="0.18" />
          <polygon points="400,140 680,480 120,480" fill={accent} />
          <polygon points="400,140 680,480 400,480" fill="#000000" opacity="0.28" />
        </>
      );
    case "sail":
      return (
        <>
          <circle cx="140" cy="120" r="40" fill="#ffffff" opacity="0.85" />
          <rect y="430" width="800" height="170" fill="#0e7490" opacity="0.55" />
          <polygon points="260,470 560,470 515,525 305,525" fill="#334155" />
          <rect x="396" y="170" width="8" height="300" fill="#334155" />
          <polygon points="412,185 412,455 585,455" fill={accent} />
          <polygon points="388,215 388,455 245,455" fill={accent} opacity="0.75" />
        </>
      );
    case "pizza":
      return (
        <>
          <polygon points="400,530 255,170 545,170" fill="#fbbf24" />
          <path d="M 250 175 Q 400 100 550 175 L 528 215 Q 400 150 272 215 Z" fill="#d97706" />
          <circle cx="355" cy="265" r="30" fill={accent} />
          <circle cx="445" cy="265" r="30" fill={accent} />
          <circle cx="400" cy="360" r="30" fill={accent} />
        </>
      );
    case "tent":
      return (
        <>
          <circle cx="650" cy="100" r="36" fill="#fef9c3" opacity="0.9" />
          <circle cx="180" cy="90" r="3" fill="#ffffff" />
          <circle cx="260" cy="150" r="2.5" fill="#ffffff" />
          <circle cx="450" cy="80" r="2.5" fill="#ffffff" />
          <circle cx="540" cy="140" r="3" fill="#ffffff" />
          <circle cx="90" cy="180" r="2" fill="#ffffff" />
          <rect y="500" width="800" height="100" fill="#000000" opacity="0.35" />
          <polygon points="400,175 630,500 170,500" fill={accent} />
          <polygon points="400,290 465,500 335,500" fill="#000000" opacity="0.35" />
        </>
      );
    case "chip":
      return (
        <>
          <ellipse cx="400" cy="500" rx="250" ry="34" fill="#000000" opacity="0.1" />
          <polygon
            points="400,150 645,480 155,480"
            fill="#f59e0b"
            stroke={accent}
            strokeWidth="16"
            strokeLinejoin="round"
          />
          <circle cx="380" cy="280" r="6" fill="#ffffff" opacity="0.9" />
          <circle cx="450" cy="360" r="5" fill="#ffffff" opacity="0.9" />
          <circle cx="330" cy="400" r="5" fill="#ffffff" opacity="0.9" />
          <circle cx="415" cy="430" r="4" fill="#ffffff" opacity="0.9" />
          <circle cx="360" cy="330" r="4" fill="#ffffff" opacity="0.9" />
        </>
      );
    case "stairs":
      return (
        <>
          <polygon points="170,490 630,490 630,150" fill={accent} opacity="0.25" />
          <path
            d="M 170 490 L 285 490 L 285 405 L 400 405 L 400 320 L 515 320 L 515 235 L 630 235 L 630 150 L 630 490 Z"
            fill={accent}
          />
          <line x1="170" y1="470" x2="610" y2="145" stroke="#ffffff" strokeWidth="10" opacity="0.6" />
          <rect y="490" width="800" height="110" fill="#000000" opacity="0.15" />
        </>
      );
  }
}
