"use strict";

var assert = require("assert");
var sinon = require("sinon");
var should = require("should");

describe ('Unit tests for server module', function () {

	var ExpressServer = require("../server/server");
	var server;
	var logger;
	var next;

	/**
	* Init our service module
	*/
	beforeEach(function (done) {
		logger = {
			"log" : sinon.spy()
		}
		next = sinon.spy();
		server = new ExpressServer(null);
		server.logger = logger;
		done();
	})

	describe('Unit test for middleware function logIncomingRequest', function () {

		it ('should called log framework and next function', function (done) {
			var req = {
				path : "/test"
			};
			var res = {};
			server.logIncomingRequest(req, res, next);

			assert(next.calledOnce, "'Next' function should be called once");
			assert(logger.log.calledOnce, "'log' function should be called once");
			assert.equal(logger.log.args[0][1], "debug", "level mode should be debug");
			logger.log.args[0][0].should.containEql(req.path);

			done();
		});
	});

	describe ('Unit test for middleware function handleUnknownPath', function () {
		it ("should log an error and return an error response", function (done) {
			var req = {
				path : "/test"
			};

			var res = sinon.stub({
				status : function () {},
				send : function () {}
			})

			res.status.returns(res);

			server.handleUnknownPath(req, res, next);

			assert(logger.log.calledOnce, "'log' function should be called once");
			assert.equal(logger.log.args[0][1], "error", "level mode should be error");
			logger.log.args[0][0].should.containEql(req.path);

			res.send.calledOnce.should.be.true("Send function should be called once");
			res.status.calledOnce.should.be.true("Status function should be called once");
			res.status.getCall(0).args[0].should.be.eql(500, "HTTP Request status sshould be equal to 500");

			done();
		});
	});

	describe ('Unit teset for middleware function handleHeader', function () {
		it("should update header in order to accept incoming request", function (done) {

			var req = {
				path : "/test"
			};

			var res = sinon.stub({
				setHeader : function () {}
			})

			server.handleHeader(req, res, next);

			res.setHeader.callCount.should.be.eql(4);
			res.setHeader.getCall(0).args[0].should.be.eql("Access-Control-Allow-Origin");
			res.setHeader.getCall(1).args[0].should.be.eql("Access-Control-Allow-Methods");
			res.setHeader.getCall(2).args[0].should.be.eql("Access-Control-Allow-Headers");
			res.setHeader.getCall(3).args[0].should.be.eql("Access-Control-Allow-Credentials");

			done();
		}) 
	})
});