(function ($) {
    $(document).ready(function () {
        var i18n = new I18n({directory: "/locales", extension: ".json"});

        i18n.setLocale(window.navigator.userLanguage || window.navigator.language);

        var socket = io.connect("//" + window.location.host);

        // Add an item on top of the list
        var addItem = function (item) {
            var div = document.createElement('div');
            div.id = item.id;
            div.className = "list-group-item";
            div.innerHTML = '<div class="row">'+
                                '<div class="bang col-lg-1 col-md-1 col-sm-2 col-xs-2"><img src="'+ item.bang.ico +'" alt="'+ item.bang.name +'"/></div>'+
                                '<div class="command col-lg-11 col-md-11 col-sm-10 col-xs-10">'+
                                    item.request+
                                '</div>'+
                            '</div>';

            $("#commands").prepend(div);
        };

        // Clear command's text
        var clearCommand = function () {
            $(':input','#command')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
        };

        // Send command's result
        var sendText = function () {
            var command = $("#command");
            var postData = command.serialize();
            var formURL = command.attr("action");
            var method = command.attr("method");
            $.ajax({
                type: method,
                url: formURL,
                data: postData,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ('Authorization', 'Basic ' + btoa(user.username + ':' + user.code));
                },
                success: function (res, html, result) {
                    if (res.bang.name != "no-result") {
                        socket.emit("items:new", {data: res}, function (data) {
                            addItem(data.data);
                            clearCommand();
                        });
                    }
                }
            });
        };

        // Send command's result
        var sendSynaInfo = function () {
            $.ajax({
                type: "POST",
                url: '/api/v1/sendText',
                data: {
                    "input": "!info",
                    "display": true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ('Authorization', 'Basic ' + btoa(user.username + ':' + user.code));
                },
                success: function (res, html, result) {
                  // We don't care of the result
                }
            });
        };

        // Sync clients
        socket.on("items:new", function (data) {
            addItem(data.data);
        });

        // Send command's result
        $("#command").submit(function (e) {
            sendText();
            e.preventDefault();
        });

        // Send command's result
        $("#submitcommand").click(function (e) {
            sendText();
            e.preventDefault();
        });

        // On "terminate" button : redisplay home
        $("#endsession").click(function (e) {
            sendSynaInfo();
            socket.emit("session:end", function () {
                window.location.href = "/logout";
            });
            e.preventDefault();
        });

        // Sync clients
        socket.on("session:end", function () {
            window.location.href = "/logout";
        });
    });
})(jQuery);
