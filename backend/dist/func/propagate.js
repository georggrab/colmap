"use strict";
var utils_1 = require('../util/utils');
var PropagateEndpoint = (function () {
    function PropagateEndpoint(options) {
        this.db = options.database;
    }
    PropagateEndpoint.prototype.getRoute = function (req, res) {
        var btc = [];
        if (req.body["highlightNode"]) {
        }
        if (req.body["highlightEdge"]) {
        }
        if (req.body["addNode"]) {
            for (var _i = 0, _a = req.body.addNode; _i < _a.length; _i++) {
                var node = _a[_i];
                if (!utils_1.Utils.defined(node, ["ip", "x", "y"]))
                    return;
                btc.push({
                    query: "CREATE (n:CNode{\n\t\t\t\t\t\tip: {ip}, x: {x}, y: {y}}) RETURN ID(n)",
                    params: {
                        ip: node.ip, x: node.x, y: node.y }
                });
            }
        }
        if (req.body["addEdge"]) {
            for (var _b = 0, _c = req.body.addEdge; _b < _c.length; _b++) {
                var nodes = _c[_b];
                btc.push({
                    query: "MATCH (r0:CNode), (r1:CNode) WHERE ID(r0)={id_a} AND ID(r1)={id_b}\n\t\t\t\t\t\tCREATE (r0)-[:HYPERLINKS]->(r1) RETURN r0,r1",
                    params: {
                        id_a: nodes[0], id_b: nodes[1]
                    }
                });
            }
        }
        if (req.body["rmNode"]) {
            for (var _d = 0, _e = req.body.rmNode; _d < _e.length; _d++) {
                var nodeid = _e[_d];
                btc.push({
                    query: "Start n=node({id}) OPTIONAL MATCH (n)-[rel]-() DELETE rel, n",
                    params: {
                        id: nodeid
                    }
                });
            }
        }
        var streams = this.db.cypher({ queries: btc }, function (err, results) {
            console.log("Finished propagating: " + err);
            res.json(results);
        });
    };
    PropagateEndpoint.prototype.getMethod = function () {
        return "POST";
    };
    return PropagateEndpoint;
}());
exports.PropagateEndpoint = PropagateEndpoint;
