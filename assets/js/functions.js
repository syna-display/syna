$(document).ready(function() {
    window.syna = {};

    // -- Methods --
    window.syna.display = function(html) {
        $('#display').html(html);
    };

    // -- Instructions --

    // Start tile --
    $.get('http://localhost:' + window.config.server.port + '/api/v1/sendText?input=!info&display=true');
})
