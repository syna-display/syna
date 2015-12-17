(function ($) {
    $(document).ready(function () {
        // Get item list sortable
        var el = document.getElementById('commands');
        Sortable.create(el, {
            onUpdate: function (evt) {
                console.log(evt);
            }
        });// https://github.com/RubaXa/Sortable
    });
})(jQuery);
