var path    = require('path'),
    ico     = require(path.resolve('./src/helpers/ico'));

/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {
    if(false) {
        handle({
            view: 'no-result',
            ico: ico.none()
        });
        return;
    }

    ignore();
};
