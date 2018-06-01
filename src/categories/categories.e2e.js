"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var importResults;
var categories;
var logger = require("../logger/logger");
var ExpressServer = require("../server/server");
var server;
var request = require('supertest');

describe("Integration Tests for categories modules", function () {

	/**
	* Before running any tests, connect to the test database and load functionality module
	*/
	before(function (done) {
		db.connect(db.MODE_TEST)
		.then(function (results) {
			categories = require("./categories");
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
			server = new ExpressServer([require("./categories-router")]);
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
	* Integration test linked to HTTP request GET /categories
	*/
	describe ("GET /categories", function () {

		/**
		* Ensure that HTTP request return correct balance by month
		*/
		it("Retrieving all categories", function (done) {

			request(server.getInstance())
			.get('/categories')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);

				res.body.length.should.eql(6);
				res.body[0].parent.should.eql("Maison");
				res.body[0].label.should.eql("Prêt");
				res.body[1].parent.should.eql("Dépenses Personnelles");
				res.body[1].label.should.eql("Cadeaux");
				res.body[2].parent.should.eql("Voiture");
				res.body[2].label.should.eql("Essence");
				res.body[3].parent.should.eql("Dépenses Personnelles");
				res.body[3].label.should.eql("Téléphone");
				res.body[4].parent.should.eql("Vacances");
				res.body[4].label.should.eql("USA 2016");
				res.body[5].parent.should.eql("Alimentaire");
				res.body[5].label.should.eql("Restaurant");
				done();
			});
		});
	});
})