const express = require("express");
const router = express.Router();
const axios = require("axios");
const parseString = require("xml2js").parseString;

router.get("/getAllRoutes", (req, res) => {
    axios.get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc")
        .then(response => {
            parseString(response.data, (err, results) => {
                res.send(results.body.route);
            });
        });
});

module.exports = router;
