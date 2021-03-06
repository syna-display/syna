var path    = require('path'),
    ico     = require(path.resolve('./src/helpers/ico'));

/* Handle unhandled input
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {
    handle({
        view: 'no-result',
        ico: ico.none()
    });
};
