var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var transactions;
var importResults;

//console.log = function() {};

describe("Integration Tests for transactions modules", function () {

	before(function (done) {
		db.connect(db.MODE_TEST, function (err, results) {
			if (err) {
				console.log('A problem occured while connecting to database  ==> exit');
				done();
			}
			transactions = require("./transactions");
			console.log("Database connected");
			done();
		});
	})

	beforeEach(function (done) {
		db.clean ("transactions", function (err, results) {
			db.import("transactions", data, function (err, results) {
				importResults = results;
				done();
			});
		})
	})

	it("Retrieving all results", function (done) {
		transactions.getAll(function (err, results) {
			results.length.should.eql(7);
			done();
		});
	});

	it("Retrieving a result given its id", function (done) {
		var currentId = importResults[3]._id;
		transactions.get(currentId, function (err, results) {
			results._id.should.eql(currentId);
			results.date.should.eql(importResults[3].date);
			results.bankaccount.should.eql(importResults[3].bankaccount);
			results.category.should.eql(importResults[3].category);
			results.income.should.eql(importResults[3].income);
			results.outcome.should.eql(importResults[3].outcome);
			done();
		});
	});

	it("Adding a new element", function (done) {
		var aTransaction = {
			"date": "2017-03-17T00:00:00.000Z",
			"label": "Test",
			"outcome": 125.06,
			"income": 0,
			"category": {
				"parent" : "Perso",
				"label" : "Photo"
			},
			"prevision": false,
			"bankaccount": {
				"type": "Perso",
				"label": "ING Direct"
			}
		};

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

	it("Removing an element", function (done) {
		var currentId = importResults[3]._id;
		transactions.remove(currentId, function (err, results) {
			transactions.getAll(function (err, results) {
				results.length.should.eql(6);
				done();
			});
		});
	});

	it("Updating an element", function (done) {
		importResults[3].date = "2017-03-17T00:00:00.000Z";
		var currentId = importResults[3]._id;
		
		transactions.update(importResults[3], function (err, results){
			transactions.get(currentId, function (err, results) {
				results.date.should.eql("2017-03-17T00:00:00.000Z");
				done();
			});
		});

	});
});
