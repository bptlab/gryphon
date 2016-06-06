
var handleDBError = function(err, result, httpresult) {
    if (err) {
        console.error(err);
        httpresult.status(500).end();
        return;
    }
    if (result !== null) {

    } else {
        httpresult.status(404).end();
    }
}

module.exports = {handleDBError: handleDBError}