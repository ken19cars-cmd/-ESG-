import type { FloorPlan, RenderView, SitePhoto } from "@/lib/project-case";

const toneFill = {
  room: "#f7f1e6",
  core: "#d9e4df",
  public: "#e7f0ea",
  service: "#efe4d4",
} as const;

export function SiteDiagram() {
  return (
    <svg viewBox="0 0 560 380" className="h-auto w-full" role="img" aria-label="基地位置示意">
      <rect width="560" height="380" fill="#f7f3eb" />
      <rect x="0" y="156" width="560" height="54" fill="#d7d0c4" />
      <rect x="250" y="0" width="48" height="380" fill="#d7d0c4" />
      <text x="18" y="186" fill="#5c5348" fontSize="13">
        文化路一段
      </text>
      <text x="268" y="28" fill="#5c5348" fontSize="13" transform="rotate(90 268 28)">
        民生路
      </text>
      <rect x="40" y="40" width="180" height="90" fill="#e6e0d6" stroke="#b7ad9f" />
      <rect x="330" y="36" width="150" height="96" fill="#e6e0d6" stroke="#b7ad9f" />
      <rect x="48" y="230" width="170" height="110" fill="#e6e0d6" stroke="#b7ad9f" />
      <polygon
        points="318,230 520,230 520,348 360,348 318,300"
        fill="#dce8e2"
        stroke="#1e4d40"
        strokeWidth="3"
      />
      <text x="360" y="286" fill="#1e4d40" fontSize="16" fontWeight="700">
        本案基地
      </text>
      <text x="360" y="308" fill="#3d5c50" fontSize="12">
        3,286 m²
      </text>
      <circle cx="300" cy="214" r="16" fill="#9a6b3f" />
      <text x="322" y="218" fill="#6b4424" fontSize="12">
        捷運文化站 2 號出口
      </text>
      <polygon points="500,28 512,58 488,58" fill="#1a2332" />
      <text x="478" y="74" fill="#1a2332" fontSize="12">
        北
      </text>
    </svg>
  );
}

