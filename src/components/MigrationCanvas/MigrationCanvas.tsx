import { useRef } from "react";
import * as d3 from "d3";
import type { Country, MigrationFlowResponse } from "@/types/migration";
import { useWindowSize } from "@/hooks/use-window-size";
import { CountryColumn } from "./CountryColumn";
import "./MigrationCanvas.scss";

const ROW_HEIGHT = 28;
const TOP_MARGIN = 100;
const MAX_NODES = 150;

interface MigrationCanvasProps {
  leftNodes: Country[];
  rightNodes: Country[];
  selectedCountryCode: string | null;
  onSelectCountry: (code: string | null) => void;
  hoveredCountryCode: string | null;
  onHoverCountry: (code: string | null) => void;
  flowsData?: MigrationFlowResponse;
}

export function MigrationCanvas({
  leftNodes,
  rightNodes,
  selectedCountryCode,
  onSelectCountry,
  hoveredCountryCode,
  onHoverCountry,
  flowsData,
}: MigrationCanvasProps) {
  const { width } = useWindowSize();
  const svgRef = useRef<SVGSVGElement>(null);

  const leftX = Math.max(width * 0.1, 150);
  const rightX = Math.min(width * 0.9, width - 150);

  const visibleLeft = leftNodes.slice(0, MAX_NODES);
  const visibleRight = rightNodes.slice(0, MAX_NODES);

  const totalHeight =
    Math.max(visibleLeft.length, visibleRight.length) * ROW_HEIGHT +
    TOP_MARGIN * 2;

  const leftYMap = (() => {
    const map = new Map<string, number>();
    visibleLeft.forEach((node, i) =>
      map.set(node.code, i * ROW_HEIGHT + TOP_MARGIN),
    );
    return map;
  })();

  const rightYMap = (() => {
    const map = new Map<string, number>();
    visibleRight.forEach((node, i) =>
      map.set(node.code, i * ROW_HEIGHT + TOP_MARGIN),
    );
    return map;
  })();

  const paths = (() => {
    if (!flowsData || !selectedCountryCode) return [];

    const linkGenerator = d3
      .linkHorizontal()
      .x((d) => d[0])
      .y((d) => d[1]);

    const maxFlow = d3.max(flowsData.flows, (f) => f.value) || 1;
    const strokeScale = d3.scaleLinear().domain([0, maxFlow]).range([1, 20]);
    const opacityScale = d3.scaleLinear().domain([0, maxFlow]).range([0.15, 0.8]);

    const sortedFlows = [...flowsData.flows].sort((a, b) => a.value - b.value);

    return sortedFlows
      .map((flow) => {
        const isOutflow = flow.direction === "outflow";
        let sourcePt: [number, number] | null = null;
        let targetPt: [number, number] | null = null;

        if (isOutflow) {
          const sY = leftYMap.get(selectedCountryCode);
          const tY = rightYMap.get(flow.countryCode);
          if (sY !== undefined && tY !== undefined) {
            sourcePt = [leftX + 20, sY];
            targetPt = [rightX - 20, tY];
          }
        } else {
          const sY = leftYMap.get(flow.countryCode);
          const tY = rightYMap.get(selectedCountryCode);
          if (sY !== undefined && tY !== undefined) {
            sourcePt = [leftX + 20, sY];
            targetPt = [rightX - 20, tY];
          }
        }

        if (!sourcePt || !targetPt) return null;

        const pathData = linkGenerator({ source: sourcePt, target: targetPt }) || "";
        const isHovered =
          hoveredCountryCode === flow.countryCode ||
          hoveredCountryCode === selectedCountryCode;
        const baseOpacity = opacityScale(flow.value);
        const opacity = hoveredCountryCode
          ? isHovered
            ? Math.max(0.6, baseOpacity)
            : 0.05
          : baseOpacity;

        const color = isOutflow
          ? "var(--color-secondary)"
          : "var(--color-primary)";

        return {
          id: `${flow.countryCode}-${flow.direction}`,
          path: pathData,
          strokeWidth: strokeScale(flow.value),
          opacity,
          color,
          flow,
          isHovered,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      path: string;
      strokeWidth: number;
      opacity: number;
      color: string;
      flow: (typeof flowsData.flows)[number];
      isHovered: boolean;
    }>;
  })();

  return (
    <div className="canvas">
      <svg
        ref={svgRef}
        width="100%"
        height={totalHeight}
        className="canvas__svg"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {/* Flow Paths */}
        <g className="canvas__paths" style={{ mixBlendMode: "screen" }}>
            {paths.map((p) => (
              <path
                key={p.id}
                d={p.path}
                fill="none"
                stroke={p.color}
                strokeWidth={p.strokeWidth}
                strokeLinecap="round"
                className={`canvas__flow${p.isHovered ? " canvas__flow--glowing" : ""}`}
                onMouseEnter={() => onHoverCountry(p.flow.countryCode)}
                onMouseLeave={() => onHoverCountry(null)}
              />
            ))}
        </g>

        {/* Origins */}
        <CountryColumn
          nodes={visibleLeft}
          yMap={leftYMap}
          x={leftX}
          side="left"
          title="ORIGINS"
          selectedCountryCode={selectedCountryCode}
          onSelectCountry={onSelectCountry}
          hoveredCountryCode={hoveredCountryCode}
          onHoverCountry={onHoverCountry}
        />

        {/* Destinations */}
        <CountryColumn
          nodes={visibleRight}
          yMap={rightYMap}
          x={rightX}
          side="right"
          title="DESTINATIONS"
          selectedCountryCode={selectedCountryCode}
          onSelectCountry={onSelectCountry}
          hoveredCountryCode={hoveredCountryCode}
          onHoverCountry={onHoverCountry}
        />
      </svg>
    </div>
  );
}
