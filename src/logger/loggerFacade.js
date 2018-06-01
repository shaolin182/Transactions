"use strict";

/*
* Implementation of winston logger framework
*/
var logger = require("./logger")();

/*
* Log a message, if log level is not defined, use "debug" level as default
*
* @Param
* - message : message to log
* - logLevel : level used for logging event
*/
var log = function(message, logLevel) {

	if (logLevel == undefined) {
		exports.getLoggerImpl().log ("debug", message);
	} else {
		exports.getLoggerImpl().log(logLevel, message);
	}
}

/*
* Return current implementation of logger
*/
var getLoggerImpl = function() {
	return logger;
}

exports.log = log;
exports.getLoggerImpl = getLoggerImpl;