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
var CreateComponent = (function (_super) {
    __extends(CreateComponent, _super);
    function CreateComponent(router) {
        _super.call(this);
        this.router = router;
        this.hl = require("highlightjs");
    }
    CreateComponent.prototype.ngOnInit = function () {
        this.mapID = Math.random().toString(16).slice(2);
    };
    CreateComponent.prototype.ngAfterViewInit = function () {
        var code = document.getElementById("apicode");
        this.hl.highlightBlock(code);
    };
    CreateComponent.prototype.toMap = function (mapID) {
        location.href = "/map/" + mapID;
    };
    CreateComponent = __decorate([
        core_1.Component({
            selector: 'create',
            templateUrl: 'app/create.component.html'
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router])
    ], CreateComponent);
    return CreateComponent;
}(material_1.MaterialTemplate));
exports.CreateComponent = CreateComponent;
//# sourceMappingURL=create.component.js.map