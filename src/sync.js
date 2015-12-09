var sockets = [];

exports.init = function(socket) {
    sockets.push(socket);

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
