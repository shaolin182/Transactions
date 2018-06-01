"use strict";

var assert = require("assert");
var sinon = require("sinon");
var should = require("should");

describe ("Unit Test for loggerFacade module", function ()  {

	var logger = require("./loggerFacade");

	var loggerImpl;

	/*
	* Before each tests, mock logger in order to check it it had been called
	*/
	beforeEach(function (done) {	

		// Stub Log Implementation
		loggerImpl = {
			log : sinon.spy()
		}
		sinon.stub(logger, "getLoggerImpl").returns(loggerImpl);

		done();
	});

	it("function log with 2 parameters should call winston logger implementation ", function (done) {
		logger.log("test Message", "info");

		assert(loggerImpl.log.calledOnce, "'log' function should be called once");
		assert.equal(loggerImpl.log.args[0][0], "info", "level mode should be info");
		assert.equal(loggerImpl.log.args[0][1], "test Message", "message should be 'test Message'");

		done();
	});

	it("function log with 1 parameter should call winston logger implementation ", function (done) {
		logger.log("test Message");

		assert(loggerImpl.log.calledOnce, "'log' function should be called once");
		assert.equal(loggerImpl.log.args[0][0], "debug", "level mode should be debug");
		assert.equal(loggerImpl.log.args[0][1], "test Message", "message should be 'test Message'");

		done();
	});

	afterEach(function (done) {
		logger.getLoggerImpl.restore();
		done();
	});
});