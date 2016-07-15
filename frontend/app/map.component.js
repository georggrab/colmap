"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var router_deprecated_1 = require('@angular/router-deprecated');
var material_1 = require('./material');
var displaynodes_1 = require('./colmap/ui/displaynodes');
var preferences_1 = require('./colmap/state/preferences');
var server_1 = require('./colmap/network/server');
var tooltip_component_1 = require('./colmap/ui/tooltip.component');
var Ol = require('openlayers');
var MapComponent = (function (_super) {
    __extends(MapComponent, _super);
    function MapComponent(routeParams, preferences, backendService) {
        _super.call(this);
        this.routeParams = routeParams;
        this.preferences = preferences;
        this.backendService = backendService;
        this.connectedUsers = 0;
        this.connectedServices = 0;
        this.lastNetworkHealth = null;
        this.nodeFeatures = new Ol.Collection([]);
        this.edgeFeatures = new Ol.Collection([]);
        this.graphLayer = new Ol.layer.Vector({
            source: new Ol.source.Vector({
                features: this.nodeFeatures
            })
        });
        this.edgeLayer = new Ol.layer.Vector({
            source: new Ol.source.Vector({
                features: this.edgeFeatures
            }),
        });
        // Toggle button in header
        this.graphtoggle = false;
        // Features that are highlighted via hover must be kept
        // track of somehow. pendingUndoHovers contains a list of
        // functions that undoes the change.
        this.pendingUndoHovers = new Set();
        this.currentHover = undefined;
    }
    MapComponent.prototype.displayNetworkUpdate = function (update) {
        // todo refactor this function so not so much mutable state is being
        // thrown all around between map.component and displaynodes. Make Graphnetwork
        // Immutable?
        // Todo, update.additions o.ä, sollten keine GraphEdges sein, weil es keine
        // GraphEdges sind, sondern suchkriterien für GeoGraphNetwork.nodeExists, und kriterien
        // für erstellung der Edges. Stattdessen irgendeinen intermediate type benutzen!!!!!!!!
        for (var _i = 0, _a = update.additiveNodes; _i < _a.length; _i++) {
            var addition = _a[_i];
            for (var nodeName in addition) {
                if (!this.network.nodeExists(nodeName)) {
                    this.network.add(nodeName, addition[nodeName]);
                    displaynodes_1.DisplayNodeUtils.displayNode(addition[nodeName], this.nodeFeatures);
                }
                else {
                    // Todo once node highlighting is implemented: Do a highlight
                    // here instead.
                    console.log("Ignoring insertion of Duplicate: " + nodeName);
                }
            }
        }
        for (var _b = 0, _c = update.additions; _b < _c.length; _b++) {
            var addedEdge = _c[_b];
            var edge = this.network.findEdge(addedEdge);
            if (edge === null) {
                edge = this.network.connector(addedEdge.from, [addedEdge.to], false);
                displaynodes_1.DisplayNodeUtils.displayEdgeRaw(edge, this.network, this.nodeFeatures);
            }
            else {
                // Todo: add a settings option that allows to turn this off.
                console.log("Edge " + edge + " exists, highlighting instead.");
                displaynodes_1.DisplayNodeUtils.animateHighlight(edge, this.network);
            }
        }
        for (var _d = 0, _e = update.highlight; _d < _e.length; _d++) {
            var highlightEdge = _e[_d];
            displaynodes_1.DisplayNodeUtils.animateHighlight(highlightEdge, this.network);
        }
        for (var _f = 0, _g = update.deletions; _f < _g.length; _f++) {
            var removedEdge = _g[_f];
            // TODO UTILIZE EDGEFEATURES!!!!
            displaynodes_1.DisplayNodeUtils.deleteEdge(removedEdge, this.nodeFeatures, this.network);
        }
    };
    // TODO Observables haben hier nichts zu suchen
    MapComponent.prototype.buildNetworkInitial = function (graphNetwork) {
        var _this = this;
        this.notification("buildNetworkInitial()..");
        // Wait for Observable to yield network
        graphNetwork.forEach(function (network) {
            _this.network = network;
            var lastInsertion;
            // Iterate nodes of network and append
            network.nodeIterator(function (node, _, __) {
                lastInsertion = displaynodes_1.DisplayNodeUtils.displayNode(node, _this.nodeFeatures);
                displaynodes_1.DisplayNodeUtils.displayEdges(node, network, _this.nodeFeatures);
            }, function () {
                if (lastInsertion !== undefined) {
                    _this.map.getView().setCenter(lastInsertion);
                }
            });
        });
    };
    MapComponent.prototype.connect = function () {
        var _this = this;
        // socket connection logic here..
        var source = this.backendService.connect(this.mapid);
        source.forEach(function (connectionInfo) {
            if (connectionInfo.connected) {
                _this.notification('connected to ' + _this.mapid);
                _this.connectedUsers = connectionInfo.connectedUsers;
                _this.connectedServices = connectionInfo.connectedServices;
                if (_this.lastNetworkHealth === null) {
                    _this.lastNetworkHealth = connectionInfo.networkHealth;
                    _this.buildNetworkInitial(_this.backendService.downloadNetwork());
                }
            }
            else {
                _this.notification('connection failed');
            }
        });
        var deltas = this.backendService.activateDelta(0);
        deltas.forEach(function (delta) {
            _this.displayNetworkUpdate(delta);
        });
    };
    MapComponent.prototype.notification = function (of) {
        this.snackbarContainer.MaterialSnackbar.showSnackbar({
            message: of,
            timeout: 2000,
            actionHandler: function (event) { },
            actionText: 'OK'
        });
    };
    // TODO remove debug function
    MapComponent.prototype.btnDebug = function () {
        document["map"] = this;
        this.notification('Exposed Component to: document.map');
    };
    MapComponent.prototype.btnToggled = function () {
        this.graphtoggle = !this.graphtoggle;
        var layers = this.map.getLayers();
        if (this.graphtoggle) {
            // Deactivate Map Layers
            for (var _i = 0, _a = layers.getArray(); _i < _a.length; _i++) {
                var layer = _a[_i];
                if (layer instanceof Ol.layer.Tile) {
                    layer.setOpacity(0);
                }
            }
        }
        else {
            // Reactivate Map Layers
            for (var _b = 0, _c = layers.getArray(); _b < _c.length; _b++) {
                var layer = _c[_b];
                if (layer instanceof Ol.layer.Tile) {
                    layer.setOpacity(1);
                }
            }
        }
    };
    MapComponent.prototype.provider = function (olSource, apply) {
        if (apply === void 0) { apply = true; }
        console.log("providerchange fired");
        var layer;
        switch (olSource) {
            case 'ol.source.Stamen':
                layer = new Ol.layer.Tile({
                    source: new Ol.source.Stamen({
                        layer: 'toner'
                    })
                });
                break;
            case 'ol.source.OSM':
                layer = new Ol.layer.Tile({
                    source: new Ol.source.OSM()
                });
                break;
            case 'ol.source.BingMaps':
                layer = new Ol.layer.Tile({
                    source: new Ol.source.BingMaps({
                        key: 'AnOpGK0vuwH0a2tPUKih1RPmu6REVRH7SqP8jhSNFKeDORF7cCXGkhxY1wzbF7ul',
                        imagerySet: 'AerialWithLabels'
                    })
                });
                break;
        }
        if (apply) {
            console.log("apply fired");
            this.map.getLayers().removeAt(0);
            this.map.getLayers().insertAt(0, layer);
        }
        this.preferences.setPreference("ChosenMap", olSource);
        return layer;
    };
    MapComponent.prototype.onResize = function (event) {
        this.bw = window.innerWidth;
        this.bh = window.innerHeight;
        this.map.updateSize();
    };
    ;
    MapComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        this.snackbarContainer = document.querySelector('#map-snackbar');
        this.connect();
    };
    MapComponent.prototype.addClickHandler = function (map) {
        map.on('singleclick', function (evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                console.log("Clicked on Feature near " + evt.coordinate);
            });
        });
    };
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        var gotId = this.routeParams.get('mapid');
        this.bw = window.innerWidth;
        this.bh = window.innerHeight;
        this.mapid = gotId;
        this.map = new Ol.Map({
            target: 'mmap',
            layers: [
                this.provider(this.preferences.getPreferences().ChosenMap, false),
                this.graphLayer, this.edgeLayer
            ],
            view: new Ol.View({
                center: Ol.proj.fromLonLat([37.41, 8.82], undefined),
                zoom: 3,
                minZoom: 3, maxZoom: 20
            }),
            controls: new Ol.Collection([]),
        });
        this.map.on('pointermove', function (event) {
            var pixel = _this.map.getEventPixel(event.originalEvent);
            var feature = _this.map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
            if (feature && feature !== _this.currentHover) {
                _this.currentHover = feature;
                var settings_1 = new displaynodes_1.DisplaySettings();
                if (feature.values_.geometry instanceof Ol.geom.Point) {
                    // and all connecting features. create relation here.
                    feature.setStyle(settings_1.NodeStyleHovering);
                    var node = feature.get("DataLink");
                    if (node) {
                        console.log(node);
                        var _loop_1 = function(edge) {
                            var view = edge.getView();
                            if (view) {
                                view.setStyle(settings_1.EdgeStyleHovering);
                                _this.pendingUndoHovers.add(function () {
                                    view.setStyle(null);
                                });
                            }
                        };
                        for (var _i = 0, _a = node.connections; _i < _a.length; _i++) {
                            var edge = _a[_i];
                            _loop_1(edge);
                        }
                    }
                    _this.pendingUndoHovers.add(function () {
                        feature.setStyle(settings_1.NodeStyle);
                    });
                }
                else if (feature.values_.geometry instanceof Ol.geom.LineString) {
                }
            }
            else {
                _this.currentHover = undefined;
                _this.pendingUndoHovers.forEach(function (func) {
                    func();
                });
                _this.pendingUndoHovers.clear();
            }
        });
        this.addClickHandler(this.map);
    };
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map',
            templateUrl: 'app/map.component.html',
            directives: [tooltip_component_1.ToolTip]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, preferences_1.PerferenceService, server_1.BackendService])
    ], MapComponent);
    return MapComponent;
}(material_1.MaterialTemplate));
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map