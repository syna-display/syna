(function($) {
    $(document).ready(function() {
        var i18n = new I18n({directory: "/locales", extension: ".json"});

        i18n.setLocale(window.navigator.userLanguage || window.navigator.language);

        var socket = io.connect("//" + window.location.host);
    });
})(jQuery);
