"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CNode = (function () {
    function CNode(type) {
        this.type = type;
        this.connections = [];
    }
    return CNode;
}());
exports.CNode = CNode;
var Coords = (function () {
    function Coords(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }
    return Coords;
}());
exports.Coords = Coords;
var COLConnectionInfo = (function () {
    function COLConnectionInfo() {
    }
    return COLConnectionInfo;
}());
exports.COLConnectionInfo = COLConnectionInfo;
var GraphNetworkHealth = (function () {
    function GraphNetworkHealth() {
    }
    return GraphNetworkHealth;
}());
exports.GraphNetworkHealth = GraphNetworkHealth;
var GraphNetworkUpdate = (function () {
    function GraphNetworkUpdate() {
    }
    return GraphNetworkUpdate;
}());
exports.GraphNetworkUpdate = GraphNetworkUpdate;
var GraphEdge = (function () {
    function GraphEdge() {
    }
    return GraphEdge;
}());
exports.GraphEdge = GraphEdge;
var GraphNetwork = (function () {
    function GraphNetwork() {
        this.nodes = {};
    }
    GraphNetwork.prototype.add = function (label, c) {
        this.nodes[label] = c;
        return c;
    };
    GraphNetwork.prototype.connector = function (node, to, bidirectional) {
        if (bidirectional === void 0) { bidirectional = true; }
        if (this.nodes.hasOwnProperty(node)) {
            for (var _i = 0, to_1 = to; _i < to_1.length; _i++) {
                var connect = to_1[_i];
                this.nodes[node].connections.push(connect);
                if (bidirectional) {
                    if (this.nodes.hasOwnProperty(connect)) {
                        this.nodes[connect].connections.push(node);
                    }
                    else {
                        throw "No such node in Network: " + connect + " (while connecting to: " + node + ")";
                    }
                }
            }
        }
        else {
            throw "No such node in Network: " + node;
        }
    };
    GraphNetwork.prototype.directConnection = function (node1, node2) {
        return this.nodes[node1].connections.indexOf(node2) != -1;
    };
    return GraphNetwork;
}());
exports.GraphNetwork = GraphNetwork;
var GeoGraphNetwork = (function (_super) {
    __extends(GeoGraphNetwork, _super);
    function GeoGraphNetwork() {
        _super.apply(this, arguments);
    }
    GeoGraphNetwork.prototype.search = function (c, criteria) {
    };
    GeoGraphNetwork.prototype.transfer = function () {
        return new Array();
    };
    GeoGraphNetwork.prototype.delta = function () {
        return new Array();
    };
    return GeoGraphNetwork;
}(GraphNetwork));
exports.GeoGraphNetwork = GeoGraphNetwork;
//# sourceMappingURL=graphnetwork.js.map