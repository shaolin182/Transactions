"use strict";

var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var importResults;
var stats;

describe("Integration Tests for stats modules", function () {

	before(function (done) {
		db.connect(db.MODE_TEST, function (err, results) {
			if (err) {
				console.log('A problem occured while connecting to database  ==> exit');
				done();
			}

			// convert some fields of  data file to respect property type 
			data.forEach(function (currentElement) {
				currentElement.date = new Date (currentElement.date);
			});

			stats = require("./stats");
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
	});

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
