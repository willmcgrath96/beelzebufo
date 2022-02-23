/*const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.fantasypros.com/nba/rankings/ros-overall.php";

const results = [];

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const statsTable = $("#data > tbody > tr");
    statsTable.each(function () {
      const name = $(this).find("td.player-label").text();
      const rank = $(this).find("td:nth-child(1)").text();
      const best = $(this).find("td:nth-child(3)").text();
      const worst = $(this).find("td:nth-child(4)").text();
      const avgRank = $(this).find("td:nth-child(5)").text();
      results.push({
        rank,
        name,
        best,
        worst,
        avgRank,
      });
    });
  })
  .catch(console.error);
export default results;*/
