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
var material_1 = require('./../../material');
var ToIterable = (function () {
    function ToIterable() {
    }
    ToIterable.prototype.transform = function (dict) {
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key) && !key.startsWith("__")) {
                if (dict[key] instanceof Array) {
                    if (dict[key].length == 0) {
                        continue;
                    }
                }
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    };
    ToIterable = __decorate([
        core_1.Pipe({ name: 'toIterable' }), 
        __metadata('design:paramtypes', [])
    ], ToIterable);
    return ToIterable;
}());
exports.ToIterable = ToIterable;
var ToConnections = (function () {
    function ToConnections() {
    }
    ToConnections.prototype.transform = function (node) {
        var a = [];
        if (node && node.hasOwnProperty("connections")) {
            for (var _i = 0, _a = node.connections; _i < _a.length; _i++) {
                var connection = _a[_i];
                var linkNode = node.__parentNetwork.nodes[connection.from];
                if (linkNode.hasOwnProperty("<host>")) {
                    a.push(linkNode["<host>"]);
                }
            }
        }
        return a;
    };
    ToConnections = __decorate([
        core_1.Pipe({ name: 'toConnections' }), 
        __metadata('design:paramtypes', [])
    ], ToConnections);
    return ToConnections;
}());
exports.ToConnections = ToConnections;
var ToolTip = (function (_super) {
    __extends(ToolTip, _super);
    function ToolTip() {
        _super.call(this);
        this.show = false;
    }
    Object.defineProperty(ToolTip.prototype, "display", {
        set: function (display) {
            this._display = display;
            if (display && this.map) {
                var coords = display.getGeometry().getCoordinates();
                var pixel = this.map.getPixelFromCoordinate(coords);
                // -64px: Header.
                this.left = pixel[0], this.top = pixel[1];
                if (window.innerWidth > 1020) {
                    this.top -= 64;
                }
                var cnode = display.get("DataLink");
                if (cnode) {
                    this.underlyingNode = cnode;
                }
                this.show = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ToolTip.prototype, "map", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], ToolTip.prototype, "display", null);
    ToolTip = __decorate([
        core_1.Component({
            selector: 'tooltip',
            templateUrl: 'app/colmap/ui/tooltip.component.html',
            pipes: [ToIterable, ToConnections]
        }), 
        __metadata('design:paramtypes', [])
    ], ToolTip);
    return ToolTip;
}(material_1.MaterialTemplate));
exports.ToolTip = ToolTip;
//# sourceMappingURL=tooltip.component.js.map