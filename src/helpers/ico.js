var urlencode = require('urlencode');

module.exports.none = function() {
    return {
        type: 'none',
        uri: ''
    };
};

module.exports.url = function(input) {
    return {
        type: 'url',
        uri: urlencode(input)
    };
};

module.exports.domain = function(input) {
    return {
        type: 'url',
        uri: 'http://www.google.com/s2/favicons?domain=' + urlencode(input)
    };
};

module.exports.material = function(input) {
    return {
        type: 'material',
        uri: input
    };
};
