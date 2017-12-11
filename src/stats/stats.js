var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

var getTotalCostByMonth = function (done) {

	var group = {
		_id: {
			year : { $year: "$date" },        
			month : { $month: "$date" },        
		},
		costByMonth: { $sum: "$cost" }
	}

	var sort = {"_id.year":1, "_id.month":1};

	var match = {};

	aggregateData(match, group, sort, done);
}

/**
* Request database instance	for retrieving aggregating data
*/
var aggregateData = function (match, group, sort, done) {

	if (match && match.date && match.date.$gt) {
		match.date.$gt = new Date(match.date.$gt);
	}
	

	if (match && match.date && match.date.$lt) {
		match.date.$lt = new Date(match.date.$lt);	
	}
	

	transactions.aggregate([
		{ $match : match},
		{ $group : group},
		{ $sort : sort}
		])
	.then(function(results){
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

exports.getTotalCostByMonth = getTotalCostByMonth;
exports.aggregateData = aggregateData;

