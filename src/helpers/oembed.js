var request     = require('request-json'),
    urlencode   = require('urlencode'),
    path        = require('path'),
    config      = require('config'),
    ico         = require(path.resolve('./src/helpers/ico'));

var list = config.get('oembed');

if(!list) {
    list = [];
    console.info('No oembed provider defined.');
}

// Internal methods --

var addProviderInfo = function(provider, object) {
    object.ico = ico.domain(provider.hostname)
    object.hooks = provider.hooks ? provider.hooks : [];
    return object;
}

// Usable methods --

exports.contains = function(inputUrl) {
    if(!inputUrl) {
        return {};
    }

    for (var providerName in list) {
        if(!list.hasOwnProperty(providerName)) {
            continue;
        }

        var provider = list[providerName];
        for (var i = 0; i < provider.contains.length; i++) {
            var key = provider.contains[i];

            if(inputUrl.indexOf(key) > -1) {
                return provider.data;
            }
        }
    }

    return {};
}

exports.get = function(id) {
    if(list.hasOwnProperty(id)) {
        return list[id].data;
    }
    return {};
};

exports.handle = function(provider, input, handle, ignore) {
    var client = request.createClient(provider.hostname);
    var path = provider.path + '?url=' + urlencode(input) + '&format=json';

    client.get(path, function(err, res, body) {
        if(err) {
            console.error(err, res, body);
            ignore();
            return;
        }

        switch(body.type) {
            case "photo":
                handle(addProviderInfo(provider, {
                    view: 'simple-image',
                    url: body.url
                }));
                return;
            case "video":
            case "rich":
                handle(addProviderInfo(provider, {
                    view: 'raw',
                    code: body.html
                }));
                return;
            case "link":
                console.error("Impossible to handle oEmbed result: link not supported");
                ignore();
                return;
            default:
                console.error(res, body);
                console.error("Impossible to handle oEmbed result: type unknown");
                ignore();
        }
    });
};
