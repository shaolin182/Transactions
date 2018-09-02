var express = require ("express");
var transactions = require("./transactions");
var bodyParser = require('body-parser');
var router = express.Router();
var validator = require("./transactions-validator");

function handleResult(err, res, results) {

	if (err) next(err);

	res.send(results);
}

// Parsing request in json format
router.use(bodyParser.json());

// Handle HTTP request GET /transactions/:id for retrieving one transaction
router.get("/transactions/:id", function (req, res, next) {
	transactions.get(req.params.id, function(err, results) {
		handleResult(err, res, results);
	});
});

// Handle HTTP request POST /transactions for adding new transaction
router.post("/transactions", function (req, res, next) {
	validator.validateAndTransform(req.body);
	transactions.add(req.body, function (err, results) {
		handleResult(err, res, results);
	});
});

// Handle HTTP request GET /transactions for retrieving all transactions
router.get("/transactions", function (req, res, next) {
	transactions.getAll(function (err, results) {
		handleResult(err, res, results);
	});
});

// Handle HTTP request PUT /transactions/:id for updating a transaction
router.post("/transactions/:id", function (req, res, next) {
	validator.validateAndTransform(req.body);
	transactions.update(req.params.id, req.body, function (err, results) {
		handleResult(err, res, results);
	});
})

// Handle HTTP request DELETE /transactions/:id for removing a transaction
router.delete("/transactions/:id", function (req, res, next) {
	transactions.remove(req.params.id, function (err, results) {
		handleResult(err, res, results);
	});
});

module.exports = router;