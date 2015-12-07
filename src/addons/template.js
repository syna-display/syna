/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
exports = function(request, handle, ignore) {
    if(false) {
        handle({
            view: 'no-result'
        });
        return;
    }

    ignore();
};
