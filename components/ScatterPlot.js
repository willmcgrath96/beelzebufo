import React from "react";
import styles from "../styles/ScatterPlot.module.scss";
import { Circle, Line, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";
import { extent } from "d3";
import { AnimatedAxis } from "@visx/xychart";

const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple3 = "#a44afe";
const background = "#eaedff";
const defaultMargin = { top: 30, left: 60, right: 40, bottom: 40 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

const ScatterPlot = ({
  width,
  height,
  data,
  worstCalc,
  event = false,
  margin = defaultMargin,
}) => {
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    hideTooltip,
    showTooltip,
    tooltipData,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();
  const getRank = (d) => d.rank;
  const getWorst = (d) => d.worst;
  const getAvg = (d) => d.avg;
  const getBest = (d) => d.best;
  const getName = (d) => d.name;

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const worstScale = scaleLinear({
    domain: [0, worstCalc],
    range: [margin.left, innerWidth + margin.left],
  });

  const rankScale = scaleLinear({
    domain: [41, 1],
    range: [innerHeight + margin.top, margin.top],
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

  let dataVals = Object.values(data);
  console.log(dataVals.map((key) => worstScale(getBest(key))));

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
          top={margin.top}
          left={margin.left}
          xScale={worstScale}
          yScale={rankScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
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
                key={i + 1}
                cx={worstScale(getAvg(key))}
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
            </>
          ))}
        </Group>
        <AxisBottom
          top={innerHeight + margin.top}
          scale={worstScale}
          numTicks={5}
        />
        <AxisLeft scale={rankScale} left={margin.left} numTicks={4} />
      </svg>
    </div>
  );
};

export default ScatterPlot;
