/**
 * @module helpers.array
 */

/**
 * Checks wether the arrays a and b are equal.
 * @class arrayEquals
 * @param a {array}
 * @param b {array}
 * @returns {boolean}
 */
var arrayEquals = function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (b.indexOf(a[i]) === -1) return false;
    }
    return true;
};

module.exports = {arrayEquals: arrayEquals};