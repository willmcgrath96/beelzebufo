import React from "react";
import styles from "../styles/ScatterPlot.module.scss";
import { Circle, Line, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import {
  Tooltip,
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
} from "@visx/tooltip";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { extent } from "d3";
import { AnimatedAxis } from "@visx/xychart";
import { Text } from "@visx/text";
import { localPoint } from "@visx/event";

const background = "#f1f3f5";
const defaultMargin = { top: 80, left: 80, right: 80, bottom: 80 };

const ScatterPlot = ({
  width,
  height,
  data,
  worstCalc,
  event = false,
  margin = defaultMargin,
}) => {
  const getRank = (d) => d.rank;
  const getWorst = (d) => d.worst;
  const getAvg = (d) => d.avg;
  const getBest = (d) => d.best;
  const getName = (d) => d.name;

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip({ tooltipData: "Test" });

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum,
    });
  };

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "rgba(53,71,125,0.8)",
    color: "white",
    width: 152,
    height: 72,
    padding: 12,
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const worstScale = scaleLinear({
    domain: [0, worstCalc],
    range: [margin.left, innerWidth],
  });

  const rankScale = scaleLinear({
    domain: [41, 1],
    range: [innerHeight + margin.top, margin.top],
  });

  const legendScale = scaleOrdinal({
    domain: ["S Tier", "A Tier", "B Tier"],
    range: ["#f03e3e", "#4263eb", "#0ca678"],
  });

  let colors = (value) => {
    if (value < 10) {
      return "#f03e3e";
    } else if (value > 10 && value < 30) {
      return "#4263eb";
    } else {
      return "#0ca678";
    }
  };

  const legendGlyphSize = 15;

  let dataVals = Object.values(data);

  return width < 10 ? null : (
    <div style={{ position: "relative" }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          xScale={worstScale}
          yScale={rankScale}
          width={width}
          height={height}
          stroke="white"
          strokeOpacity={1}
        />
        <Group pointerEvents="none">
          {dataVals.map((key, i) => (
            <>
              <Circle
                key={i}
                cx={worstScale(getBest(key))}
                cy={rankScale(getRank(key))}
                r={3}
                fill={colors(getAvg(key))}
              />
              <Circle
                key={i + 2}
                cx={worstScale(getWorst(key))}
                cy={rankScale(getRank(key))}
                r={3}
                fill={colors(getAvg(key))}
              />
              <line
                className={styles.line1}
                x1={worstScale(getBest(key))}
                y1={rankScale(getRank(key))}
                x2={worstScale(getWorst(key))}
                y2={rankScale(getRank(key))}
                stroke={colors(getAvg(key))}
              />
              <Circle
                key={i + 1}
                cx={worstScale(getAvg(key))}
                cy={rankScale(getRank(key))}
                r={3}
                fill={"#495057"}
                onMouseOver={handleMouseOver}
                onMouseOut={hideTooltip}
              />
              <Text
                x={worstScale(getWorst(key))}
                y={rankScale(getRank(key))}
                fontSize={10}
                dx={6}
                dy={2}
                fill={colors(getAvg(key))}
              >
                {getName(key)}
              </Text>
            </>
          ))}
        </Group>
        <AxisBottom
          top={innerHeight + margin.top}
          scale={worstScale}
          numTicks={5}
          label="Average Expert Ranking"
          labelProps={() => ({
            fontSize: 20,
            textAnchor: "middle",
          })}
          labelOffset={30}
        />
        <AxisLeft
          scale={rankScale}
          left={margin.left}
          numTicks={4}
          label="Expert Consensus Rank"
          labelProps={() => ({
            fontSize: 20,
            textAnchor: "middle",
          })}
        />
      </svg>
      {tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          Data value <strong>{tooltipData}</strong>
        </TooltipInPortal>
      )}
      <LegendOrdinal
        scale={legendScale}
        labelFormat={(label) => `${label.toUpperCase()}`}
      >
        {(labels) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {labels.map((label, i) => (
              <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                <svg width={legendGlyphSize} height={legendGlyphSize}>
                  <rect
                    fill={label.value}
                    width={legendGlyphSize}
                    height={legendGlyphSize}
                  />
                </svg>
                <LegendLabel align="left" margin="0 0 0 4px">
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </div>
  );
};

export default ScatterPlot;
