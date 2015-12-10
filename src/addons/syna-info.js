var path = require('path'),
    network = require(path.resolve('./src/network')),
    db = require(path.resolve('./src/db'));

/* Template : duplicate this file to create a new add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 */
module.exports = function(request, handle, ignore) {
    if(request.bang.tag == 'info') {
        var localIPs = network.getLocalIPs(),
            result = {
                view: 'syna-info',
                ips: []
            };
        for (var currentInterface in localIPs) {
            if (localIPs.hasOwnProperty(currentInterface) && localIPs[currentInterface].IPv4 != "127.0.0.1") {
                result.ips.push('http://' + localIPs[currentInterface].IPv4 + '/');
            }
        }
        db.get(function(database) {
            result.code = database.codes.findOne({ 'valid': true }).code;
            handle(result);
        });

        return;
    }

    ignore();
};
