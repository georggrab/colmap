"use strict";
var Exp = require("express");
var Server = require("http");
var propagate_1 = require('./func/propagate');
var register_1 = require('./func/register');
var get_1 = require('./func/get');
var app = Exp();
var route = Exp.Router();
var routeMap = [
    { "/:id/register": new register_1.RegisterEndpoint() },
    { "/:id/propagate": new propagate_1.PropagateEndpoint() },
    { "/:id/get": new get_1.GetEndpoint() }
];
for (var _i = 0, routeMap_1 = routeMap; _i < routeMap_1.length; _i++) {
    var entry = routeMap_1[_i];
    for (var url in entry) {
        switch (entry[url].getMethod()) {
            case "GET":
                route.get(url, entry[url].getRoute);
                break;
            case "POST":
                route.post(url, entry[url].getRoute);
                break;
        }
    }
}
app.use('/map', route);
Server.createServer(app).listen(3001);
