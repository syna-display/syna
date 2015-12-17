var passport = require("passport"),
    i18n = require('i18n');

exports.login = function(req, res, next) {
    if (req.method === "GET") {
        if (req.isAuthenticated()) {
            res.redirect('/');
        }

        return res.render("login", {
            errors: req.flash('error'),
            user: req.user
        });
    } else {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { req.flash('error', i18n.__('Error: Invalid code')); return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect("/");
            });
        })(req, res, next);
    }
};

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};
