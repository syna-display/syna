var path = require('path'),
    db = require(path.resolve('./src/db')),
    sockets = [];

exports.init = function(socket) {
    sockets.push(socket);

    db.get(function(database) {
        socket.emit("items:list", database.items.find());

        socket.on("items:new", function(data) {
            // Add and display a new item
        });
    });

    socket.on("disconnect", function() {
        sockets.splice(sockets.indexOf(socket), 1);
    });
};

exports.close = function(io) {
    io.server.close();
    sockets.forEach(function(socket) {
        socket.destroy();
    });
};
