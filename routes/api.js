var express         = require('express'),
    router          = express.Router(),
    input2content   = require('../src/input2content'),
    path            = require('path'),
    network         = require(path.resolve('./src/network')),
    db              = require(path.resolve('./src/db'));

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

var useAsDisplay = function(res, html) {
    if(window.syna) {
        window.syna.display(html);
        res.status(201).json({ message: "Input displayed." });
    }
    else {
        res.status(500).json({ error: "Missing view." });
    }
};

var useAsResponse = function(res, html, result) {
    res.json({
        request: result.request,
        data: result.data,
        rendered: html
    });
};


// Main route --
router.get('/sendText', function(req, res) {

    // Check rights --
    if (!req.isAuthenticated() && false) {
        res.status(401).json({ error: 'Unauthorized request.' });
        return;
    }

    // Check params --
    var input = req.query.input;
    if(!input) {
        res.status(400).json({ error: "Missing 'input' parameter." });
        return;
    }

    // Call the AI to get content --
    callAI(req, res, input, function(req, res, result, html) {
        if(req.query.display && req.query.display)  {
            useAsDisplay(res, html);
        }
        else {
            useAsResponse(res, html, result);
        }
    });
});

// Secondary reoutes --
router.get('/info', function(req, res) {
    var localIPs = network.getLocalIPs()
        result = { ips: [], code: "" };

    for (var currentInterface in localIPs) {
        if (localIPs.hasOwnProperty(currentInterface) && localIPs[currentInterface].IPv4 != "127.0.0.1") {
            result.ips.push(localIPs[currentInterface].IPv4);
        }
    }

    db.codes.then(function(codes){
        result.code = codes.findOne({ 'valid': true }).code;
        res.status(200).json(result);
    });
});

module.exports = router;
