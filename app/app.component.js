"use strict";
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
// Application Components that have a Route
var map_component_1 = require('./map.component');
var create_component_1 = require('./create.component');
// Storage Devices for Preferences
var preferences_1 = require('./colmap/state/preferences');
var localstorage_1 = require('./colmap/state/storage/localstorage');
var server_1 = require('./colmap/network/server');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'colmap-root',
            template: "\n\t\t<router-outlet></router-outlet>\n\t",
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS,
                preferences_1.PerferenceService,
                core_1.provide(preferences_1.CStorage, { useClass: localstorage_1.LocalStorage }),
                core_1.provide(server_1.BackendService, { useClass: server_1.BackendService })
            ]
        }),
        router_deprecated_1.RouteConfig([{
                path: '/create',
                name: "Create",
                useAsDefault: true,
                component: create_component_1.CreateComponent
            }, {
                path: '/map/:mapid',
                name: 'Map',
                component: map_component_1.MapComponent
            }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map