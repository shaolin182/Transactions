var db = require("../database/mongodb");
var data = require("../data/transactions.json");
var should = require("should");
var bankaccount;
var importResults;
var logger = require("../logger/logger")


//console.log = function() {};

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
		db.clean("transactions")
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

	it("Retrieving all bank accounts", function (done) {
		bankaccount.getAll(function (err, results) {
			results.length.should.eql(3);
			results[0].category.should.eql('Commun');
			results[0].bankaccountid.should.eql(1);
			results[0].label.should.eql('CMB');

			results[1].category.should.eql('Perso');
			results[1].bankaccountid.should.eql(2);
			results[1].label.should.eql('ING Direct');

			results[2].category.should.eql('Perso');
			results[2].bankaccountid.should.eql(3);
			results[2].label.should.eql('Espèces');
			done();
		});
	});

	it("Get Total by Bank Account Type", function (done) {
		bankaccount.getBankAccountCategoryTotal(function (err, results) {
			results.length.should.eql(2);
			results[0]._id.should.eql('Perso');
			results[0].total.should.eql(-241.43);

			results[1]._id.should.eql('Commun');
			results[1].total.should.eql(-1746.12);
			done();
		});
	});

	it("Get Total by Bank Account", function (done) {
		bankaccount.getBankAccountTotal(function (err, results) {
			results.length.should.eql(3);
			results[0]._id.should.eql({ category: 'Perso', label: 'Espèces' });
			results[0].total.should.eql(10.90);

			results[1]._id.should.eql({ category: 'Perso', label: 'ING Direct' });
			results[1].total.should.eql(-252.33);

			results[2]._id.should.eql({ category: 'Commun', label: 'CMB' });
			results[2].total.should.eql(-1746.12);
			done();
		});
	});
});