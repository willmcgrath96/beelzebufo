import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import cheerio from "cheerio";
import axios from "axios";
import ScatterPlot from "../components/ScatterPlot";

export default function Home(props) {
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

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chartBox}>
          <ScatterPlot
            width={1000}
            height={800}
            data={myPlayers}
            worstCalc={maxWorstCalc}
          />
          <div>Data Last Retrieved At: {props.lastScraped}</div>
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
  const lastScraped = new Date().toLocaleString();
  return {
    props: {
      result,
      lastScraped,
    },
    revalidate: 10,
  };
}
