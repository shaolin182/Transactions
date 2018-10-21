var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

const sortedByYearAndMonth = {"_id.year":1, "_id.month":1};
const sortedByYear = {"_id.year":1};
const sortedByID = {"_id":1};
const sortedbyTotal = {"total":1}

/*
For each month, return the sum of 'cost' property
 */
var getTotalCostByMonth = function (match, done) {
	const group = {
		_id: {
			year : { $year: "$date" },        
			month : { $month: "$date" },        
		},
		total: { $sum: "$cost" }
	}

	aggregateData(match, group, sortedByYearAndMonth, done);
};

/*
For each year, return the sum of 'cost' property
 */
var getTotalCostByYear = function (match, done) {
	const group = {
		_id: {
			year : { $year: "$date" },        
		},
		total : { $sum: "$cost" }
	}

	aggregateData(match, group, sortedByYear, done);
};

/*
For each category, return the sum of 'cost' property
 */
var getTotalCostByCategory = function (match, done) {
	const group = {
		_id: "$category.category",
		total: { $sum: "$cost" }
	}

	aggregateData(match, group, sortedbyTotal, done);
};

/*
For each category, return the sum of 'cost' property by month
 */
var getTotalCostByCategoryAndMonth = function (match, done) {
	const group = {
		_id: {
			year : { $year: "$date" },        
			month : { $month: "$date" }, 
			category : "$category.category"       
		},
		total: { $sum: "$cost" }
	}

	aggregateData(match, group, sortedByYearAndMonth, done);
};

/*
For each category, return the sum of 'cost' property by year
 */
var getTotalCostByCategoryAndYear = function (match, done) {
	const group = {
		_id: {
			year : { $year: "$date" },        
			category : "$category.category"       
		},
		total: { $sum: "$cost" }
	}

	aggregateData(match, group, sortedByYear, done);
};

/*
For each account, return the sum of 'outcome' property by month
 */
var getTotalCostByAccountAndMonth = function (match, done) {
	const group = {
		_id: {
			year : { $year: "$date" },        
			month : { $month: "$date" }, 
			accountType : "$bankaccount.category"       
		},
		total: { $sum: "$outcome" }
	}

	match.category = {$exists:true};

	aggregateData(match, group, sortedByYearAndMonth, done);
};


/**
* Request database instance	for retrieving aggregating data
*/
var aggregateData = function (match, group, sort, done) {
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
exports.getTotalCostByYear = getTotalCostByYear;
exports.getTotalCostByCategory = getTotalCostByCategory;
exports.getTotalCostByCategoryAndMonth = getTotalCostByCategoryAndMonth;
exports.getTotalCostByCategoryAndYear = getTotalCostByCategoryAndYear;
exports.getTotalCostByAccountAndMonth = getTotalCostByAccountAndMonth;
exports.aggregateData = aggregateData;
