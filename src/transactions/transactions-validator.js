"use strict";

var validateAndTransform = function (aTransaction) {
	validate(aTransaction);
	transform(aTransaction);
}

/*
* Validate that transaction received is correct.
* Return an error if some fedect is met 
*/
var validate = function (aTransaction) {
	
	if (aTransaction == undefined) {
		return;
	}

	// Required fields : date, bankaccount
	if (aTransaction.date == undefined || aTransaction.bankaccount == undefined){
		return;
	}
}

/**
* Transform transaction
*/
var transform = function (aTransaction) {

	// Convert to cent
	convertToCent(aTransaction);

	// Convert to cent subtransactions
	if (aTransaction.subtransaction){
		aTransaction.subtransaction.forEach(function (currentElement) {
			convertToCent(currentElement);
		});
	}

	// Compute cost
	computeCost(aTransaction);

	// Convert property 'date' to date format
	aTransaction.date = new Date(aTransaction.date);
}

/*
* As javascript use binary floating point, there are some issue when working with decimal number (example 19.99 * 100 = 1998.99999),
* we use the method "ToFixed" to round number.
* We also delete '.00' value added by the toFixed method on integer and parse them to number
*
* Convert 'income' out 'outcome' properties into cent for avoiding decimal issue ib further process
*/
var convertToCent = function (currentElement) {
	currentElement.income = parseFloat((currentElement.income * 100).toFixed(2).replace(/[.,]00/, ""));
	currentElement.outcome = parseFloat((currentElement.outcome * 100).toFixed(2).replace(/[.,]00/, ""));
}

/**
* Compute the difference between income and outcome.
* The cost property is then used for statistics purpose
*/
var computeCost = function(aTransaction) {
	aTransaction.cost = aTransaction.income - aTransaction.outcome;
}

exports.validateAndTransform = validateAndTransform;
exports.convertToCent = convertToCent;