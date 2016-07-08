"use strict";
var utils_1 = require('../util/utils');
var RegisterEndpoint = (function () {
    function RegisterEndpoint(options) {
        this.db = options.database;
    }
    RegisterEndpoint.prototype.getRoute = function (req, res) {
        if (!utils_1.Utils.defined(req.body, ["trigger", "type"]))
            return;
        this.db.cypher({
            query: "CREATE (n:Service{trigger: {trg}, type: {typ}})",
            params: {
                trg: req.body.trigger,
                typ: req.body.type
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
