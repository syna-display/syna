var path    = require('path'),
    ico     = require(path.resolve('./src/helpers/ico'));

var regexExt = /\.(jpeg|jpg|gif|png|bmp|svg)$/;

/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {
    if(regexExt.test(request.url.pathname)) {
        handle({
            view: 'simple-image',
            url: request.url.href,
            ico: ico.domain(request.url.hostname)
        });
        return;
    }

    ignore();
};
