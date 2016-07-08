"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var graphnetwork_1 = require('../graph/graphnetwork');
var Observable_1 = require('rxjs/Observable');
var io = require('socket.io-client');
var BackendService = (function () {
    function BackendService() {
    }
    BackendService.prototype.connect = function (endpoint) {
        var _this = this;
        this.conn = io.connect('http://127.0.0.1:3001');
        this.conn.on('connect', function () {
            console.log("Socket.IO: Connected to server!");
        });
        return Observable_1.Observable.create(function (observer) {
            _this.conn.on('connect', function () {
                observer.next({
                    connected: true
                });
            });
            _this.conn.on('connectioninfo', function (things) {
                observer.next({
                    connected: true,
                    connectedUsers: things.users
                });
            });
        });
    };
    BackendService.prototype.downloadNetwork = function () {
        var _this = this;
        this.conn.emit('wantNetwork');
        return Observable_1.Observable.create(function (observer) {
            // TODO Stub for Network things!	
            _this.conn.on('getNetwork', function (network) {
                var g = new graphnetwork_1.GeoGraphNetwork();
                g.constructFrom(network);
                observer.next(g);
            });
            /*let g = new GeoGraphNetwork();

            g.add("Berlin", new CNode<Coords>(new Coords(52.5062185,12.8647592)));
            g.add("Stuttgart", new CNode<Coords>(new Coords(48.7791242,9.0371341)));
            g.add("London", new CNode<Coords>(new Coords(51.528308,-0.3817701)));
            g.add("NY", new CNode<Coords>(new Coords(43.9957508,-72.7008926)));

            g.connector("London", ["Berlin"], false);
            g.connector("NY", ["London"]);
            g.connector("London", ["Stuttgart"]);

            observer.next(g);*/
        });
    };
    BackendService.prototype.retrieveDelta = function (since) {
        return {
            nodesUpdated: 3,
            additiveNodes: [{ "SanFrancisco": new graphnetwork_1.CNode(new graphnetwork_1.Coords(37.543589, -123.1674184)) }],
            additions: [
                new graphnetwork_1.GraphEdge("NY", "SanFrancisco", true, null),
                new graphnetwork_1.GraphEdge("NY", "Stuttgart", false, null)
            ],
            deletions: [
                {
                    from: "London", to: "Berlin"
                }
            ],
            highlight: [
                {
                    from: "London", to: "Stuttgart"
                }
            ]
        };
    };
    BackendService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], BackendService);
    return BackendService;
}());
exports.BackendService = BackendService;
//# sourceMappingURL=server.js.map