export function FloorPlate({ plan }: { plan: FloorPlan }) {
  return (
    <svg viewBox="0 0 640 440" className="h-auto w-full" role="img" aria-label={plan.name}>
      <rect width="640" height="440" fill="#fbf8f2" />
      <rect x="24" y="24" width="592" height="392" fill="none" stroke="#1e4d40" strokeWidth="3" />
      {plan.rooms.map((room) => (
        <g key={room.label}>
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            fill={toneFill[room.tone]}
            stroke="#1a2332"
            strokeWidth="1.4"
          />
          <text
            x={room.x + room.w / 2}
            y={room.y + room.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1a2332"
            fontSize="14"
          >
            {room.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Massing({ view }: { view: RenderView }) {
  const night = view.variant === "night";
  const sky = night ? "#1b2430" : view.variant === "street" ? "#efe6d6" : "#d7ebe4";
  const tower = night ? "#314155" : "#efe8dc";
  const podium = night ? "#243246" : "#c9ddd4";
  const glass = night ? "#f0c987" : "#8fb8c9";

  return (
    <svg viewBox="0 0 720 460" className="h-auto w-full" role="img" aria-label={view.name}>
      <rect width="720" height="460" fill={sky} />
      {night ? (
        <>
          <circle cx="590" cy="70" r="28" fill="#f4e2b5" />
          <rect x="0" y="300" width="720" height="160" fill="#121820" />
        </>
      ) : (
        <rect x="0" y="300" width="720" height="160" fill="#e4d3b4" />
      )}
      <polygon points="80,300 250,250 430,300 250,340" fill={podium} stroke="#1a2332" />
      <polygon points="250,250 470,230 640,290 430,300" fill={night ? "#1c2c3d" : "#b7cfc4"} stroke="#1a2332" />
      <polygon points="250,250 310,120 390,108 330,236" fill={tower} stroke="#1a2332" />
      <polygon points="310,120 470,104 500,230 390,108" fill={night ? "#3c5168" : "#e7dccb"} stroke="#1a2332" />
      {Array.from({ length: 8 }).map((_, index) => (
        <rect
          key={index}
          x={328}
          y={132 + index * 14}
          width="46"
          height="7"
          fill={glass}
        />
      ))}
      {view.variant === "court" ? (
        <>
          <ellipse cx="180" cy="330" rx="70" ry="22" fill="#7ea18d" />
          <text x="146" y="334" fill="#16362d" fontSize="13">
            廣場
          </text>
        </>
      ) : null}
      {view.variant === "street" ? (
        <text x="40" y="40" fill="#1a2332" fontSize="16">
          騎樓連續 · 人行淨寬 1.5 m
        </text>
      ) : (
        <text x="40" y="40" fill={night ? "#f4efe4" : "#1a2332"} fontSize="16">
          {view.name}
        </text>
      )}
      <text x="40" y="430" fill={night ? "#d9d0c3" : "#3e4a44"} fontSize="14">
        {view.caption}
      </text>
    </svg>
  );
}

const photoPalette = {
  excavate: ["#c4b49a", "#8d775c"],
  foundation: ["#b7c3c0", "#60706c"],
  rebar: ["#d7d0c4", "#8a6244"],
  deck: ["#d5ddd8", "#1e4d40"],
  facade: ["#eadfce", "#9a6b3f"],
  street: ["#e6e0d4", "#5c5348"],
} as const;

export function PhotoSketch({
  variant,
  title,
}: {
  variant: SitePhoto["variant"];
  title: string;
}) {
  const [ground, accent] = photoPalette[variant];
  return (
    <svg viewBox="0 0 640 400" className="h-auto w-full" role="img" aria-label={title}>
      <rect width="640" height="400" fill="#c9d7e2" />
      <rect x="0" y="250" width="640" height="150" fill={ground} />
      <rect x="70" y="80" width="220" height="180" fill="#f4f0e8" stroke="#1a2332" />
      <rect x="300" y="40" width="250" height="220" fill={accent} opacity="0.85" />
      <rect x="330" y="70" width="190" height="12" fill="#f7f3eb" />
      <rect x="330" y="98" width="190" height="12" fill="#f7f3eb" />
      <rect x="330" y="126" width="190" height="12" fill="#f7f3eb" />
      <polygon points="40,250 110,160 160,250" fill="#9a6b3f" />
      <rect x="150" y="210" width="70" height="40" fill="#1a2332" />
      <text x="24" y="372" fill="#1a2332" fontSize="20">
        {title}
      </text>
    </svg>
  );
}

export function CameraFrame({
  name,
  live,
  clock,
}: {
  name: string;
  live: boolean;
  clock: string;
}) {
  return (
    <svg viewBox="0 0 640 360" className="h-auto w-full" role="img" aria-label={`${name}畫面`}>
      <rect width="640" height="360" fill={live ? "#20262c" : "#3a4046"} />
      <rect x="0" y="230" width="640" height="130" fill="#3d342c" />
      <rect x="80" y="70" width="180" height="170" fill="#6e6256" />
      <rect x="280" y="30" width="220" height="210" fill="#8d8172" />
      <rect x="300" y="50" width="180" height="10" fill="#d9cbb6" />
      <rect x="300" y="72" width="180" height="10" fill="#d9cbb6" />
      <rect x="300" y="94" width="180" height="10" fill="#d9cbb6" />
      <polygon points="30,240 90,150 140,240" fill="#c4552a" />
      <rect x="20" y="16" width="150" height="28" rx="4" fill="#111" opacity="0.72" />
      <circle cx="36" cy="30" r="5" fill={live ? "#ff5a4a" : "#888"} />
      <text x="48" y="35" fill="#fff" fontSize="14">
        {live ? "LIVE" : "檢修"}
      </text>
      <text x="20" y="340" fill="#f4efe6" fontSize="16">
        {name} · {clock || "—"}
      </text>
    </svg>
  );
}
