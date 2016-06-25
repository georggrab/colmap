"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CNode = (function () {
    function CNode() {
    }
    return CNode;
}());
var Coords = (function () {
    function Coords(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }
    return Coords;
}());
var GraphNetwork = (function () {
    function GraphNetwork() {
    }
    return GraphNetwork;
}());
var GeoGraphNetwork = (function (_super) {
    __extends(GeoGraphNetwork, _super);
    function GeoGraphNetwork() {
        _super.apply(this, arguments);
    }
    GeoGraphNetwork.prototype.add = function (c) {
    };
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