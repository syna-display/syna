var jade = require('jade'),
    Q    = require('q'),
    $    = require('jQuery');

/* @param {string} request from input2content module
 * @return {string} html result to display
 */
module.exports = function (request, target) {
    var render = Q.nfbind(jade.renderFile);
    render('./views/tiles/' + request.view + '.jade', request).done(function (html) {
        $('#display').html(html);
    });
};
