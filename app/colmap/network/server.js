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
var BackendService = (function () {
    function BackendService() {
    }
    BackendService.prototype.connect = function (endpoint) {
        return {
            connected: true,
            connectedUsers: 5,
            connectedServices: 1,
            graphnetwork: {
                nodes: 4,
                lastUpdate: 2222222222
            }
        };
    };
    BackendService.prototype.downloadNetwork = function () {
        var g = new graphnetwork_1.GeoGraphNetwork();
        g.add("node1", new graphnetwork_1.CNode(new graphnetwork_1.Coords(123, 321)));
        g.add("node2", new graphnetwork_1.CNode(new graphnetwork_1.Coords(123, 123)));
        g.add("node3", new graphnetwork_1.CNode(new graphnetwork_1.Coords(456, 789)));
        g.add("node4", new graphnetwork_1.CNode(new graphnetwork_1.Coords(975, 451)));
        g.connector("node1", ["node2", "node3"], false);
        g.connector("node4", ["node3"]);
        return g;
    };
    BackendService.prototype.retrieveDelta = function (since) {
        return {
            nodesUpdated: 3,
            additions: [
                {
                    from: "node1", to: "node4", bidirectional: true
                }
            ],
            deletions: [
                {
                    from: "node1", to: "node2"
                }
            ],
            highlight: [
                {
                    from: "node4", to: "node3"
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