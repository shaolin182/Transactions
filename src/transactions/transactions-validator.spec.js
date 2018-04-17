"use strict";

var assert = require("assert");
var validator = require("./transactions-validator");

/*
* Unit test for transactions-validator module
*/
describe ("Unit test for transactions-validator module", function () {

	/*
	* Unit test for 'convertToCent' function
	* Some of these unit tests seems equivalent but those tested values are not well rounded when we multiply it
	*/
	describe ("Unit test for 'convertToCent' function", function () {

		/*
		* Ensure that income and outcome parameter are correclty converted in cent
		*/
		function testConvertToCent (income, outcome, incomeInCent, outcomeInCent) {
			var currentElement = {
				outcome:outcome,
				income:income
			}
			validator.convertToCent(currentElement);

			assert.equal(currentElement.outcome, outcomeInCent, "Converted outcome should be equals to " + outcomeInCent);
			assert.equal(currentElement.income, incomeInCent, "Converted income should be equals to " + incomeInCent);
		}

		it("Ensure that converting 19.99 to cent is correct" , function (done) {
			testConvertToCent(0, 19.99, 0, 1999);
			done();
		})

		it("Ensure that converting 64.15 to cent is correct" , function (done) {
			testConvertToCent(37, 64.15, 3700, 6415);
			done();
		})

		it("Ensure that converting 35.2 to cent is correct" , function (done) {
			testConvertToCent(100, 35.2, 10000, 3520);
			done();
		})
	})
})