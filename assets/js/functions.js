window.syna = {};
window.syna.hooks = {};

// -- Custom promise system --

window.syna.status = {
    code:   false,
    jquery: false,
    server: false
}

window.syna.onLoaded = function(resource) {
    if(window.syna.status.hasOwnProperty(resource)) {
        window.syna.status[resource] = true;
    }
    var ready = true;

    for (var status in window.syna.status) {
        if (window.syna.status.hasOwnProperty(status)) {
            if(!window.syna.status[status]) {
                ready = false;
            }
        }
    }

    if(ready) {
        window.syna.startTile();
    }
}

// -- Start jquery functions --

$(document).ready(function () {

    // -- Methods --

    window.syna.display = function (html, hooks) {
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
            var iframe = $("iframe").contents();

            // Replay --
            var total   = iframe.find('#total-slides').text(),
                current = iframe.find('#current-slide').text();

            iframe.find('#btnNext').click();

            if(current == total && total != '') {
                var btns = iframe.find('.replay-btn');
                if(btns.length > 0) {
                    btns[0].click();
                }
            }

            setTimeout(clickOnNext, 4000);
        }

        clickOnNext();
    };

    // -- Instructions --

    window.syna.startTile = function () {
        $.ajax({
            type: "POST",
            url: 'http://localhost:' + window.config.server.port + '/api/v1/sendText',
            data: {
                "input": "!info",
                "display": true
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('syna:' + window.syna.code));
            },
            success: function () {
                console.log('Start tile: OK');
            },
            error: function () {
                console.log('Error on start tile. Retry in 3 seconds.');
                setTimeout(window.syna.startTile, 3000);
            },
            dataType: "json"
        });
    };

    window.syna.onLoaded('jquery');
});
