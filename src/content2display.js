var jade = require('jade'),
    Q    = require('q');

/* @param {string} request from input2content module
 * @return {string} html result to display
 */
module.exports = function (request, target) {
    var render = Q.nfbind(jade.renderFile);
    render('./views/tiles/' + request.view + '.jade', request).done(function (html) {
        if(window.syna) {
            window.syna.display(html);
        }
        else {
            console.error("[content2display] Missing syna object (view).");
        }
    });
};
