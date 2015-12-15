var path    = require('path'),
    ico     = require(path.resolve('./src/helpers/ico'));

/* Handle simple urls
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 * @see http://www.w3schools.com/tags/tag_iframe.asp
 */
module.exports = function(request, handle, ignore) {
    if(request.url.host != null) {
        handle({
            view: 'simple-url',
            url: request.url.href,
            ico: ico.domain(request.url.hostname)
        });
        return;
    }

    ignore();
};
