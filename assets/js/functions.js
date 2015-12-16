window.syna = {};
window.syna.hooks = {};

// -- Custom promise system --

window.syna.status = {
    code:   false,
    jquery: false,
    server: false
}

window.syna.onLoaded = function(resource) {

    // Set the resource to true --
    if(window.syna.status.hasOwnProperty(resource)) {
        window.syna.status[resource] = true;
    }

    // Check every resource --
    var ready = true;
    for (var status in window.syna.status) {
        if (window.syna.status.hasOwnProperty(status)) {
            if(!window.syna.status[status]) {
                ready = false;
            }
        }
    }

    // Start the view --
    if(ready) {
        window.syna.startTile();
        window.syna.startOverlay();
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

    window.syna.displayOverlay = function(duration) {
        var overlay = $("#overlay");
        overlay.show(200);
        setTimeout(function() {
            overlay.hide(200);
        }, duration * 1000);
    }

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

    window.syna.startOverlay = function () {
        $.ajax({
            type: "GET",
            url: 'http://localhost:' + window.config.server.port + '/api/v1/info',
            beforeSend: function (xhr) {
                xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('syna:' + window.syna.code));
            },
            success: function (result) {
                var overlay = $('#overlay');
                overlay.hide();
                for (ip of result.ips) {
                    overlay.append($('<p></p>').addClass('ip').text(ip));
                }
                overlay.append($('<p></p>').addClass('code').html('Code : <span class="code">' + result.code + '</span>'));

                console.log('Overlay: OK');
            },
            error: function () {
                console.log('Error on overlay initialisation. Retry in 3 seconds.');
                setTimeout(window.syna.startOverlay, 3000);
            },
            dataType: "json"
        });
    };

    window.syna.onLoaded('jquery');
});
