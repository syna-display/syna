var flash           = require('connect-flash'),
    input2content   = require('../src/input2content'),
    content2display = require('../src/content2display');

exports.sendText = function (req, res, next) {
    console.log(req, res);
    if (req.isAuthenticated() || true) {
        var input = req.query.input;
        if(input) {
            input2content(input, function(result) {
                console.log(result);
                res.status(201).send({
                    message: 'Input sent.',
                    result : result
                });
            });
        }
        else {
            res.status(400).send({ error: "Missing 'input' parameter." });
        }
    }
    else {
        res.status(401).send({ error: 'Unauthorized request.' });
    }
};
