var express         = require('express'),
    router          = express.Router(),
    input2content   = require('../src/input2content'),
    path            = require('path'),
    network         = require(path.resolve('./src/network')),
    db              = require(path.resolve('./src/db'));

// Main function --
router.get('/sendText', function(req, res) {
    if (req.isAuthenticated() || true) {
        var input = req.query.input;
        if(input) {
            // Call the AI to get content --
            input2content(input, function(result) {
                console.log(result);

                // Use the ExpressJS render template --
                res.render('tiles/' + result.data.view, result.data, function(err, html) {
                    if(err) {
                        console.error(err);
                        res.status(500).json({ error: err.message });
                        return false;
                    }

                    // Display only --
                    if(req.query.display && req.query.display)  {
                        if(window.syna) {
                            window.syna.display(html);
                            res.status(201).json({ message: "Input displayed." });
                        }
                        else {
                            res.status(500).json({ error: "Missing view." });
                        }
                    }
                    // Compute only --
                    else {
                        res.json({
                            request: result.request,
                            data: result.data,
                            rendered: html
                        });
                    }

                    return false;
                });
            });
        }
        else {
            res.status(400).json({ error: "Missing 'input' parameter." });
        }
    }
    else {
        res.status(401).json({ error: 'Unauthorized request.' });
    }
});

// Secondary functions --
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
