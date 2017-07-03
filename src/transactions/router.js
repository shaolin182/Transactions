var express = require ("express");
var transactions = require("./transactions");
var bodyParser = require('body-parser');
var router = express.Router();

function handleResult(err, res, results) {

	if (err) next(err);

	res.send(results);
}

// Parsing request in json format
router.use(bodyParser.json());

router.get("/transactions/:id", function (req, res, next) {
	console.log('get');
	transactions.get(req.params.id, function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/transactions", function (req, res, next) {
	console.log('add');
	transactions.add(req.body, function (err, results) {
		handleResult(err, res, results);
	});
});

router.get("/transactions", function (req, res, next) {
	console.log('getAll');
	transactions.getAll(function (err, results) {
		handleResult(err, res, results);
	});
});

router.post("/transactions/:id", function (req, res, next) {
	console.log('update');
	transactions.update(req.body, function (err, results) {
		handleResult(err, res, results);
	});
})

router.delete("/transactions/:id", function (req, res, next) {
	console.log('remove');
	transactions.remove(req.params.id, function (err, results) {
		handleResult(err, res, results);
	});
});

module.exports = router;