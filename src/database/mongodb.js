"use strict";

const monk = require("monk");

/*
* Database PROD URI
*/
const PROD_URI = process.env.DB_URI;

/*
* Database TEST URI
*/
const TEST_URI = process.env.DB_TEST_URI;

/*
* Indicate to load TEST database
*/ 
exports.MODE_TEST = 'TEST';

/*
* Indicate to load PROD database
*/
exports.MODE_PROD = 'PROD';

/*
* Current database connection
*/
var db;

/*
* Logger
*/
var logger = require("../logger/loggerFacade");

/*
* Connect to a database
* 
* param
* mode : indicates if we want to connect in PROD mode or TEST mode
*/
var connect = function(mode) {
	return new Promise(function (resolve, reject) {
		var uri = mode === exports.MODE_TEST ? TEST_URI : PROD_URI

		if (db) resolve();

		db = monk(uri);

		db.then(function () {
			logger.log("Connected to database", "info");
			resolve();
		}).catch(function (err) {
			logger.log("Error occured while connecting to database : " + err, "error" );
			reject(err);
		})			
	});
}

/*
* Return the current instance of database
*/ 
var getInstance = function (){
	return db;
}


/*
* Clean a collection from current database
*
* param
* collection : name of the collection we want to clean
*/
var cleanDatabase = function (collection) {
	return new Promise(function (resolve, reject) {
		if (!db) reject();

		db.get(collection).drop()
		.then (function (results) {
			logger.log("Collection dropped", "info");
			resolve(results);
		})
		.catch (function (err) {
			logger.log("occured while dropping collection : " + err, "error");
			reject(err);
		})
	});
};

/*
 * Import a collection of data into a specific collection
 * 
 * param
 * collection : name of the collection we want to insert data in
 * data : a set of data to insert
 */
 var importData = function (collection, data) {
 	return new Promise (function (resolve, reject) {
 		if (!db) reject();

 		db.get(collection).insert(data)
 		.then(function (results) {
 			logger.log("Collection imported", "info");
 			resolve(results);
 		})
 		.catch (function (err) {
 			logger.log ("Error occured while inserting data into collection : " + err, "error");
 			reject(err);
 		})
 	});
 }

 exports.getInstance = getInstance;
 exports.connect = connect;
 exports.import = importData;
 exports.clean = cleanDatabase;