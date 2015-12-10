var request = require('request-json'),
    urlencode = require('urlencode');

var list = {
    "flickr" : {
        contains: [ "flickr" ],
        data: {
            hostname: "http://www.flickr.com",
            path: "/services/oembed"
        }
    },
    "slideshare" : {
        contains: [ "slideshare" ],
        data: {
            hostname: "http://fr.slideshare.net",
            path: "/api/oembed/2"
        }
    }
}

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
                handle({
                    view: 'simple-image',
                    url: body.url
                });
                return;
            case "video":
            case "rich":
                handle({
                    view: 'raw',
                    code: body.html
                });
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
