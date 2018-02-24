var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

var success = function(results, done) {
	done(null, results);
}

var error = function (err, done) {
	done(err);
}

var addTransactions = function (transaction, done) {
	transactions.insert(transaction)
	.then(function (results) {success (results, done);})
	.catch(function (err) {error(err, done);});
}

var getTransactions = function (id, done) {
	transactions.findOne({_id : id})
	.then (function (results) {success (results, done);})
	.catch (function (err) {error(err, done);});
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
	}).catch(function (err) {error(err, done);});
}

var removeTransactions = function (id, done) {
	transactions.remove({_id : id})
	.then (function (results) {success (results, done);})
	.catch (function (err) {error(err, done);});
}

var updateTransactions = function (id, transaction, done) {
	transactions.update({_id : id}, transaction)
	.then (function (results) {success (results, done);})
	.catch (function (err) {error(err, done);});
}

exports.add = addTransactions;
exports.get = getTransactions;
exports.remove = removeTransactions;
exports.update = updateTransactions;
exports.getAll = getAllTransactions;