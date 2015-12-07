var crypto = require('crypto'),
    Q = require('q'),
    Loki = require('lokijs'),
    db = new Loki('db.json', {
        autoload: true,
        autoloadCallback: loadHandler,
        autosave: true,
        autosaveInterval: 10000
    });

var codesDeferred = Q.defer();

function loadHandler() {
    var codes = db.getCollection('codes');
    if (codes === null) {
        codes = db.addCollection('codes');

        codes.insert({
            code: crypto.randomBytes(3).toString('hex').toUpperCase(),
            valid: true
        });
        db.saveDatabase();
    }

    console.log('code: ' + codes.findOne({ 'valid': true }).code);
    codesDeferred.resolve(codes);
}

exports.codes = codesDeferred.promise;
