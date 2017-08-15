var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

var getAllBankAccount = function (done) {
	transactions.distinct('bankaccount')
	.then(function(results){
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var getBankAccountCategoryTotal = function(done) {
	transactions.aggregate([{$group: {_id: "$bankaccount.category", total: {$sum : "$cost"}}}])
	.then(function(results) {
		results.forEach(function(currentElement) {
			currentElement.total = currentElement.total / 100;
		})
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var getBankAccountTotal = function(done) {
	transactions.aggregate([{$group: {_id: {"category":"$bankaccount.category", "label":"$bankaccount.label"}, total: {$sum : "$cost"}}}])
	.then(function(results) {
		results.forEach(function(currentElement) {
			currentElement.total = currentElement.total / 100;
		})
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

exports.getAll = getAllBankAccount;
exports.getBankAccountCategoryTotal = getBankAccountCategoryTotal;
exports.getBankAccountTotal = getBankAccountTotal;