var express = require ("express");
var stats = require("./stats");
var bodyParser = require('body-parser');
var router = express.Router();

function handleResult(err, res, results) {
	if (err) next(err);

	res.send(results);
}

// Parsing request in json format
router.use(bodyParser.json());

router.get("/stats/totalCostByMonth", function (req, res, next) {
	stats.getTotalCostByMonth(function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/aggregateData", function (req, res, next) {
	stats.aggregateData(req.body.match, req.body.group, req.body.sort, function (err, results) {
		handleResult(err, res, results);
	});
});


module.exports = router;