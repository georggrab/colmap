"use strict";
var utils_1 = require('../util/utils');
var RegisterEndpoint = (function () {
    function RegisterEndpoint(options) {
        this.db = options.database;
    }
    RegisterEndpoint.prototype.generateAccessKey = function () {
        return Math.random().toString(36).substr(2, 5);
    };
    RegisterEndpoint.prototype.getRoute = function (req, res) {
        if (!utils_1.Utils.defined(req.body, ["trigger", "type"]))
            return;
        var key = this.generateAccessKey();
        this.db.cypher({
            query: "CREATE (n:Service{trigger: {trg}, type: {typ}, key : {key}})",
            params: {
                trg: req.body.trigger,
                typ: req.body.type,
                key: key
            }
        }, function (err, results) {
            if (err)
                throw err;
            res.json(results);
        });
    };
    RegisterEndpoint.prototype.getMethod = function () {
        return "POST";
    };
    return RegisterEndpoint;
}());
exports.RegisterEndpoint = RegisterEndpoint;
