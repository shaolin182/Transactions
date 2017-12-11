var express = require ("express");
var categories = require("./categories");
var bodyParser = require('body-parser');
var router = express.Router();

function handleResult(err, res, results) {
	if (err) next(err);

    res.send(results);
}

// Parsing request in json format
router.use(bodyParser.json());

router.get("/categories", function (req, res, next) {
	categories.getAll(function (err, results) {
		handleResult(err, res, results);
	});
});

module.exports = router;