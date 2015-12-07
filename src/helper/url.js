var url = require('url');

exports.handle = function(input) {
    var info = url.parse(input, true);

    return info;
};
