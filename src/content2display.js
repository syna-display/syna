var jade = require('jade');

/* @param {string} request from input2content module
 * @return {string} html result to display
 */
exports.convert = function (request, target) {
    var html = jade.renderFile('view/' + request.view + '.jade', request);
    $(target).html(html);
};
