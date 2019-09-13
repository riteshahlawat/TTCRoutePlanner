const express = require("express");
const router = express.Router();
const axios = require("axios");
const parseString = require("xml2js").parseString;
const fs = require("fs");

// TODO: CREATE MIDDLEWARE TO STORE ROUTE CONFIG LOCALLY
router.get("/getAllRoutes/:endIndex", (req, res) => {
  fs.readFile("routeconfig.json", (err, data) => {
    if (err) throw err;
    let finalBusRouteConfig = JSON.parse(data);

    res.send(finalBusRouteConfig.slice(0, req.params.endIndex));
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
