var path = require('path'),
    network = require(path.resolve('./src/network')),
    db = require(path.resolve('./src/db')),
    $ = require('jQuery');

exports.showInfos = function() {
    var localIPs = network.getLocalIPs();
    for (var currentInterface in localIPs) {
        if (localIPs.hasOwnProperty(currentInterface) && localIPs[currentInterface].IPv4 != "127.0.0.1") {
            $('#networks').append('<li>' + localIPs[currentInterface].IPv4 + '</li>');
        }
    }

    db.codes.then(function(codes){
        $('#code').html(codes.findOne({ 'valid': true }).code);
    });
};
