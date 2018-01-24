"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var uniqueData = require("../data/aTransaction.json");
var should = require("should");
var transactions;
var server = require("../server/server");
var request = require('supertest');
var logger = require("../logger/logger")
var importResults;

describe("Integration Tests for transactions modules", function () {

	/**
	* Before running any tests, connect to the test database and load functionality module
	*/
	before(function (done) {
		db.connect(db.MODE_TEST)
		.then(function (results) {
			transactions = require("./transactions");
			done();
		})
		.catch(function (err) {
			logger.log('error', 'A problem occured while initializong test case ' + err);
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
			server.start([require("./transactions-router")], function () {
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
	* Test that getAll method return all results from database
	*/
	it("Retrieving all results", function (done) {
		request(server.getInstance())
		.get('/transactions')
		.expect(200)
		.end(function (err, res) {
			res.body.length.should.eql(7);
			done();
		});
	});

	/*
	* Test that get method return correct record given an id.
	*/
	it("Retrieving a result given its id", function (done) {
		var currentId = data[3]._id;
		transactions.get(currentId, function (err, results) {
			results._id.should.eql(currentId);
			results.date.should.eql(data[3].date);
			results.bankaccount.should.eql(data[3].bankaccount);
			results.category.should.eql(data[3].category);
			results.income.should.eql(data[3].income);
			results.outcome.should.eql(data[3].outcome);
			done();
		});
	});

	/*
	* Test that add method, create a new record in database with correct data.
	*/ 
	it("Adding a new element", function (done) {
		var aTransaction = uniqueData;

		transactions.add(aTransaction, function (err, results){
			transactions.getAll(function (err, results) {
				results.length.should.eql(8);
			});
			results.date.should.eql(aTransaction.date);
			results.bankaccount.label.should.eql(aTransaction.bankaccount.label);
			results.category.label.should.eql(aTransaction.category.label);
			results.income.should.eql(aTransaction.income);
			results.outcome.should.eql(aTransaction.outcome);
			should.exist(results._id);
			done();
		});
	});

});