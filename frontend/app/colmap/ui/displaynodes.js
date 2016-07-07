"use strict";
var Ol = require('openlayers');
var DisplaySettings = (function () {
    function DisplaySettings() {
        // Todo Integrate into colmap.state.persistence
        // Todo can persistence be achieved via TS decorators?
        // Todo create Settings interface for things like this
        this.HighlightDuration = 1000;
        this.DeleteDuration = 1000;
        this.EdgeStyleNormal = new Ol.style.Style({
            stroke: new Ol.style.Stroke({
                color: 'rgba(200,50,20,0.6)',
                width: 2,
                lineDash: [5, 5]
            })
        });
        this.EdgeStyleHighlight = new Ol.style.Style({
            stroke: new Ol.style.Stroke({
                color: 'rgba(150,150,5,0.6)',
                width: 2,
                lineDash: [5, 5]
            })
        });
        this.NodeStyle = new Ol.style.Style({
            image: new Ol.style.RegularShape({
                fill: new Ol.style.Fill({
                    color: 'rgba(30,50,230,0.6)'
                }),
                stroke: new Ol.style.Stroke({
                    color: 'gray', width: 1
                }),
                points: 9,
                radius: 3,
                radius2: 3,
                angle: 0
            })
        });
    }
    return DisplaySettings;
}());
exports.DisplaySettings = DisplaySettings;
var DisplayNodeUtils = (function () {
    function DisplayNodeUtils() {
    }
    DisplayNodeUtils.setDisplaySettings = function (s) {
        this.Display = s;
    };
    DisplayNodeUtils.deleteEdge = function (edge, view, on) {
        var _loop_1 = function(edgeCanditate) {
            if (edgeCanditate.to == edge.to) {
                edgeCanditate.getView().setStyle(this_1.Display.EdgeStyleNormal);
                setTimeout(function () {
                    // Todo: Is this too mighty? This Function shouldn't modify the graphnetworks state
                    // remove injection of on : GeoGraphNetwork at some point..
                    var idx = 0;
                    var feature = edgeCanditate.getView();
                    view.remove(feature);
                    edgeCanditate.attachView(null);
                    for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
                        var e = _a[_i];
                        if (edgeCanditate.to = e.to) {
                            on.nodes[edge.from].connections.splice(idx, 1);
                        }
                        idx++;
                    }
                    ;
                }, this_1.Display.DeleteDuration);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
            var edgeCanditate = _a[_i];
            _loop_1(edgeCanditate);
        }
    };
    DisplayNodeUtils.animateHighlight = function (edge, on) {
        var _loop_2 = function(edgeCanditate) {
            if (edgeCanditate.to == edge.to) {
                edgeCanditate.getView().setStyle(this_2.Display.EdgeStyleHighlight);
                setTimeout(function () {
                    edgeCanditate.getView().setStyle(null);
                }, this_2.Display.HighlightDuration);
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
            var edgeCanditate = _a[_i];
            _loop_2(edgeCanditate);
        }
    };
    DisplayNodeUtils.displayEdgeRaw = function (edge, network, pushOnto) {
        var coords = edge.getLineCoords(network, Ol.proj.fromLonLat);
        var line = new Ol.geom.LineString(coords);
        // The GeoGraphNetwork is only supposed to be
        // a temporary structure, so transfer metainformation
        // in its edgenetwork to this.feature collections,
        // which is directly connected to the map view.
        // rly?
        var edgeFeature = new Ol.Feature({
            geometry: line,
            from: edge.from,
            to: edge.to
        });
        pushOnto.push(edgeFeature);
        edge.attachView(edgeFeature);
    };
    DisplayNodeUtils.displayEdges = function (node, network, pushOnto) {
        for (var _i = 0, _a = node.connections; _i < _a.length; _i++) {
            var edge = _a[_i];
            this.displayEdgeRaw(edge, network, pushOnto);
        }
    };
    DisplayNodeUtils.displayNode = function (node, pushOnto) {
        var lastInsertion = node.type.getOl(Ol.proj.fromLonLat);
        var feature = new Ol.Feature(new Ol.geom.Point(lastInsertion));
        feature.setStyle(this.Display.NodeStyle);
        pushOnto.push(feature);
        return lastInsertion;
    };
    DisplayNodeUtils.Display = new DisplaySettings();
    return DisplayNodeUtils;
}());
exports.DisplayNodeUtils = DisplayNodeUtils;
//# sourceMappingURL=displaynodes.js.map