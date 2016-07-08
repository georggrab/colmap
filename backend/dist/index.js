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
var db = new neo4j.GraphDatabase("http://neo4j:admin@localhost:7474");
var route = express.Router();
var routeMap = [
    { "/:id/register": new register_1.RegisterEndpoint({
            database: db
        }) },
    { "/:id/propagate": new propagate_1.PropagateEndpoint({
            database: db
        }) },
    { "/:id/get": new get_1.GetEndpoint({
            database: db
        }) }
];
for (var _i = 0, routeMap_1 = routeMap; _i < routeMap_1.length; _i++) {
    var entry = routeMap_1[_i];
    for (var url in entry) {
        switch (entry[url].getMethod()) {
            case "GET":
                route.get(url, entry[url].getRoute.bind(entry[url]));
                break;
            case "POST":
                route.post(url, entry[url].getRoute.bind(entry[url]));
                break;
        }
    }
}
var users = 0;
io.on('connection', function (socket) {
    users++;
    io.sockets.emit('connectioninfo', {
        users: users,
        test: "test"
    });
    socket.on('disconnect', function () {
        users--;
        io.sockets.emit('connectioninfo', {
            users: users,
            test2: "test2"
        });
    });
});
app.use(Bodyparser.json());
app.use('/map', route);
http.listen(3001, function () {
    console.log("Listening on http://127.0.0.1:3001");
});
