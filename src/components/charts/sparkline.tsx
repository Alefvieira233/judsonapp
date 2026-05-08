/**
 * Sparkline SVG inline — sem lib de chart, sem JS no bundle do cliente.
 * Renderiza 100% server-side; o SVG vai direto no HTML do server component.
 * Pequena por design: só traça polyline + área. Pra ver detalhes / tooltip
 * use <LineChart /> do diretório charts.
 */

export type SparklinePoint = { value: number };

type Props = {
  points: SparklinePoint[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
  area?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function Sparkline({
  points,
  width = 60,
  height = 16,
  strokeWidth = 1.5,
  color = "var(--brand-primary)",
  area = true,
  className,
  ariaLabel,
}: Props) {
  const pad = strokeWidth;
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);

  if (points.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        role="img"
        aria-label={ariaLabel ?? "Sem dados"}
      >
        <line
          x1={pad}
          y1={height / 2}
          x2={width - pad}
          y2={height / 2}
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1}
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  const max = Math.max(1, ...points.map((p) => p.value));
  const min = 0;
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x =
      points.length === 1
        ? width / 2
        : pad + (i / (points.length - 1)) * innerW;
    const y = pad + innerH - ((p.value - min) / range) * innerH;
    return { x, y };
  });

  const linePath =
    "M " +
    coords
      .map((c) => `${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
      .join(" L ");

  const areaPath = `${linePath} L ${coords[coords.length - 1]!.x.toFixed(2)} ${
    height - pad
  } L ${coords[0]!.x.toFixed(2)} ${height - pad} Z`;

  const last = coords[coords.length - 1]!;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={
        ariaLabel ??
        `Evolução: ${points.map((p) => p.value).join(", ")}`
      }
    >
      {area ? (
        <path d={areaPath} fill={color} opacity={0.18} />
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r={strokeWidth + 0.5} fill={color} />
    </svg>
  );
}
