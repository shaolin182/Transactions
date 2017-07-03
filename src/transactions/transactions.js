var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

function validTransactions(transaction) {

	transaction.cost = transaction.income - transaction.outcome;

	if (transaction.category != undefined && Object.keys(transaction.category).length === 0 && transaction.category.constructor === Object) {
		delete transaction.category;
	}

	if (transaction.bankaccount != undefined && Object.keys(transaction.bankaccount).length === 0 && transaction.bankaccount.constructor === Object) {
		delete transaction.bankaccount;
	}

	return transaction;
} 

var addTransactions = function (transaction, done) {
	transactions.insert(validTransactions(transaction))
	.then(function (results) {
		done (null, results);
	})
	.catch (function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var getTransactions = function (id, done) {
	transactions.findOne({_id : id})
	.then (function (results) {
		done (null, results);
	})
	.catch (function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var getAllTransactions = function (done) {
	transactions.find({})
	.then(function(results){
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var removeTransactions = function (id, done) {
	transactions.remove({_id : id})
	.then (function (results) {
		done (null, results);
	})
	.catch (function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

var updateTransactions = function (transaction, done) {
	transactions.update({_id : transaction._id}, validTransactions(transaction))
	.then (function (results) {
		done (null, results);
	})
	.catch (function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}

exports.add = addTransactions;
exports.get = getTransactions;
exports.remove = removeTransactions;
exports.update = updateTransactions;
exports.getAll = getAllTransactions;