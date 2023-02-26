const express = require("express");
var parseString = require('xml2js').parseString;
const axios = require('axios').default;

const app = express();

app.use((req, res, next) => {
  res.header({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store'
  });
  next();
});

const selectCity = (text) =>{
  let myCity = text.split(" ");
  myCity.splice(0,2);
  myCity.splice(myCity.length - 2, 2);
  myCity = myCity.toString();
  return myCity
};

const selectDetails = (text) =>{
  let myArray = text.split(" ");
  return myArray
};

app.get("/", (req, res) => {
  axios.get('http://koeri.boun.edu.tr/rss/')
  .then(function (response) {
    // handle success
    parseString(response.data, function (err, result) {
      
      let list = result.rss.channel[0].item;
      let earthquakeList = [];

      for(i = 0; i < list.length; i++){
        const city = selectCity(list[i].title[0]);
        const details = selectDetails(list[i].description[0]);

        const item = {
          city: city,
          date: details[0],
          time: details[1],
          magnitude: details[2],
          scale: details[3],
          lat: details[4],
          long: details[5],
          depth: details[6]
        };
        earthquakeList.push(item);
      };

      res.format({
        json: () => {
          res.send(earthquakeList);
        }
      });
    });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
    
});

app.listen(5000, () => {
	console.log("Server started at port 5000");
});

module.exports = app;