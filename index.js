require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");
const parseString = require("xml2js").parseString;
const fs = require("fs");

// Body Parser Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"]
  })
);
// APIS
app.use("/api", require("./routes/apis/apis"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  // Load route configs
  loadRouteConfig();
});

loadRouteConfig = () => {
  axios
    .get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
    )
    .then(response => {
      parseString(response.data, (err, results) => {
        var newJSON = results.body.route;
        // Bus route list
        // var newJSON = json.slice(0, json.length);
        // Get bus route configurations
        for (let i = 0; i < newJSON.length; i++) {
          // For each route
          var element = newJSON[i].$.tag;
          var finalBusRouteConfiguration = [];
          axios
            .get(
              "http://localhost:5000/api/getRouteConfiguration/" +
                element +
                "?stopsOnly=false"
            )
            .then(configResponse => {
              let busRouteConfiguration = {};
              busRouteConfiguration[element] = configResponse.data;
              finalBusRouteConfiguration = [
                ...finalBusRouteConfiguration,
                busRouteConfiguration
              ];
              if (i == newJSON.length - 1) {
                // Route list containing all routes with configs however
                console.log("Done");
                fs.writeFile("routeconfig.json", JSON.stringify(finalBusRouteConfiguration), err => {
                    if (err) throw err;
                });
              }
            });
        }
      });
    });
};
