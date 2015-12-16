(function ($) {
    $(document).ready(function () {
        var i18n = new I18n({directory: "/locales", extension: ".json"});

        i18n.setLocale(window.navigator.userLanguage || window.navigator.language);

        var socket = io.connect("//" + window.location.host);

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

                        });
                    }
                    console.log(res);
                }
            });
            e.preventDefault();
        });
    });
})(jQuery);
