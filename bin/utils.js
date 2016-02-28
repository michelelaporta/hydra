var _ = require('lodash');

module.exports = function () {

    var _exists = function (input) {
        return !_.isUndefined(input) && !_.isNull(input);
    };

    return {
        exists: _exists
    }
}();


//module.exports.getRandom = function getRandom(min, max) {
//	return min + Math.floor(Math.random() * (max - min + 1));
//}
//
///**
// * Normalize a port into a number, string, or false.
// */
//
//module.exports.normalizePort = function normalizePort(val,callback) {
//	var port = parseInt(val, 10);
//
//	if (isNaN(port)) {
//		// named pipe
//		return callback(val);
//	}
//
//	if (port >= 0) {
//		// port number
//		return callback(port);
//	}
//
//	return false;
//}
//
//function add(augend, addend) {
//  console.log( ((+augend || 0) + (+addend || 0)));
//}
//
//module.exports = add;