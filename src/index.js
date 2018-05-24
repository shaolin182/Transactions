// Load modules
require('dotenv').config();
var server = require("./server/server");
var db = require("./database/mongodb");
var LoggerFacade = require("./logger/loggerFacade");

// Instanciate objects
var logger = new LoggerFacade();

db.connect(db.MODE_PROD)
.then(function() {
	server.start([require("./transactions/transactions-router"), require("./categories/categories-router"), require("./bankaccount/bankaccount-router"), require("./stats/stats-router")], function() {});
})
.catch(function (err) {
	logger.log('error', 'A problem occured while starting server ' + err);
});