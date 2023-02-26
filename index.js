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

app.get("/", (req, res) => {
  axios.get('http://koeri.boun.edu.tr/rss/')
  .then(function (response) {
    // handle success
    parseString(response.data, function (err, result) {
      res.format({
        json: () => {
          res.send(result.rss.channel[0].item);
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