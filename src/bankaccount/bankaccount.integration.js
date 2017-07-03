var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var bankaccount;
var importResults;

//console.log = function() {};

describe("Integration Tests for bankaccount modules", function () {

	before(function (done) {
		db.connect(db.MODE_TEST, function (err, results) {
			if (err) {
				console.log('A problem occured while connecting to database  ==> exit');
				done();
			}
			bankaccount = require("./bankaccount");
			console.log("Database connected");
			done();
		});
	});

	beforeEach(function (done) {
		db.clean ("transactions", function (err, results) {
			db.import("transactions", data, function (err, results) {
				importResults = results;
				done();
			});
		})
	});

	it("Retrieving all bank accounts", function (done) {
		bankaccount.getAll(function (err, results) {
			results.length.should.eql(3);
			done();
		});
	});

	it("Get Total by Bank Account Type", function (done) {
		bankaccount.getBankAccountCategoryTotal(function (err, results) {
			results.length.should.eql(2);
			done();
		});
	});


});
