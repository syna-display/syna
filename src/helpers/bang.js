module.exports.handle = function(input) {
    var info = /^!([a-z]*)( .*)?$/.exec(input);
    var result = {
        input: input,
        tag: ''
    };

    if(info != null) {
        result.input = info[2] ? info[2] : '';
        result.tag = info[1];
    }

    return result;
};
