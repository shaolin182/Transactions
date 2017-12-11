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

			// convert some fields of  data file to respect property type 
			data.forEach(function (currentElement) {
				currentElement.date = new Date (currentElement.date);
			});
			
			bankaccount = require("./bankaccount");
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
