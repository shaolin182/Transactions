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
* Connect to a database
* 
* param
* mode : indicates if we want to connect in PROD mode or TEST mode
* done : callback function
*/
var connect = function(mode, done) {

	if (db) return done();

	// Define which environment to connect to
	var uri = mode === exports.MODE_TEST ? TEST_URI : PROD_URI

	// Connect to database
	db = monk(uri);

	db.then(function () {
		console.log ("Connected to database : " + uri);
		done();
	}).catch(function (err) {
		console.log ("Error occured while connecting to database : " + uri + " " + err);
		done(err);
	})
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
* done : callback function
*/
var cleanDatabase = function (collection, done) {

	if (!db) return done();

	db.get(collection).drop(function (err, results) {
		if (err) {
			console.log ("error occured while dropping collection : " + collection + " " + err);
		} else {
			console.log("Collection " + collection + " dropped");	
		}
		done(err, results);
	});
}

/*
 * Import a collection of data into a specific collection
 * 
 * param
 * collection : name of the collection we want to insert data in
 * data : a set of data to insert
 * done : callback function
 */
 var importData = function (collection, data, done) {

 	if (!db) return done();

 	db.get(collection).insert(data, function (err, results) {

 		if (err) {
 			console.log ("error occured while inserting data into collection : " + collection + " " + err) ;
 		} else {
 			console.log("data inserted into collection : " + collection + " " + results.length);	
 		}

 		done(err, results);
 	});

 }

 exports.getInstance = getInstance;
 exports.connect = connect;
 exports.import = importData;
 exports.clean = cleanDatabase;