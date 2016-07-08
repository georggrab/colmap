"use strict";
var GetEndpoint = (function () {
    function GetEndpoint(options) {
        this.db = options.database;
    }
    GetEndpoint.prototype.getRoute = function (req, res) {
        this.db.cypher({
            query: "MATCH (n) RETURN n"
        }, function (err, results) {
            if (err)
                throw err;
            res.json(results);
        });
    };
    GetEndpoint.prototype.getMethod = function () {
        return "GET";
    };
    return GetEndpoint;
}());
exports.GetEndpoint = GetEndpoint;
