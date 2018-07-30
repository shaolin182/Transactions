"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var importResults;
var stats;
var logger = require("../logger/logger")();
var ExpressServer = require("../server/server");
var server;
var request = require('supertest');

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
		.then(function() {
			return db.import("transactions", data);	
		})
		.then(function (results) {
			importResults = results;
		})
		.then (function () {
			server = new ExpressServer([require("./stats-router")]);
			server.start(function () {
				done();	
			});
		})
		.catch(function (err) {
			logger.log("error", "Error while setup database for tests " + err);
			done();
		})
	})

	/**
	* Close server
	*/
	afterEach(function () {
		server.getInstance().close();
	});


	/*
	* Integration test linked to HTTP request GET /stats/totalCostByMonth
	*/
	describe ("GET /stats/totalCostByMonth", function () {

		/**
		* Ensure that HTTP request return correct balance by month
		*/
		it("Retrieving Stats / Total Cost By month", function (done) {

			request(server.getInstance())
			.post('/stats/totalCostByMonth')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);

				res.body.length.should.eql(3);
				res.body[0].total.should.eql(-170935);
				res.body[1].total.should.eql(-28910);
				res.body[2].total.should.eql(1090);
				done();
			});
		});
	});
})