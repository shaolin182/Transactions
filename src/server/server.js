"use strict";

// This module is used to start a new web server
// Web server is built thanks to Express framework.
// It requires a router module as a parameter for handling routing path

/*
* Framework used for creating web server
*/
const express = require("express");

/*
* Current instance of ExpressServer class
*/
var self;

/*
* Constructor 
* @param : 
* router : contains an array of router module specific to an application. this param can be a single module router or an array of module router
*/
var ExpressServer = function(router) {
	this.router = router;
	self = this;
}

ExpressServer.prototype.logger = require("../logger/loggerFacade");

/*
* Middleware use for logging every request received on node js server
*/
ExpressServer.prototype.logIncomingRequest = function (req, res, next) {
	self.logger.log('Received Request on ' + req.path, "debug");
	next();
};

/*
* Middleware use for logging response time of http request
* It adds a listener on finish event for capturing response time
*/
ExpressServer.prototype.logResponseTime = function (req, res, next) {
	var startTime = Date.now();
	res.on('finish', function() {
		var duration = Date.now() - startTime;
		self.logger.log('Request on ' + req.path, {"duration" : duration}, "info");
	});
	next();
}

/**
* Middleware use for allowing request from client side
*/
ExpressServer.prototype.handleHeader = function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
}

/*
* Middleware use for handling behavior when receiving a request with a path not handled by application
*/
ExpressServer.prototype.handleUnknownPath = function(req, res, next){
	self.logger.log('Unknown path : ' + req.path, "error");
	res.status(500).send({"error" : "Page not Found"});
};

/*
* Start web server and load basic middleware for handling request
* Also load specific module router according to the application
*
* param :
* done : callback function
*/
ExpressServer.prototype.start = function(done){
	var app = express();

	// use middleware for logging all request
	app.use(self.logIncomingRequest);
	app.use(self.handleHeader);
	app.use(self.logResponseTime);

	// Handle specific router module
	if (!Array.isArray(self.router)) {
		self.router = [self.router];
	}

	self.router.forEach(function (currentElement) {
		app.use(currentElement);	
	})

	// use middleware for handling unknown path
	app.use(self.handleUnknownPath);

	// use middleware for handling exceptions
	app.use(function (err, req, res, next) {
		res.status(500).send({"error" : "Error 500 : " + err});
	})

	// start server
	self.server = app.listen(process.env.SERVER_PORT, function () {
		self.logger.log ('Server started', 'info');
		done();
	});
}

ExpressServer.prototype.getInstance = function() {
	return self.server;
}

module.exports = ExpressServer;