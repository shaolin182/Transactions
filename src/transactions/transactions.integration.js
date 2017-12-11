var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var uniqueData = require("../data/aTransaction.json");
var should = require("should");
var transactions;

//console.log = function() {};

describe("Integration Tests for transactions modules", function () {

	/**
	* Before running any tests, connect to the test database
	*/
	before(function (done) {
		db.connect(db.MODE_TEST, function (err, results) {
			if (err) {
				console.log('A problem occured while connecting to database  ==> exit');
				done();
			}

			// Init module transaction
			transactions = require("./transactions");
			done();
		});
	})

	/*
	* Before each tests, clean the test database, then reimport data file and convert date property
	*/
	beforeEach(function (done) {
		db.clean ("transactions", function (err, results) {

			// convert some fields of  data file to respect property type 
			data.forEach(function (currentElement) {
				currentElement.date = new Date (currentElement.date);
			});

			// import data
			db.import("transactions", data, function (err, results) {
				done();
			});
		})
	})

	/*
	* Test that getAll method return all results from database
	*/
	it("Retrieving all results", function (done) {
		transactions.getAll(function (err, results) {
			results.length.should.eql(7);
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