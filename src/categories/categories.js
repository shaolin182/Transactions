var db = require("../database/mongodb");

// Getting Transactions collection
var transactions = db.getInstance().get("transactions");

var getAllCategories = function (done) {
	transactions.distinct('category')
	.then(function(results){
		done (null, results);
	}).catch(function (err) {
		console.log("Error happened " + err);
		done(err);
	});
}


exports.getAll = getAllCategories;