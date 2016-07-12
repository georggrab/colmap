"use strict";
var GetEndpoint = (function () {
    function GetEndpoint(options) {
        this.db = options.database;
    }
    GetEndpoint.prototype.get = function (callback) {
        this.db.cypher({
            query: "MATCH (n:CNode)-[r:HYPERLINKS*0..]-(m:CNode) RETURN n,r,m"
        }, function (err, results) {
            if (err)
                throw err;
            callback(results);
        });
    };
    GetEndpoint.prototype.getRoute = function (req, res) {
        this.get(function (result) { return res.json(result); });
    };
    GetEndpoint.prototype.getMethod = function () {
        return "GET";
    };
    return GetEndpoint;
}());
exports.GetEndpoint = GetEndpoint;
