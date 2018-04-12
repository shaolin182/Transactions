"use strict";

// This module is used to start a new web server
// Web server is built thanks to Express framework.
// It requires a router module as a parameter for handling routing path

var express = require("express");

var server;

/*
* Logger
*/
var logger = require("../logger/logger")();

/*
* Middleware use for logging every request received on node js server
*/
function logIncomingRequest (req, res, next) {
	logger.log('debug', 'Received Request on ' + req.path);
	next();
};

/*
* Middleware use for logging response time of http request
* It adds a listener on finish event for capturing response time
*/
function logResponseTime(req, res, next) {
	var startTime = Date.now();
	res.on('finish', function() {
		var duration = Date.now() - startTime;
		logger.log('info', 'Request on ' + req.path, {"duration" : duration});
	});
	next();
}

/**
* Middleware use for allowing request from client side
*/
function handleHeader(req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

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
function handleUnknownPath (req, res, next){
	logger.log('error', 'Unknown path : ' + req.path);

	res.status(500).send({"error" : "Page not Found"});
};

/*
* Init server module
*
* @param : 
* loggerFwk : logger framework we are currently using
* routerModule : list of router module in application
*/
function init(loggerImpl, routerModule) {
	logger = loggerImpl;
}

/*
* Start web server and load basic middleware for handling request
* Also load specific module router according to the application
*
* param :
* router : contains an array of router module specific to an application. this param can be a single module router or an array of module router
*/
function start(router, done){

	var app = express();

	// use middleware for logging all request
	app.use(exports.logIncomingRequest);
	app.use(exports.handleHeader);
	app.use(exports.logResponseTime);

	// Handle specific router module
	if (!Array.isArray(router)) {
		router = [router];
	}

	router.forEach(function (currentElement) {
		app.use(currentElement);	
	})

	// use middleware for handling unknown path
	app.use(exports.handleUnknownPath);

	// use middleware for handling exceptions
	app.use(function (err, req, res, next) {
		res.status(500).send({"error" : "Error 500 : " + err});
	})

	// start server
	server = app.listen(8080, function () {
		logger.log ('info', 'Server started');
		done();
	});

}

function getInstance() {
	return server;
}

exports.start = start;
exports.getInstance = getInstance;
exports.init = init;
exports.logIncomingRequest = logIncomingRequest;
exports.handleUnknownPath = handleUnknownPath;
exports.handleHeader = handleHeader;
exports.logResponseTime = logResponseTime;