var crypto = require('crypto'),
    Loki = require('lokijs'),
    db = new Loki('db.json', {
        autoload: true,
        autoloadCallback: loadHandler,
        autosave: true,
        autosaveInterval: 10000
    }),
    codes = null;

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

    console.log('code: ' + codes.findOne({ 'valid': true }).code);

    exports.codes = codes;
}
