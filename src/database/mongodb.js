"use strict";

const monk = require("monk");

/*
* Database PROD URI
*/
const PROD_URI = "localhost:27017/transactions";

/*
* Database TEST URI
*/
const TEST_URI = "localhost:27017/transactionsTests";

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
var logger = require("../logger/logger")


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
			logger.log("info", "Connected to database");
			resolve();
		}).catch(function (err) {
			logger.log("error", "Error occured while connecting to database : " + err);
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
			logger.log("info", "Collection dropped");
			resolve(results);
		})
		.catch (function (err) {
			logger.log("error", "occured while dropping collection : " + err);
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
 			logger.log("info", "Collection imported");
 			resolve(results);
 		})
 		.catch (function (err) {
 			logger.log ("error", "Error occured while inserting data into collection : " + err);
 			reject(err);
 		})
 	});
 }

 exports.getInstance = getInstance;
 exports.connect = connect;
 exports.import = importData;
 exports.clean = cleanDatabase;