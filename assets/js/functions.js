window.syna = {};

$(document).ready(function () {

    // -- Methods --
    window.syna.display = function (html) {
        $('#display').html(html);
    };

    // -- Instructions --

    // Start tile --
    var startTile = function () {
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
                setTimeout(startTile, 3000);
            },
            dataType: "json"
        });
    };
    startTile();
});
