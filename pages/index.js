import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import cheerio from "cheerio";
import axios from "axios";
import { find } from "domutils";
import { VictoryBar, VictoryChart, VictoryLabel } from "victory";
import { VictoryBoxPlot } from "victory";

export default function Home(props) {
  console.log(props);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <VictoryChart domain={{ x: [props.result.length, 0], y: [0, 40] }}>
          {Object.values(props.result)
            .slice(0, 39)
            .map((key) => {
              return <VictoryBoxPlot horizontal boxWidth={5} />;
            })}
        </VictoryChart>
        <div>Last Scraped: {props.lastScraped}</div>
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
