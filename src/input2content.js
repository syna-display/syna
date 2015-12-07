var Q = require('q');

// -- Helpers --
var helper = {
    url: require('./helpers/url.js'),
    bang: require('./helpers/bang.js')
}

// -- Load addons --
var addonList = [];
var addonToLoadList = [
    'youtube',
    'simple-url',
    'no-result'
];

addonToLoadList.forEach(function(addonName, i) {
    addonList.push(require('./addons/'+ addonName + '.js'));
});

/* @param {string} user input
 * @param {string} callback to return object to display
 */
module.exports = function (input, callback) {
    // Minimal processing --
    var request = {};
    request.input = input.trim();
    request.bang = helper.bang.handle(request.input);
    request.url = helper.url.handle(request.bang.input);

    // Use inputs --
    var chain = addonList.reduce(function (previous, addon) {
        return previous.then(function (previousValue) {

            if(!previousValue) {
                var deferred = Q.defer();
                addon(request, function(value) {
                    callback(value);
                    deferred.resolve(true);
                }, function() {
                    deferred.resolve(false);
                });
                previousValue = deferred.promise;
            }

            return previousValue;
        })
    }, Q.resolve(false));

    /*chain.then(function (lastResult) {
        console.log(lastResult);
    });*/
};
