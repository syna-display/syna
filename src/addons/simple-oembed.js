var path = require('path'),
    oembed = require(path.resolve('./src/helpers/oembed')),
    Q = require('q');

/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {

    var provider = oembed.contains(request.url.hostname);

    if(provider.hasOwnProperty('hostname') && provider.hasOwnProperty('path')) {
        oembed.handle(provider, request.bang.input, handle, ignore);
        return;
    }

    ignore();

};
