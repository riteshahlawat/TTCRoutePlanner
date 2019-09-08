const express = require("express");
const router = express.Router();
const axios = require("axios");
const parseString = require("xml2js").parseString;

router.get("/getAllRoutes/:endIndex", (req, res) => {
  axios
    .get(
      "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc"
    )
    .then(response => {
      parseString(response.data, (err, results) => {
        var json = results.body.route;
        var endIndex = req.params.endIndex;
        // Bus route list
        var newJSON = json.slice(0, endIndex);
        // Get bus route configurations
        for (let i = 0; i < newJSON.length; i++) {
          // For each route
          var element = newJSON[i].$.tag;
          var finalBusRouteConfiguration = [];
          axios
            .get("http://localhost:5000/api/getRouteConfiguration/" + element + "?stopsOnly=false")
            .then(configResponse => {
                let busRouteConfiguration = {};
                busRouteConfiguration[element] = configResponse.data;
                finalBusRouteConfiguration = [...finalBusRouteConfiguration, busRouteConfiguration];
                if(i==newJSON.length-1){
                  // Route list containing all routes with configs however
                  res.send(finalBusRouteConfiguration);

                }
            });
        }
      });
    });
});

router.get("/getRouteConfiguration/:routeTag", (req, res) => {
  if (req.query.stopsOnly !== "true" && req.query.stopsOnly !== "false") {
    res.send({ msg: "impoper use of stops only" });
  }
  axios
    .get(
      `http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=` +
        req.params.routeTag +
        "&terse"
    )
    .then(response => {
      parseString(response.data, (err, results) => {
        var stopsOnly = req.query.stopsOnly;
        if (stopsOnly === "true") {
          res.send(results.body.route[0].stop);
        } else {
          res.send(results.body.route[0].direction);
        }
      });
    });
});

module.exports = router;
