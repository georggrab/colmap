"use strict";
var GetEndpoint = (function () {
    function GetEndpoint() {
    }
    GetEndpoint.prototype.getRoute = function (req, res) {
        res.json({ ohai: "stub" });
    };
    GetEndpoint.prototype.getMethod = function () {
        return "GET";
    };
    return GetEndpoint;
}());
exports.GetEndpoint = GetEndpoint;
