$(document).ready(function() {
    window.syna = {};
    window.syna.hooks = {};

    // -- Methods --
    window.syna.display = function(html, hooks) {
        $('#display').html(html);

        if(hooks && hooks.ondisplay) {
            var hook = hooks.ondisplay;
            if(window.syna.hooks.hasOwnProperty(hook)) {
                window.syna.hooks[hook]("id"); // TODO Generate an ID --
            }
        }
    };

    // -- Hooks --

    window.syna.hooks.autoplaySlideshare = function(id) {

        var clickOnNext = function() {
            var button = $("iframe").contents().find('#btnNext');
            button.click();
            setTimeout(clickOnNext, 4000);
        }

        clickOnNext();
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
