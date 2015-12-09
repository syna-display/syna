var flash           = require('connect-flash'),
    input2content   = require('../src/input2content');

exports.sendText = function (req, res, next) {
    console.log(req, res);
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
};
