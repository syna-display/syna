(function ($) {
    $(document).ready(function () {
        var i18n = new I18n({directory: "/locales", extension: ".json"});

        i18n.setLocale(window.navigator.userLanguage || window.navigator.language);

        var socket = io.connect("//" + window.location.host);

        var addItem = function (item) {
            var div = document.createElement('div');
            div.id = item.id;
            div.className = "list-group-item";
            div.innerHTML = '<div class="row">'+
                                '<div class="bang col-md-1"><img src="'+ item.bang.ico +'" alt="'+ item.bang.name +'"/></div>'+
                                '<div class="command col-md-10">'+
                                    item.request+
                                '</div>'+
                                '<div class="button col-md-1">'+
                                    '<button type="button" class="btn btn-default"><i class="material-icons">cast</i></button>'+
                                '</div>'+
                            '</div>';

            document.getElementById("commands").appendChild(div)
        };

        // Send command's result
        $("#command").submit(function (e) {
            var postData = $(this).serialize();
            var formURL = $(this).attr("action");
            var method = $(this).attr("method");
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
                        });
                    }
                }
            });
            e.preventDefault();
        });

        // Sync clients
        socket.on("items:new", function (data) {
            addItem(data.data);
        });
    });
})(jQuery);
