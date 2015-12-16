var flash = require ('connect-flash');

exports.show = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    return res.render("index", {
        errors: req.flash('error'),
        username: req.user.username,
        code: req.user.code
    });
};
