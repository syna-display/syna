var regexExt = /\.(jpeg|jpg|gif|png)$/;

/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {
    if(regexExt.test(request.url.pathname)) {
        handle({
            view: 'simple-image',
            url: request.url.href
        });
        return;
    }

    ignore();
};
