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
        return pref;
    }));
});
//# sourceMappingURL=preferences.spec.js.map