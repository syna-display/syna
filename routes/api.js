var express         = require('express'),
    router          = express.Router(),
    crypto          = require('crypto'),
    path            = require('path'),
    passport        = require('passport'),
    input2content   = require(path.resolve('./src/input2content')),
    network         = require(path.resolve('./src/network')),
    db              = require(path.resolve('./src/db')),
    synaInfo        = require(path.resolve('./src/addons/syna-info'));

// Functions --
var callAI = function(req, res, input, callback) {
    input2content(input, function(result) {

        // Use the ExpressJS render template --
        res.render('tiles/' + result.data.view, result.data, function(err, html) {
            if(err) {
                console.error(err);
                res.status(500).json({ error: err.message });
                return false;
            }

            callback(req, res, result, html);
            return false;
        });
    });
};

var useAsDisplay = function(res, html, result) {
    if(window.syna) {
        window.syna.display(html, result.data.hooks);
        res.status(201).json({ message: "Input displayed." });
    }
    else {
        res.status(500).json({ error: "Missing view." });
    }
};

var useAsResponse = function(res, html, result) {
    res.json({
        id: crypto.randomBytes(20).toString('hex'),
        bang: result.data.view,
        icotype: result.data.ico.type,
        ico: result.data.ico.url,
        request: result.request.bang.input,
        html: html
    });
};


// Main route --
router.post('/sendText', function(req, res, next) {

    passport.authenticate('basic', function(err, user, info){

        if(err) return console.log(err);

        if(!user){
            res.set('WWW-Authenticate', 'syna' + info);
            return res.send(401);
        }

        // Check params --
        var input = req.body.input || req.query.input;
        var display = req.body.display || req.query.display;
        if(!input) {
            res.status(400).json({ error: "Missing 'input' parameter." });
            return;
        }

        // Call the AI to get content --
        callAI(req, res, input, function(req, res, result, html) {
            if(display)  {
                useAsDisplay(res, html, result);
            }
            else {
                useAsResponse(res, html, result);
            }
        });
    })(req, res, next);
});

// Secondary route --
router.get('/info', function(req, res) {
    var request = {
        bang: {
            tag: 'info'
        }
    };

    synaInfo(request, function(info) {
        var response = {
            code: info.code,
            ips: info.ips
        }
        res.status(200).json(response);
    }, function() {
        res.status(500).json({error: 'The AI is lazy'});
    })
});

module.exports = router;
