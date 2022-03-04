import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import cheerio from "cheerio";
import axios from "axios";
import ScatterPlot from "../components/ScatterPlot";
import { Grid } from "@visx/grid";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import reactSpring from "react-spring";

export default function Home(props) {
  let avgOfAvg = Object.values(props.result.slice(0, 40)).map((key) => {
    let initialValue = 0;
    let arr = [];
    arr.push(key.avg);
    let addedArr = arr.reduce((a, b) => a + b, initialValue);
    return addedArr / 40;
  });

  function roundUpNearest10(num) {
    return Math.ceil(num / 10) * 10;
  }

  let myPlayers = props.result.slice(0, 40);

  function pushToWorstArr(arr) {
    Object.values(myPlayers).map((key) => {
      arr.push(key.worst);
    });
  }

  let maxWorst = Math.max.apply(
    Math,
    Object.values(myPlayers).map(function (o) {
      return o.worst;
    })
  );

  let maxWorstCalc = roundUpNearest10(maxWorst);

  let worstSortArr = [];
  pushToWorstArr(worstSortArr);
  worstSortArr.sort((a, b) => a - b);

  let worstArr = [];
  for (let i = 0; i < worstSortArr.length; i++) {
    worstArr.push({ worstSort: worstSortArr[i] });
  }

  let maxRank = Math.max.apply(
    Math,
    Object.values(myPlayers).map(function (o) {
      return o.rank;
    })
  );

  function byTen(num) {
    if (num % 10 === 0) {
      return num;
    }
  }

  const mergedPlayers = worstArr.map((item, i) =>
    Object.assign({}, item, myPlayers[i])
  );

  console.log(mergedPlayers);

  const accessors = {
    rankaccessor: mergedPlayers.rank,
    nameaccessor: mergedPlayers.name,
    bestaccessor: mergedPlayers.best,
    worstaccessor: mergedPlayers.worst,
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chartBox}>
          <ScatterPlot
            width={800}
            height={600}
            data={myPlayers}
            worstCalc={maxWorstCalc}
          />
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
