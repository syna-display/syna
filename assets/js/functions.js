$(document).ready(function() {
    window.syna = {};

    // -- Methods --
    window.syna.display = function(html) {
        $('#display').html(html);
    };

    // -- Instructions --

    // Start tile --
    var startTile = function() {
        $.get('http://localhost:'
            + window.config.server.port
            + '/api/v1/sendText?input=!info&display=true')
         .done(function() {
             console.log('Start tile: OK');
         })
         .fail(function(){
            console.log('Error on start tile. Retry in 3 seconds.');
            setTimeout(startTile, 3000);
        });
    };
    startTile();

})
