var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var URL = require('url');
var io = require('socket.io')(http, {
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 60000,
    cookie: false
});



const fs = require("fs");
class TTPatchServer {
    constructor() {}
    watch(callback, path) {
        fs.watch('./' + path + '/', (eventType, filename) => {
            if (filename) {
                console.log(msg(filename + ' ' + eventType));
                io.emit(eventId, msg("refresh:" + filename));
            }
        });
        fs.watch('./src', (eventType, filename) => {
            console.log(msg(filename + ' watch ' + eventType));
            if (filename) {
                callback();
            }
        });
    }

    start(path) {
        console.log('----------------------------------------------------------------------------------------------\n' + msg('本地服务已启动'))
        app.get('/*', function (req, res) {
            res.sendFile(__dirname + '/' + path + '/' + req.params[0]);
            console.log(msg('read:' + req.params[0]));
        });

        io.on('connection', function (socket) {
            // socket.emit(msg('hello'));
            // clientSocket.push(socket);
            socket.on('disconnect', (reason) => {
                console.log('disconnect:' + reason);

            });
            socket.on('error', (error) => {
                console.log('error:' + error);
            });
            socket.on('user_login', function (info) {
                const {
                    tokenId, userId, socketId
                } = info;
                console.log("user info" + tokenId, userId, socketId);
            });
        });


        http.listen(3000, function () {
            console.log(msg('listen local port:3000'));
            // io.emit(msg('on connection'), { for: 'everyone' });
        });
    }
}
let eventId = "message"
let msg = function (msg) {
    return "[TTPatch]: " + msg;
}

module.exports = TTPatchServer; 