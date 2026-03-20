import type { Country } from "@/types/migration";

const TOP_MARGIN = 100;

interface CountryColumnProps {
  nodes: Country[];
  yMap: Map<string, number>;
  x: number;
  side: "left" | "right";
  title: string;
  selectedCountryCode: string | null;
  onSelectCountry: (code: string | null) => void;
  hoveredCountryCode: string | null;
  onHoverCountry: (code: string | null) => void;
}

export function CountryColumn({
  nodes,
  yMap,
  x,
  side,
  title,
  selectedCountryCode,
  onSelectCountry,
  hoveredCountryCode,
  onHoverCountry,
}: CountryColumnProps) {
  const isLeft = side === "left";
  const textAnchor = isLeft ? "end" : "start";
  const labelX = isLeft ? "-10" : "10";
  const statX = isLeft ? "-200" : "200";
  const flowType = isLeft ? "outflow" : "inflow";
  const statField = isLeft ? "totalEmigrants" : "totalImmigrants";

  return (
    <g transform={`translate(${x}, 0)`}>
      <text
        y={TOP_MARGIN - 40}
        textAnchor={textAnchor}
        className="canvas__column-title"
      >
        {title}
      </text>
      <text
        y={TOP_MARGIN - 20}
        textAnchor={textAnchor}
        className="canvas__column-subtitle"
      >
        Alphabetical
      </text>

      {nodes.map((node) => {
        const isSelected = selectedCountryCode === node.code;
        const isHovered = hoveredCountryCode === node.code;
        const isActive = isSelected || isHovered;

        return (
          <g
            key={`${side}-${node.code}`}
            transform={`translate(0, ${yMap.get(node.code)})`}
            className="canvas__node"
            onClick={() =>
              onSelectCountry(isSelected ? null : node.code)
            }
            onMouseEnter={() => onHoverCountry(node.code)}
            onMouseLeave={() => onHoverCountry(null)}
          >
            <text
              x={labelX}
              y="5"
              textAnchor={textAnchor}
              className={`canvas__label${isActive ? " canvas__label--active" : ""}${selectedCountryCode && !isActive ? " canvas__label--faded" : ""}`}
            >
              {node.name}
            </text>
            <text
              x={statX}
              y="5"
              textAnchor={textAnchor}
              className={`canvas__stat canvas__stat--${flowType}${isActive ? " canvas__stat--visible" : ""}`}
            >
              {node[statField]}
            </text>
            <circle
              cx="0"
              cy="0"
              r={isActive ? 5 : 3}
              className={`canvas__dot${isActive ? ` canvas__dot--${flowType}` : ""}`}
            />
          </g>
        );
      })}
    </g>
  );
}
