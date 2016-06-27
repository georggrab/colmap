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
var CStorage = (function () {
    function CStorage() {
    }
    return CStorage;
}());
exports.CStorage = CStorage;
var Preference = (function () {
    function Preference() {
        this.ChosenMap = "ol.source.OSM";
    }
    return Preference;
}());
exports.Preference = Preference;
exports.PREFERENCE_DEFAULT = new Preference();
var PerferenceService = (function () {
    function PerferenceService(StorageDevice) {
        this.StorageDevice = StorageDevice;
        this.pref = exports.PREFERENCE_DEFAULT;
        // Initialize Storage Device with default preferences
        // if it is empty.
        if (this.StorageDevice.load() == null) {
            var p = new Preference();
            this.StorageDevice.save(p);
        }
    }
    PerferenceService.prototype.getPreferences = function () {
        return this.StorageDevice.load();
    };
    PerferenceService.prototype.getPreference = function (key) {
        var pref = this.StorageDevice.load();
        if (pref.hasOwnProperty(key)) {
            return pref[key];
        }
        else {
            return null;
        }
    };
    PerferenceService.prototype.setPreferences = function (pref) {
        this.pref = pref;
        this.StorageDevice.save(this.pref);
    };
    PerferenceService.prototype.setPreference = function (key, val) {
        if (this.pref.hasOwnProperty(key)) {
            this.pref[key] = val;
            this.StorageDevice.save(this.pref);
        }
        else {
            throw "PreferenceService: Unknown Preference key ${key}";
        }
    };
    PerferenceService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [CStorage])
    ], PerferenceService);
    return PerferenceService;
}());
exports.PerferenceService = PerferenceService;
//# sourceMappingURL=preferences.js.map