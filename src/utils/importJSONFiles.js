require('dotenv').config();

var db = require("../database/mongodb");
var data = require("../data/transactionsYnab.json");
var logger = require("../logger/loggerFacade");

logger.log("Start importing files", "info");

db.connect(db.MODE_PROD)
.then(function (results) {
    logger.log("Connected to database", "info");

    data.forEach(function (currentElement) {
        // Convert string date to Date
        currentElement.date = new Date (currentElement.date);
    });

    return db.import("transactions", data)
})
.then (function (results) {
    logger.log("Files imported with success", "info");
})
.catch(function (err) {
    logger.log("A problem occured while importing files" + err, "error");
});