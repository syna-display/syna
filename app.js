"use strict";

/**
 * Module dependencies.
 */
var path = require('path');
process.env['NODE_CONFIG_DIR'] = path.resolve('./config');

var express = require('express'),
    session = require('express-session'),
    config = require('config'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    network = require(path.resolve('./src/network')),
    db = require(path.resolve('./src/db')),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    lokiStore = require('loki-session'),
    store = lokiStore(path.resolve('./db.json')),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    flash = require ('connect-flash'),
    i18n = require('i18n'),
    io = require("socket.io").listen(server),
    passportSocketIo = require("passport.socketio"),
    display = require(path.resolve('./src/display')),
    sync = require(path.resolve('./src/sync'));

app.set('views', path.resolve('./views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(app.get('views'))));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    key:                'syna.sid',
    secret:             config.get('secret_token'),
    resave:             true,
    store:              store,
    saveUninitialized:  true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/locales', express.static(path.resolve('./locales')));
app.use(i18n.init);
i18n.configure({
    locales:['en', 'fr'],
    directory: path.resolve('./locales')
});

passport.use(new LocalStrategy({
        passwordField: 'code'
    },
    function(username, code, done) {
        process.nextTick(function () {
            db.codes.then(function(codes) {
                if (codes.findOne({ 'code': code, 'valid': true }) != null) {
                    return done(null, username);
                } else {
                    return done(null, false, { message: i18n.__('Error: Invalid code') });
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function onAuthorizeSuccess(data, accept){
    i18n.init(data);
    data.locale = i18n.getLocale(data);
    console.info(new Date().toLocaleString() + ' Successful connection to socket.io (lang: ' + data.user.locale + ')');
    accept();
}

function onAuthorizeFail(data, message, error, accept){
    console.info(new Date().toLocaleString() + ' Failed connection to socket.io: ' + message);
    if(error) {
        accept(new Error(message));
    }
}

var cookieAuth = passportSocketIo.authorize({
    cookieParser: cookieParser,
    store:        store,
    key:          "syna.sid",
    secret:       config.get("secret_token"),
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
});

io.use(function(socket, next) {
    cookieAuth(socket, next);
});

var index = require(path.resolve('./routes/index'));
var login = require(path.resolve('./routes/login'));
var api   = require(path.resolve('./routes/api'));

app.all('/', index.show);
app.all('/login', login.show);
app.all('/api/sendText', api.sendText);

app.use(function(req, res, next) {
    return res.render('404', {
        title: i18n.__('Page not found')
    });
});

io.on("connection", function(socket) {
    sync.init(socket);
});

display.startTile();

server.listen(config.get('server.port'), config.get('server.host'), function() {
    var localIPs = network.getLocalIPs();
    for (var currentInterface in localIPs) {
        if (localIPs.hasOwnProperty(currentInterface) && localIPs[currentInterface].IPv4 != "127.0.0.1") {
            console.info('Server started on http://%s:%d', localIPs[currentInterface].IPv4, server.address().port);
        }
    }
});

process.on('message', function(msg) {
    // PM2 Graceful reload
    if (msg === 'shutdown') {
        sync.close(io);

        process.exit(0);
    }
});

process.on('exit', function(code) {
    sync.close(io);
});

// Debug mode --
if(config.get('debug')) {
    require('nw.gui').Window.get().showDevTools();
}
