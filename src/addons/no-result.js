/* Handle unhandled input
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
exports = function(request, handle, ignore) {
    handle({
        view: 'no-result'
    });
};
