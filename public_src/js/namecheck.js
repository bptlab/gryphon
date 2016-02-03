/**
 * Since the project should follow a unified naming convention it makes sense to implement it in
 * one place. The current guidelines are:
 * - only alphanumeric + "_" (underscore) + " " (space) characters are allowed
 * - the first and last characters should be alphanumeric
 * - there may not be more than 1 non-alphanumeric character after another
 */

var MessageHandler = require('./messagehandler');

exports.check = function (name) {
    if (name &&
        /^([a-zA-Z\d]|[a-zA-Z\d](?!.*[ _]{2})[a-zA-Z\d _]*?[a-zA-Z\d])$/.test(name)) {
        return true;
    } else {
        MessageHandler.handleMessage("warning","Only alphanumeric names are allowed!");
        return false;
    }
};

exports.isUnique = function (name, listOfNames) {
    if (listOfNames.every(
        function (element, index, array) {
            return element.name != name;
        })) {
        return true;
    } else {
        MessageHandler.handleMessage("warning","Only unique names are allowed!");
        return false;
    }
};