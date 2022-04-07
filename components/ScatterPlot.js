import React from "react";
import styles from "../styles/ScatterPlot.module.scss";
import { Circle, Line, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { extent } from "d3";
import { AnimatedAxis } from "@visx/xychart";
import { Text } from "@visx/text";
import { localPoint } from "@visx/event";
import { create, sortedLastIndex } from "lodash";

const background = "#f1f3f5";
const defaultMargin = { top: 80, left: 80, right: 80, bottom: 80 };

const legendStyles = {
  display: "flex",
  minWidth: 230,
  backgroundColor: "white",
  color: "#282828",
  fontSize: 12,
  position: "absolute",
  top: 10,
  left: 5,
  boxShadow: "2px 2px 5px #ccd3de",
};

const ScatterPlot = ({
  width,
  height,
  data,
  title,
  playerImgs,
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
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum,
    });
  };

  function createToolTip(item) {
    return (
      <>
        <h3>{getName(item)}</h3>
        <p>
          Avg Rank: {getAvg(item)}
          <br />
          Best Rank: {getBest(item)}
          <br />
          Worst Rank: {getWorst(item)}
        </p>
      </>
    );
  }

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "rgba(53,71,125,0.8)",
    color: "white",
    width: 250,
    height: 125,
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
    domain: ["S Tier", "A Tier", "B Tier", "C Tier", "D Tier"],
    range: ["#ff6b6b", "#91a7ff", "#63e6be", "#ffc078", "#66d9e8"],
  });

  let colors = (value) => {
    if (value < 8) {
      return "#ff6b6b";
    } else if (value > 8 && value < 16) {
      return "#91a7ff";
    } else if (value > 16 && value < 24) {
      return "#63e6be";
    } else if (value > 24 && value < 32) {
      return "#ffc078";
    } else {
      return "#66d9e8";
    }
  };

  const legendGlyphSize = 15;

  let dataVals = Object.values(data);
  let tooltipTimeout;

  return width < 10 ? null : (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Text>{title}</Text>
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
        <Group>
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
                onClick={() => {
                  if (event) alert(`Clicked: ${JSON.stringify(bar)}`);
                }}
                onMouseLeave={hideTooltip}
                onMouseOver={(event) => {
                  handleMouseOver(event, createToolTip(key));
                }}
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
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 + 25,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: 14,
          right: margin.right - 350,
        }}
      >
        <LegendOrdinal
          scale={legendScale}
          labelFormat={(label) => `${label.toUpperCase()}`}
          style={legendStyles}
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
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <strong>{tooltipData}</strong>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default ScatterPlot;
