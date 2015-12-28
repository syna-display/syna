(function ($) {
    $(document).ready(function () {
        $('#code-input a').on('click', function(e){
            e.preventDefault();
            $.post('/api/v1/displayOverlay');
        });
    });
})(jQuery);
