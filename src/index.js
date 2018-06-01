// Load modules
require('dotenv').config();
const ExpressServer = require("./server/server");
var db = require("./database/mongodb");
var logger = require("./logger/loggerFacade");

db.connect(db.MODE_PROD)
.then(function() {
	const server = new ExpressServer([require("./transactions/transactions-router"), require("./categories/categories-router"), require("./bankaccount/bankaccount-router"), require("./stats/stats-router")]);
	server.start(function() {});
})
.catch(function (err) {
	logger.log('error', 'A problem occured while starting server ' + err);
});