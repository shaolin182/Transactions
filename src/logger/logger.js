var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: '../logs/all-logs.log',
            handleExceptions: true,
            json: true,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;