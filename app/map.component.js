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
var MapComponent = (function (_super) {
    __extends(MapComponent, _super);
    function MapComponent(routeParams, preferences, backendService) {
        _super.call(this);
        this.routeParams = routeParams;
        this.preferences = preferences;
        this.backendService = backendService;
        this.connectedUsers = 0;
        this.connectedServices = 0;
        /* Things we need for OpenLayers */
        this.ol = ol;
        /* Things we need for the GraphNetwork */
        this.lastNetworkHealth = null;
        this.features = new ol.Collection();
        this.graphLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: this.features
            })
        });
    }
    MapComponent.prototype.buildNetworkInitial = function (graphNetwork) {
        var _this = this;
        this.notification("buildNetworkInitial()..");
        // Step 1: Place Nodes on Map
        graphNetwork.forEach(function (network) {
            network.nodeIterator(function (node, key, n) {
                console.log("adding feature");
                var feature = new ol.Feature(new ol.geom.Point(node.type.getOl()));
                feature.setStyle(new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({ color: 'red' }),
                        stroke: new ol.style.Stroke({ color: 'black', width: 1 }),
                        points: 4,
                        radius: 10,
                        radius2: 0,
                        angle: 0
                    })
                }));
                _this.features.extend(feature);
            }, function () {
                _this.graphLayer.changed();
            });
        });
        // Step 2: Connect Nodes
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
        var pos = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
        this.notification('LON=' + position.coords.longitude);
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: document.getElementById('marker-own-location'),
            stopEvent: false
        });
        this.map.addOverlay(marker);
    };
    // TODO remove debug function
    MapComponent.prototype.btnDebug = function () {
        document.map = this;
        this.notification('Exposed Component to: document.map');
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
        var layer;
        switch (olSource) {
            case 'ol.source.Stamen':
                layer = new this.ol.layer.Tile({
                    source: new this.ol.source.Stamen({ layer: 'toner' })
                });
                break;
            case 'ol.source.OSM':
                layer = new this.ol.layer.Tile({
                    source: new this.ol.source.OSM({})
                });
                break;
            case 'ol.source.BingMaps':
                layer = new this.ol.layer.Tile({
                    source: new this.ol.source.BingMaps({
                        key: 'AnOpGK0vuwH0a2tPUKih1RPmu6REVRH7SqP8jhSNFKeDORF7cCXGkhxY1wzbF7ul',
                        imagerySet: 'AerialWithLabels'
                    })
                });
                break;
        }
        if (apply) {
            this.map.getLayers().clear();
            this.map.addLayer(layer);
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
    MapComponent.prototype.ngOnInit = function () {
        var gotId = this.routeParams.get('mapid');
        this.bw = window.innerWidth;
        this.bh = window.innerHeight;
        this.mapid = gotId;
        this.map = new this.ol.Map({
            target: 'mmap',
            layers: [
                this.provider(this.preferences.getPreferences().ChosenMap, false),
                this.graphLayer
            ],
            view: new this.ol.View({
                center: this.ol.proj.fromLonLat([37.41, 8.82]),
                zoom: 4
            }),
            controls: new this.ol.Collection()
        });
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