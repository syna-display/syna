// Get the item list sortable
var el = document.getElementById('commands');
Sortable.create(el, {
    onUpdate: function (evt) {
        console.log(evt);
    }
});// https://github.com/RubaXa/Sortable

// Send command input's result
$("#command").submit(function(e) {
    var postData = $(this).serialize();
    var formURL = $(this).attr("action");
    var method = $(this).attr("method");
    $.ajax({
        url: formURL,
        type: method,
        data: postData,
        success: function (data, textStatus, jqXHR) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
    e.preventDefault();
});
