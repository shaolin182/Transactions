var server = require("./server/server");
var db = require("./database/mongodb");
var logger = require("./logger/logger");

db.connect(db.MODE_PROD, function (err, results) {

	if (err) {
		logger.log('error','A problem occured while connecting to database  ==> exit');
		return;
	}
	
	server.start([require("./transactions/transactions-router"), require("./categories/categories-router"), require("./bankaccount/bankaccount-router"), require("./stats/stats-router")]);
});