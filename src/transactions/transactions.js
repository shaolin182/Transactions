var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

function validTransactions(transaction) {

	// convert income and outcome to cent (x 100)
	transaction.income = transaction.income * 100;
	transaction.outcome = transaction.outcome * 100;

	if (transaction.subtransaction != undefined){
		transaction.subtransaction.forEach(function (currentElement) {
			currentElement.income = currentElement.income * 100;
			currentElement.outcome = currentElement.outcome * 100;
		});
	}

	// Compute cost property, used for total
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
		results.forEach(function (currentElement) {
			currentElement.income = currentElement.income / 100;
			currentElement.outcome = currentElement.outcome / 100;

			if (currentElement.subtransaction != undefined){
				currentElement.subtransaction.forEach(function (subtransaction){
					subtransaction.income = subtransaction.income / 100;
					subtransaction.outcome = subtransaction.outcome / 100;
				});
			}
			
		})
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