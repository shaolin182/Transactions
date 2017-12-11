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
* Convert 'income' out 'outcome' properties into cent for avoiding decimal issue
*/
var convertToCent = function (currentElement) {
	currentElement.income = currentElement.income * 100;
	currentElement.outcome = currentElement.outcome * 100;
}

/**
* Compute the difference between income and outcome.
* The cost property is then used for statistics purpose
*/
var computeCost = function(aTransaction) {
	aTransaction.cost = aTransaction.income - aTransaction.outcome;
}

exports.validateAndTransform = validateAndTransform;