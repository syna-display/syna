var crypto = require('crypto'),
    Q = require('q'),
    Loki = require('lokijs'),
    db = new Loki('db.json', {
        autoload: true,
        autoloadCallback: loadHandler,
        autosave: true,
        autosaveInterval: 10000
    });

var deferred = Q.defer();

var codes, items;

function loadHandler() {
    codes = db.getCollection('codes');
    if (codes === null) {
        codes = db.addCollection('codes');

        codes.insert({
            code: crypto.randomBytes(3).toString('hex').toUpperCase(),
            valid: true
        });
        db.saveDatabase();
    }

    items = db.getCollection('items');
    if(items === null) {
        items = db.addCollection('items');
    }

    window.syna.code = codes.findOne({ 'valid': true }).code;
    window.syna.onLoaded('code');
    console.log('code: ' + window.syna.code);
    deferred.resolve({codes: codes, items: items});
}

exports.get = function(fn) {
    var promise = deferred.promise;
    promise.then(fn);
    return promise;
};

exports.close = function() {
    db.close();
};
