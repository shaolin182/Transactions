var express = require ("express");
var stats = require("./stats");
var bodyParser = require('body-parser');
var router = express.Router();

function handleResult(err, res, results) {
	if (err) next(err);

	res.send(results);
}

function handleMatchQuery (req, res, next) {
	var match = {};

	if (req.body && req.body.startDate) {
		if (match.date == undefined) {
			match.date = {};
		}
		match.date.$gt = new Date(req.body.startDate);
	}

	if (req.body && req.body.endDate) {
		if (match.date == undefined) {
			match.date = {};
		}
		match.date.$lt = new Date(req.body.endDate);	
	}

	req.body.match = match;
	next();
}

// Parsing request in json format
router.use(bodyParser.json());
router.use(handleMatchQuery);

router.post("/stats/totalCostByMonth", function (req, res, next) {
	stats.getTotalCostByMonth(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/totalCostByYear", function (req, res, next) {
	stats.getTotalCostByYear(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/totalCostByCategory", function (req, res, next) {
	stats.getTotalCostByCategory(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/totalCostByCategoryAndMonth", function (req, res, next) {
	stats.getTotalCostByCategoryAndMonth(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/totalCostByAccountAndMonth", function (req, res, next) {
	stats.getTotalCostByAccountAndMonth(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/stats/totalCostByCategoryAndYear", function (req, res, next) {
	stats.getTotalCostByCategoryAndYear(req.body.match, function (err, results) {
		handleResult(err, res, results);
	});
});

module.exports = router;