"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var bankaccount;
var importResults;
var logger = require("../logger/logger");
var ExpressServer = require("../server/server");
var server;
var request = require('supertest');

describe("Integration Tests for bankaccount modules", function () {

	/**
	* Before running any tests, connect to the test database and load functionality module
	*/
	before(function (done) {
		db.connect(db.MODE_TEST)
		.then(function (results) {
			bankaccount = require("./bankaccount");
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
			server = new ExpressServer([require("./bankaccount-router")], logger)
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
	* Integration test linked to HTTP request GET /bankaccount
	*/
	describe("GET /bankaccount", function () {

		/**
		* Ensure that request returns all bank account
		*/
		it("Retrieving all bank accounts", function (done) {
			request(server.getInstance())
			.get('/bankaccount')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);

				res.body.length.should.eql(3);

				res.body[0].category.should.eql('Commun');
				res.body[0].bankaccountid.should.eql(1);
				res.body[0].label.should.eql('CMB');

				res.body[1].category.should.eql('Perso');
				res.body[1].bankaccountid.should.eql(2);
				res.body[1].label.should.eql('ING Direct');

				res.body[2].category.should.eql('Perso');
				res.body[2].bankaccountid.should.eql(3);
				res.body[2].label.should.eql('Espèces');

				done();
			});
		});
	});
	
	/*
	* Integration test linked to HTTP request GET /bankaccount/totalCategory
	*/
	describe("GET /bankaccount/totalCategory" , function () {

		/**
		* Ensure that HTTP request return balance of each bankaccount category
		*/
		it("Get Total by Bank Account Type", function (done) {

			request(server.getInstance())
			.get('/bankaccount/totalCategory')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);

				res.body.length.should.eql(2);
				res.body[0]._id.should.eql('Perso');
				res.body[0].total.should.eql(-241.43);

				res.body[1]._id.should.eql('Commun');
				res.body[1].total.should.eql(-1746.12);
				done();
			});
		});
	});

	/*
	* Integration test linked to HTTP request GET /bankaccount/total
	*/
	describe("GET /bankaccount/total" , function () {

		/**
		* Ensure that HTTP request return balance of each bankaccount
		*/
		it("Get Total by Bank Account", function (done) {

			request(server.getInstance())
			.get('/bankaccount/total')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);

				res.body.length.should.eql(3);
				res.body[0]._id.should.eql({ category: 'Perso', label: 'Espèces' });
				res.body[0].total.should.eql(10.90);

				res.body[1]._id.should.eql({ category: 'Perso', label: 'ING Direct' });
				res.body[1].total.should.eql(-252.33);

				res.body[2]._id.should.eql({ category: 'Commun', label: 'CMB' });
				res.body[2].total.should.eql(-1746.12);
				done();
			});
		});
	});
});