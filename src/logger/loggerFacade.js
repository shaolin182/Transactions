"use strict";

/*
* Facade for logger implementation in order to facilitate a change in the logger library
* This 'loggerFacade' module should be used in the rest of the code
*/
function LoggerFacade() {}

/*
* Implementation of winston logger framework
*/
LoggerFacade.prototype.logger = require("./logger")();

/*
* Log a message, if log level is not defined, use "debug" level as default
*
* @Param
* - message : message to log
* - logLevel : level used for logging event
*/
LoggerFacade.prototype.log = function(message, logLevel) {

	if (logLevel == undefined) {
		this.getLoggerImpl().log ("debug", message);
	} else {
		this.getLoggerImpl().log(logLevel, message);
	}
}

/*
* Return current logging framework
*/
LoggerFacade.prototype.getLoggerImpl = function () {
	return LoggerFacade.prototype.logger;
}

module.exports = LoggerFacade;