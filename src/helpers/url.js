var url = require('url');

module.exports.handle = function(input) {
    var info = url.parse(input, true);

    return info;
};
