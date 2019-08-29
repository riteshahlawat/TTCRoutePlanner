const express = require("express");
const router = express.Router();
const axios = require("axios");
const parseString = require("xml2js").parseString;

router.get("/getAllRoutes/:endIndex", (req, res) => {
    axios.get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc")
        .then(response => {
            parseString(response.data, (err, results) => {
                var json = results.body.route;
                var endIndex = req.params.endIndex;
                var newJSON = json.slice(0, endIndex);
                res.send(newJSON);
            });
        });
});

module.exports = router;
