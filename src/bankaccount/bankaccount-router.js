var express = require ("express");
var bankaccount = require("./bankaccount");
var bodyParser = require('body-parser');
var router = express.Router();

function handleResult(err, res, results) {
	if (err) next(err);

	res.send(results);
}

// Parsing request in json format
router.use(bodyParser.json());

router.get("/bankaccount", function (req, res, next) {
	bankaccount.getAll(function (err, results) {
		handleResult(err, res, results);
	});
});

router.get("/bankaccount/total", function (req, res, next) {
	bankaccount.getBankAccountTotal(function (err, results) {
		handleResult(err, res, results);
	});
});

router.get("/bankaccount/totalCategory", function (req, res, next) {
	bankaccount.getBankAccountCategoryTotal(function (err, results) {
		handleResult(err, res, results);
	});
});

module.exports = router;