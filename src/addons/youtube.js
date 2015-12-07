var request = require('request-json'),
    urlencode = require('urlencode');
var client = request.createClient('https://www.googleapis.com/');

var buildPath = function(q) {
    return '/youtube/v3/search?part=id&q='
     + urlencode(q)
     + '&key=AIzaSyAuFUf5HgkNMAZi52D2hsTBnyb6FYBh5Co';
};

var apply = function(id, handle) {
    handle({
        view: 'youtube',
        url: 'http://www.youtube.com/embed/' + id + '?autoplay=1'
    });
}

var applyable = function(id) {
    return /^[a-zA-Z0-9]{11}$/.test(id);
};

/* Youtube Add-on
 * @arg {string} user input to convert into a webpage
 * @arg {function} callback to return the resulting webpage
 * @arg {function} callback to notify no handling
 * @see https://developers.google.com/youtube/player_parameters
 */
exports = function(request, handle, ignore) {
    var id = '';

    // Handle urls --
    if(request.url.query.hasOwnProperty('v')) {
        id = request.url.query.v.trim();
    }
    else if(request.url.hostname === 'youtu.be' && request.url.pathname != null) {
        id = request.url.pathname.substring(1).trim();
    }

    // If already valid --
    if(applyable(id)) {
        apply(id, handle);
        return;
    }

    // Search via API --
    if(request.bang.tag == 'yt') {
        client.get(buildPath(request.bang.input), function(err, res, body) {
          if(err) {
              ignore();
          } else {
              apply(body.items[0].id.videoId, handle);
          }
        });
        return;
    }

    ignore();
};
