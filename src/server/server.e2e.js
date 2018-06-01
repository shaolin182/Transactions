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
var ExpressServer = require("../server/server");
var server;

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

		server = new ExpressServer([expressRouter]);

		// Mock function used in server module
		logIncomingRequest = sinon.stub(server, 'logIncomingRequest');
		logIncomingRequest.callsArg(2);

		handleHeader = sinon.stub(server, 'handleHeader');
		handleHeader.callsArg(2);

		logResponseTime = sinon.stub(server, 'logResponseTime');
		logResponseTime.callsArg(2);

		handleUnknownPath = sinon.stub(server, 'handleUnknownPath');
		handleUnknownPath.callThrough();

		done();
	})

	/*
	* Test that intented request always called right middlewares
	*/
	it("should ensure that all middleware are correctly called when request is fine" , function (done) {
		server.start(function () {
			request(server.getInstance())
			.get('/')
			.expect(200)
			.end(function (err, res) {
				if (err) return err;

				server.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				server.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				server.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		

				sinon.assert.callOrder(logIncomingRequest, handleHeader, logResponseTime);

				done();
			});			
		});
	})

	/*
	* Test that unintented request always called right middlewares and return an http 500 error
	*/
	it("should ensure that an error is sent when request is unintented", function (done) {
		server.start(function () {
			request(server.getInstance())
			.get('/fakeRequest')
			.expect(500)
			.end(function (err, res) {
				if (err) return err;

				server.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				server.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				server.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		
				server.handleUnknownPath.callCount.should.be.eql(1, '"handleUnknownPath" function should always been called once');

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
		server.start(function () {
			request(server.getInstance())
			.get('/exception')
			.expect(500)
			.end(function (err, res) {
				if (err) return err;

				server.logIncomingRequest.callCount.should.be.eql(1, '"logIncomingRequest" function should always been called once');
				server.handleHeader.callCount.should.be.eql(1, '"handleHeader" function should always been called once');
				server.logResponseTime.callCount.should.be.eql(1, '"logResponseTime" function should always been called once');		

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
		server.getInstance().close();
	});

	/**
	* Restore functions
	*/
	afterEach(function () {
		server.logIncomingRequest.restore();
		server.handleHeader.restore();
		server.logResponseTime.restore();
		server.handleUnknownPath.restore();
	});
});