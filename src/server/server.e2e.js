"use strict";

/*
* Module for spying and stubbing
*/
var sinon = require("sinon");

/*
* Assertion module
*/ 
var should = require("should");

/*
* Module for mocking http request
*/
var request = require('supertest');

/*
* Server module to test
*/
var expressServer = require("../server/server");

/*
* Module for building express application
*/
var express = require ("express");

/*
* Global test method for server module
*/
describe ("End to end test for server module", function () {

	/*
	* Router middleware
	*/
	var expressRouter;

	/*
	* Mock for functions
	*/
	var logIncomingRequest, handleUnknownPath, handleHeader, logResponseTime;

	/*
	* Init test context by mocking function and build a router middleware
	*/
	beforeEach(function (done) {
		// Build router middleware
		expressRouter = express.Router();
		expressRouter.get("/", function (req, res, next) {
			res.status(200).send("It's all good");
		});

		expressRouter.get("/exception", function (req, res, next) {
			throw new Error("Unexpected Error");
		});

		// Mock function used in server module
		logIncomingRequest = sinon.stub(expressServer, 'logIncomingRequest');
		logIncomingRequest.callsArg(2);

		handleHeader = sinon.stub(expressServer, 'handleHeader');
		handleHeader.callsArg(2);

		logResponseTime = sinon.stub(expressServer, 'logResponseTime');
		logResponseTime.callsArg(2);

		handleUnknownPath = sinon.stub(expressServer, 'handleUnknownPath');
		handleUnknownPath.callThrough();

		done();
	})

	/*
	* Test that intented request always called right middlewares
	*/
	it("should ensure that all middleware are correctly called when request is fine" , function (done) {
		expressServer.start(expressRouter, function () {
			request(expressServer.getInstance())
			.get('/')
			.expect(200)
			.end(function (err, res) {
				if (err) return err;

				expressServer.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				expressServer.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				expressServer.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		

				sinon.assert.callOrder(logIncomingRequest, handleHeader, logResponseTime);

				done();
			});			
		});
	})

	/*
	* Test that unintented request always called right middlewares and return an http 500 error
	*/
	it("should ensure that an error is sent when request is unintented", function (done) {
		expressServer.start(expressRouter, function () {
			request(expressServer.getInstance())
			.get('/fakeRequest')
			.expect(500)
			.end(function (err, res) {
				if (err) return err;

				expressServer.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				expressServer.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				expressServer.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		
				expressServer.handleUnknownPath.callCount.should.be.eql(1, '"handleUnknownPath" function should always been called once');

				sinon.assert.callOrder(logIncomingRequest, handleHeader, logResponseTime, handleUnknownPath);

				res.body.should.have.property("error");

				done();
			});			
		});
	});

	/*
	* Test that intented request which throws an exception always called right middlewares and return an http 500 error
	*/
	it("should ensure that an error is sent when request throws an error", function (done) {
		expressServer.start(expressRouter, function () {
			request(expressServer.getInstance())
			.get('/exception')
			.expect(500)
			.end(function (err, res) {
				if (err) return err;

				expressServer.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				expressServer.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				expressServer.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		

				sinon.assert.callOrder(logIncomingRequest, handleHeader, logResponseTime);

				res.body.should.have.property("error");


				done();
			});			
		});
	});

	/**
	* Close server
	*/
	afterEach(function () {
		expressServer.getInstance().close();
	});

	/**
	* Restore functions
	*/
	afterEach(function () {
		expressServer.logIncomingRequest.restore();
		expressServer.handleHeader.restore();
		expressServer.logResponseTime.restore();
		expressServer.handleUnknownPath.restore();
	});
});