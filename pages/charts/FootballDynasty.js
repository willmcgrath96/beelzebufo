import Papa from "papaparse";
import React from "react";

const FootballDynasty = () => {
  var data;

  Papa.parse("../public/FantasyPros_2022_Dynasty_OP_Rankings.csv", {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
      console.log(results);
      data = results.data;
    },
  });

  return console.log(data);
};

export default FootballDynasty;
