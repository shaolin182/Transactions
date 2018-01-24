"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var importResults;
var stats;
var logger = require("../logger/logger")

describe("Integration Tests for stats modules", function () {

	/**
	* Before running any tests, connect to the test database and load functionality module
	*/
	before(function (done) {
		db.connect(db.MODE_TEST)
		.then(function (results) {
			stats = require("./stats");
			done();
		})
		.catch(function (err) {
			logger.log('error', 'A problem occured while initializing test case ' + err);
			done();
		});
	})

	/*
	* Transform test data in order to insert specific type in mongo database
	*/
	beforeEach(function(done) {
		data.forEach(function (currentElement) {
			// Convert string date to Date
			currentElement.date = new Date (currentElement.date);
		});
		done();
	})

	/**
	* Clean transaction collection and then reimport it in order to use clean data before loading tests
	*/
	beforeEach(function (done) {
		db.clean ("transactions")
		.then(function () {
			return db.import("transactions", data)
		})
		.then(function (results) {
			importResults = results;
			done();
		})
		.catch(function (err) {
			logger.log("error", "Error while setup database for tests " + err);
			done();
		})	
	})

	it("Retrieving Stats / Total Cost By month", function (done) {
		stats.getTotalCostByMonth(function (err, results) {
			results.length.should.eql(3);
			results[0].costByMonth.should.eql(-170935);
			results[1].costByMonth.should.eql(-28910);
			results[2].costByMonth.should.eql(1090);
			done();
		});

	});

})
