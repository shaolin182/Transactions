"use strict";

/*
* Implementation of winston framework for logging purpose
*/
function WinstonLoggerImpl () {
    var winston = require('winston');
    return new (winston.Logger)({
        transports: [
            new winston.transports.File({
                level: 'info',
                filename: './logs/all-logs.log',
                handleExceptions: true,
                json: true,
                colorize: false,
                timestamp: true
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: true
            })
        ],
        exitOnError: false
    });
}

module.exports = WinstonLoggerImpl;