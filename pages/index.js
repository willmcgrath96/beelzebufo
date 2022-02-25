import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import cheerio from "cheerio";
import axios from "axios";
import { find } from "domutils";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
} from "victory";
import { VictoryBoxPlot } from "victory";
import _ from "lodash";
import { VictoryScatter } from "victory";

export default function Home(props) {
  let maxWorst = Math.max.apply(
    Math,
    Object.values(props.result.slice(0, 40)).map(function (o) {
      return o.worst;
    })
  );

  function roundUpNearest10(num) {
    return Math.ceil(num / 10) * 10;
  }

  function byTen(num) {
    if (num % 10 === 0) {
      return num;
    }
  }
  console.log(props.result);
  console.log(maxWorst);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chartBox}>
          <VictoryChart
            domain={{ x: [0, roundUpNearest10(maxWorst)], y: [42, 0] }}
            height={500}
            width={1000}
            style={{
              background: { fill: "#f8f9fa" },
            }}
            //animate={{ duration: 2000, easing: "quadInOut" }}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => byTen(t)}
              label="Expert Consensus Rank"
            />
            <VictoryAxis tickFormat={(t) => ""} label="Average Expert Rank" />
            <VictoryLabel
              text="Top 40 NBA Players Based on Consensus Ranking"
              x={500}
              y={30}
              textAnchor="middle"
            />
            {Object.values(props.result)
              .slice(0, 40)
              .map((key) => {
                if (key.avg < 10) {
                  return (
                    <VictoryScatter
                      size={2}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { fill: "red" } }}
                      animate={{
                        onEnter: {
                          duration: 500,
                          onLoad: { duration: 1000 },
                          before: () => ({ _x: 0 }),
                          after: (datum) => ({ _x: datum._x }),
                        },
                      }}
                    />
                  );
                } else if (key.avg < 20 && key.avg > 10) {
                  return (
                    <VictoryScatter
                      size={2}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { fill: "#f76707" } }}
                    />
                  );
                } else {
                  return (
                    <VictoryScatter
                      size={2}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { fill: "green" } }}
                    />
                  );
                }
              })}
            {Object.values(props.result)
              .slice(0, 40)
              .map((key) => {
                if (key.avg < 10) {
                  return (
                    <VictoryLine
                      size={1}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { stroke: "red" } }}
                      animate={{
                        onEnter: {
                          delay: 5000,
                          duration: 500,
                          before: () => ({ _x: 0 }),
                          after: (datum) => ({ _x: datum._x }),
                        },
                      }}
                    />
                  );
                } else if (key.avg < 20 && key.avg > 10) {
                  return (
                    <VictoryLine
                      size={1}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { stroke: "#f76707" } }}
                      animate={{
                        onEnter: {
                          duration: 500,
                          delay: 10000,
                          before: () => ({ _x: 0 }),
                          after: (datum) => ({ _x: datum._x }),
                        },
                      }}
                    />
                  );
                } else {
                  return (
                    <VictoryLine
                      size={1}
                      data={[
                        { x: key.best, y: key.rank },
                        { x: key.avg, y: key.rank },
                        { x: key.worst, y: key.rank },
                      ]}
                      style={{ data: { stroke: "green" } }}
                      animate={{
                        onEnter: {
                          duration: 500,
                          before: () => ({ _x: 0 }),
                          after: (datum) => ({ _x: datum._x }),
                        },
                      }}
                    />
                  );
                }
              })}
            {Object.values(props.result)
              .slice(0, 40)
              .map((key) => {
                if (key.avg < 10) {
                  return (
                    <VictoryScatter
                      size={3}
                      data={[{ x: key.avg, y: key.rank }]}
                      labels={key.name}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fontSize: 6, fill: "red" }]}
                          dx={62}
                          dy={2.8}
                        />
                      }
                    />
                  );
                } else if (key.avg < 20 && key.avg > 10) {
                  return (
                    <VictoryScatter
                      size={3}
                      data={[{ x: key.avg, y: key.rank }]}
                      labels={key.name}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fontSize: 6, fill: "#f76707" }]}
                          dx={62}
                          dy={2.8}
                        />
                      }
                    />
                  );
                } else {
                  return (
                    <VictoryScatter
                      size={3}
                      data={[{ x: key.avg, y: key.rank }]}
                      labels={key.name}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fontSize: 6, fill: "green" }]}
                          dx={62}
                          dy={2.8}
                        />
                      }
                    />
                  );
                }
              })}
          </VictoryChart>
          <div>Last Scraped: {props.lastScraped}</div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const nameSelector = "#data > tbody > tr > td.player-label";
  const rankSelector = "#data > tbody > tr > td:nth-child(1)";
  const bestSelector = "#data > tbody > tr > td:nth-child(3)";
  const worstSelector = "#data > tbody > tr > td:nth-child(4)";
  const avgSelector = "#data > tbody > tr > td:nth-child(5)";
  const { data } = await axios.get(
    "https://www.fantasypros.com/nba/rankings/ros-overall.php"
  );
  const $ = cheerio.load(data);
  let result = [];
  for (let i = 0; i < $(nameSelector).length; i++) {
    result.push({});
  }
  $(nameSelector).each((i, elem) => {
    result[i].name = $(elem).text();
  });
  $(rankSelector).each((i, elem) => {
    result[i].rank = $(elem).text();
  });
  $(bestSelector).each((i, elem) => {
    result[i].best = $(elem).text();
  });
  $(worstSelector).each((i, elem) => {
    result[i].worst = $(elem).text();
  });
  $(avgSelector).each((i, elem) => {
    result[i].avg = $(elem).text();
  });
  const lastScraped = new Date().toISOString();
  return {
    props: {
      result,
    },
    revalidate: 10,
  };
}
