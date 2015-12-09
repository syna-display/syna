$(document).ready(function() {
    window.syna = {};

    // -- Methods --
    window.syna.display = function(html) {
        $('#display').html(html);
    };

    // -- Instructions --
    console.log(window);
    $.get('http://localhost:' + window.config.server.port + '/api/v1/sendText?input=!info&display=true');
})
