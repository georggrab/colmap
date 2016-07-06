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
var preferences_1 = require('./colmap/state/preferences');
var server_1 = require('./colmap/network/server');
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
            style: new Ol.style.Style({
                stroke: new Ol.style.Stroke({
                    color: 'rgba(10,50,200,0.3)',
                    width: 2,
                    lineDash: [5, 5]
                }),
            })
        });
    }
    MapComponent.prototype.displayEdgeRaw = function (edge, network, pushOnto) {
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
    MapComponent.prototype.displayEdges = function (node, network, pushOnto) {
        for (var _i = 0, _a = node.connections; _i < _a.length; _i++) {
            var edge = _a[_i];
            this.displayEdgeRaw(edge, network, pushOnto);
        }
    };
    MapComponent.prototype.displayNode = function (node, pushOnto) {
        var lastInsertion = node.type.getOl(Ol.proj.fromLonLat);
        var feature = new Ol.Feature(new Ol.geom.Point(lastInsertion));
        feature.setStyle(new Ol.style.Style({
            image: new Ol.style.RegularShape({
                fill: new Ol.style.Fill({
                    color: 'red'
                }),
                stroke: new Ol.style.Stroke({
                    color: 'black', width: 2
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: 0
            })
        }));
        pushOnto.push(feature);
        return lastInsertion;
    };
    MapComponent.prototype.displayNetworkUpdate = function (update, ofOriginal) {
        // display new Nodes
        for (var _i = 0, _a = update.additiveNodes; _i < _a.length; _i++) {
            var addition = _a[_i];
            for (var nodeName in addition) {
                ofOriginal.add(nodeName, addition[nodeName]);
                this.displayNode(addition[nodeName], this.nodeFeatures);
            }
        }
        for (var _b = 0, _c = update.additions; _b < _c.length; _b++) {
            var addedEdge = _c[_b];
            this.displayEdgeRaw(addedEdge, ofOriginal, this.nodeFeatures);
        }
        for (var _d = 0, _e = update.highlight; _d < _e.length; _d++) {
            var highlightEdge = _e[_d];
            this.animateHighlight(highlightEdge, this.network);
        }
        for (var _f = 0, _g = update.deletions; _f < _g.length; _f++) {
            var removedEdge = _g[_f];
            // TODO UTILIZE EDGEFEATURES!!!!
            this.deleteEdge(removedEdge, this.nodeFeatures, this.network);
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
                lastInsertion = _this.displayNode(node, _this.nodeFeatures);
                _this.displayEdges(node, network, _this.nodeFeatures);
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
    };
    MapComponent.prototype.notification = function (of) {
        this.snackbarContainer.MaterialSnackbar.showSnackbar({
            message: of,
            timeout: 2000,
            actionHandler: function (event) { },
            actionText: 'OK'
        });
    };
    MapComponent.prototype.mapAddCoords = function (position) {
        var pos = Ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude], null);
        this.notification('LON=' + position.coords.longitude);
        var marker = new Ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: document.getElementById('marker-own-location'),
            stopEvent: false
        });
        this.map.addOverlay(marker);
    };
    // TODO remove debug function
    MapComponent.prototype.btnDebug = function () {
        document["map"] = this;
        this.notification('Exposed Component to: document.map');
        var delta = this.backendService.retrieveDelta(0);
        this.displayNetworkUpdate(delta, this.network);
    };
    MapComponent.prototype.btnAddLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.mapAddCoords.bind(this));
        }
        else {
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
    MapComponent.prototype.deleteEdge = function (edge, view, on) {
        // TODO IN HERE
        var _loop_1 = function(edgeCanditate) {
            if (edgeCanditate.to == edge.to) {
                edgeCanditate.getView().setStyle(new Ol.style.Style({
                    stroke: new Ol.style.Stroke({
                        color: 'rgba(200,50,20,0.6)',
                        width: 2,
                        lineDash: [5, 5]
                    }),
                }));
                setTimeout(function () {
                    var feature = edgeCanditate.getView();
                    view.remove(feature);
                    edgeCanditate.attachView(null);
                    var idx = 0;
                    for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
                        var e = _a[_i];
                        if (edgeCanditate.to = e.to) {
                            on.nodes[edge.from].connections.splice(idx, 1);
                        }
                        idx++;
                    }
                    ;
                }, 500);
            }
        };
        for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
            var edgeCanditate = _a[_i];
            _loop_1(edgeCanditate);
        }
    };
    MapComponent.prototype.animateHighlight = function (edge, on) {
        var _loop_2 = function(edgeCanditate) {
            if (edgeCanditate.to == edge.to) {
                edgeCanditate.getView().setStyle(new Ol.style.Style({
                    stroke: new Ol.style.Stroke({
                        color: 'rgba(150,150,5,0.6)',
                        width: 2,
                        lineDash: [5, 5]
                    }),
                }));
                setTimeout(function () {
                    edgeCanditate.getView().setStyle(null);
                }, 1000);
            }
        };
        for (var _i = 0, _a = on.nodes[edge.from].connections; _i < _a.length; _i++) {
            var edgeCanditate = _a[_i];
            _loop_2(edgeCanditate);
        }
    };
    MapComponent.prototype.ngOnInit = function () {
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
        this.addClickHandler(this.map);
    };
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map',
            templateUrl: 'app/map.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, preferences_1.PerferenceService, server_1.BackendService])
    ], MapComponent);
    return MapComponent;
}(material_1.MaterialTemplate));
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map