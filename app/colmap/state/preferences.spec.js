"use strict";
var testing_1 = require('@angular/core/testing');
var preferences_1 = require('./preferences');
var MockStorageDevice = (function () {
    function MockStorageDevice() {
        this.thing = { ChosenMap: "something", SomethingElse: false };
    }
    MockStorageDevice.prototype.load = function () { return this.thing; };
    MockStorageDevice.prototype.save = function (object) { this.thing = object; };
    return MockStorageDevice;
}());
exports.MockStorageDevice = MockStorageDevice;
testing_1.describe('Preference Subsystem', function () {
    testing_1.beforeEachProviders(function () { return [
        { provide: preferences_1.PerferenceService, useClass: preferences_1.PerferenceService },
        { provide: preferences_1.CStorage, useClass: MockStorageDevice }]; });
    testing_1.it('should be able to get preferences', testing_1.inject([preferences_1.PerferenceService], function (pref) {
        var p = pref.getPreferences();
        testing_1.expect(p.ChosenMap).toEqual("something");
    }));
    testing_1.it('should be able to get specific preference', testing_1.inject([preferences_1.PerferenceService], function (pref) {
        var p = pref.getPreference("ChosenMap");
        testing_1.expect(p).toEqual("something");
    }));
    testing_1.it('should be able to set preferences', testing_1.inject([preferences_1.PerferenceService], function (pref) {
        var l = new preferences_1.Preference();
        l.ChosenMap = 'lul';
        pref.setPreferences(l);
        testing_1.expect(pref.getPreferences().ChosenMap).toEqual("lul");
    }));
    testing_1.it('should be able to set specific preference', testing_1.inject([preferences_1.PerferenceService], function (pref) {
        pref.setPreference("ChosenMap", "sup");
        testing_1.expect(pref.getPreference("ChosenMap")).toEqual("sup");
    }));
});
//# sourceMappingURL=preferences.spec.js.map