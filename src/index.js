var server = require("./server/server");
var db = require("./database/mongodb");

db.connect(db.MODE_PROD, function (err, results) {

	if (err) {
		console.log('A problem occured while connecting to database  ==> exit');
		return;
	}
	
	server.start([require("./transactions/router"), require("./categories/categories.router"), require("./bankaccount/bankaccount-router")]);
});