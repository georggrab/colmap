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
        this.serviceMap = new Map();
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
                    connectedUsers: things.users
                });
            });
            _this.conn.on('servicepropagating', function (serviceInfo) {
                console.log(serviceInfo);
                _this.serviceMap.set(serviceInfo.s._id, serviceInfo.s);
                observer.next({
                    connectedServices: _this.serviceMap.size,
                    allServices: _this.serviceMap
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
        });
    };
    BackendService.prototype.activateDelta = function (since) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            _this.conn.on('networkupdate', function (update) {
                var nodesUpdated = 0, additiveNodes = [], additions = [], deletions = [], highlight = [];
                for (var _i = 0, update_1 = update; _i < update_1.length; _i++) {
                    var entry = update_1[_i];
                    for (var updateType in entry) {
                        switch (updateType) {
                            case "addNode":
                                for (var _a = 0, _b = entry[updateType]; _a < _b.length; _a++) {
                                    var el = _b[_a];
                                    var node = {};
                                    node[el.ip] = new graphnetwork_1.CNode(new graphnetwork_1.Coords(el.x, el.y));
                                    additiveNodes.push(node);
                                }
                                break;
                            case "highlightNode":
                                // todo highlightnode
                                break;
                            case "highlightEdge":
                                for (var _c = 0, _d = entry[updateType]; _c < _d.length; _c++) {
                                    var el = _d[_c];
                                    highlight.push({ from: el[0], to: el[1] });
                                }
                                break;
                            case "addEdge":
                                for (var _e = 0, _f = entry[updateType]; _e < _f.length; _e++) {
                                    var el = _f[_e];
                                    additions.push(new graphnetwork_1.GraphEdge(el[0], el[1], false, null));
                                }
                                break;
                            case "rmNode":
                                //rmNode not yet implemented!
                                /*for (let el of entry[updateType]){
                            //todo bug in here
                                    console.log("in rmNode");
                                    console.log(el);
                                    deletions.push(<GraphEdge> { from : el[0], to: el[1]});
                                }*/
                                break;
                        }
                    }
                }
                observer.next({
                    additiveNodes: additiveNodes, nodesUpdated: nodesUpdated,
                    additions: additions, deletions: deletions, highlight: highlight });
            });
        });
        /*return <GraphNetworkUpdate> {
            nodesUpdated: 3,
            additiveNodes : [{"SanFrancisco" : new CNode<Coords>(new Coords(37.543589,-123.1674184))}],
            additions: [
                new GraphEdge("NY", "SanFrancisco", true, null),
                new GraphEdge("NY", "Stuttgart", false, null)
            ],
            deletions: [
                <GraphEdge> {
                    from: "London", to : "Berlin"
                }
            ],
            highlight: [
                <GraphEdge> {
                    from: "London", to: "Stuttgart"
                }
            ]
        }*/
    };
    BackendService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], BackendService);
    return BackendService;
}());
exports.BackendService = BackendService;
//# sourceMappingURL=server.js.map