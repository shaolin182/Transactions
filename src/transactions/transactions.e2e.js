"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var uniqueData = require("../data/aTransaction.json");
var should = require("should");
var transactions;
var ExpressServer = require("../server/server");
var server;
var request = require('supertest');
var logger = require("../logger/logger")();
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
			server = new ExpressServer([require("./transactions-router")]);
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

	/**
	* Integration Tests for HTTP request GET /transactions
	*/
	describe("GET /transactions" , function () {

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
	})

	/*
	* Integration tests for HTTP request GET /transactions/:id
	*/
	describe("GET /transactions/:id", function () {
		/*
		* Test that get method return correct record given an id.
		*/
		it("Retrieving a result given its id - id exists in database", function (done) {
			var currentId = data[3]._id;

			request(server.getInstance())
			.get('/transactions/' + currentId)
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body._id.should.eql(currentId.toString());
				new Date(res.body.date).should.eql(data[3].date);
				res.body.bankaccount.should.eql(data[3].bankaccount);
				res.body.category.should.eql(data[3].category);
				res.body.income.should.eql(data[3].income);
				res.body.outcome.should.eql(data[3].outcome);
				done();
			});
		});

		/*
		* Test that get method return an error when id is malformed
		*/
		it("Retrieving a result given its id - id is malformed", function (done) {
			request(server.getInstance())
			.get('/transactions/fakeId')
			.expect(500)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.should.have.property("error");
				done();
			});
		});

		/*
		* Test that get method return an empty response when id not found in database
		*/
		it("Retrieving a result given its id - id not found in database", function (done) {
			request(server.getInstance())
			.get('/transactions/0123456789abcdefabcdefab')
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.should.eql({});
				done();
			});
		});
	})

	/**
	* Integration tests for HTTP request POST /transactions
	*/
	describe('POST /transactions', function () {

		/*
		* Test that add method, create a new record in database with correct data.
		*/ 
		it("Adding a new element", function (done) {

			var aTransaction = uniqueData;

			request(server.getInstance())
			.post('/transactions')
			.send(aTransaction)
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.date.should.eql(aTransaction.date);
				res.body.bankaccount.label.should.eql(aTransaction.bankaccount.label);
				res.body.category.label.should.eql(aTransaction.category.label);
				res.body.income.should.eql(aTransaction.income * 100);
				res.body.outcome.should.eql(aTransaction.outcome * 100);
				res.body.should.have.property("_id");
				done();
			});
		});

		/*
		* Test that add method, create a new record in database with correct data.
		*/ 
		it("Adding a new element and ensure that decimal number are correctly saved", function (done) {

			var aTransaction = uniqueData;
			aTransaction.outcome = 19.99;

			request(server.getInstance())
			.post('/transactions')
			.send(aTransaction)
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.date.should.eql(aTransaction.date);
				res.body.bankaccount.label.should.eql(aTransaction.bankaccount.label);
				res.body.category.label.should.eql(aTransaction.category.label);
				res.body.income.should.eql(aTransaction.income * 100);
				res.body.outcome.should.eql(1999);
				res.body.should.have.property("_id");
				done();
			});
		});
	})

	/**
	* Integration tests for HTTP request PUT /transactions/:id
	*/
	describe('POST /transactions/:id', function () {

		/*
		* Test that put method, update a new record in database with correct data.
		*/ 
		it("Updating a new element", function (done) {

			
			var currentId = data[3]._id;
			var aTransaction = {"id":currentId, "aNewProperty":"test"};

			request(server.getInstance())
			.post('/transactions/' + currentId)
			.send(aTransaction)
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.n.should.eql(1);
				res.body.nModified.should.eql(1);
				res.body.ok.should.eql(1);

				transactions.get(currentId, function (err, result) {
					result.should.have.property("aNewProperty");
					result.aNewProperty.should.eql("test");

					done();
				});
				
			});
		});
	})

	/**
	* Integration tests for HTTP request DELETE /transactions/:id
	*/
	describe('DELETE /transactions/:id', function () {

		/*
		* Test that delete method, delete record into database
		*/ 
		it("Removing an existing element", function (done) {

			var currentId = data[3]._id;

			request(server.getInstance())
			.delete('/transactions/' + currentId)
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.n.should.eql(1);
				res.body.ok.should.eql(1);

				transactions.getAll(function (err, result) {
					result.length.should.eql(6);
					done();
				});
			});
		});

		/*
		* Test that delete method with a fakeId, delete 0 record into database
		*/ 
		it("Removing a non existing element", function (done) {

			request(server.getInstance())
			.delete('/transactions/0123456789abcdefabcdefab')
			.expect(200)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.n.should.eql(0);
				res.body.ok.should.eql(1);
				done();
			});
		});

		/*
		* Test that delete method return an error when id is malformed
		*/
		it("Deleting a result given its id - id is malformed", function (done) {
			request(server.getInstance())
			.delete('/transactions/fakeId')
			.expect(500)
			.end (function (err, res) {
				if (err) return done(err);

				res.body.should.have.property("error");
				done();
			});
		});
	})
});