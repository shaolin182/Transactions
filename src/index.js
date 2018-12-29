// Load modules
require('dotenv').config();
const ExpressServer = require('./server/server');
const MAX_ATTEMPTS = 10;
const db = require('./database/mongodb');
const logger = require('./logger/loggerFacade');
let attempts = 0;

const start = function() {
	db.connect(db.MODE_PROD)
		.then(function() {
			const server = new ExpressServer([
				require('./transactions/transactions-router'),
				require('./categories/categories-router'),
				require('./bankaccount/bankaccount-router'),
				require('./stats/stats-router')]);
			server.start(function() {});
		})
		.catch(function(err) {
			logger.log('Attempts #' + attempts + ' - A problem occured' +
				'while starting server - ' + err, 'error');
			attempts = attempts + 1;
			if (attempts < MAX_ATTEMPTS) {
				setTimeout(start, 2000);
			}
		});
};

start();
