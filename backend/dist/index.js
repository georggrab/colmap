"use strict";
var Bodyparser = require("body-parser");
var propagate_1 = require('./func/propagate');
var register_1 = require('./func/register');
var get_1 = require('./func/get');
var express = require("express");
var app = express();
var neo4j = require("neo4j");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var Backend = (function () {
    function Backend() {
        this.db = new neo4j.GraphDatabase("http://neo4j:admin@localhost:7474");
        this.route = express.Router();
        this.registerEndpoint = new register_1.RegisterEndpoint({ database: this.db });
        this.propagateEndpoint = new propagate_1.PropagateEndpoint({ database: this.db, socket: io });
        this.getEndpoint = new get_1.GetEndpoint({ database: this.db });
        this.routeMap = [
            { "/:id/register": this.registerEndpoint },
            { "/:id/propagate": this.propagateEndpoint },
            { "/:id/get": this.getEndpoint }
        ];
        this.users = 0;
    }
    Backend.prototype.beginSocketServe = function () {
        var _this = this;
        io.on('connection', function (socket) {
            _this.users++;
            io.sockets.emit('connectioninfo', {
                users: _this.users,
            });
            socket.on('wantNetwork', function () {
                _this.getEndpoint.get(function (network) {
                    socket.emit('getNetwork', network);
                });
            });
            socket.on('disconnect', function () {
                _this.users--;
                io.sockets.emit('connectioninfo', {
                    users: _this.users,
                });
            });
        });
    };
    Backend.prototype.getRoute = function () {
        for (var _i = 0, _a = this.routeMap; _i < _a.length; _i++) {
            var entry = _a[_i];
            for (var url in entry) {
                switch (entry[url].getMethod()) {
                    case "GET":
                        this.route.get(url, entry[url].getRoute.bind(entry[url]));
                        break;
                    case "POST":
                        this.route.post(url, entry[url].getRoute.bind(entry[url]));
                        break;
                }
            }
        }
        return this.route;
    };
    return Backend;
}());
(function main(errorRecursionDepth) {
    var b = new Backend();
    b.beginSocketServe();
    app.use(Bodyparser.json());
    app.use('/map', b.getRoute());
    http.listen(3001, function () {
        console.log("Listening on http://127.0.0.1:3001");
    });
    process.on('uncaughtException', function (err) {
        if (errorRecursionDepth > 10) {
            console.error("Zu viele Fehler. Fix dein Programm, Georg!");
            process.exit(1);
        }
        console.warn("Something terrible happened! Exception:");
        console.warn(err);
        console.warn("Attempting to recover from Error...");
        return main(errorRecursionDepth + 1);
    });
})(0);
