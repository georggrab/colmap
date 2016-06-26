"use strict";
var localstorage_1 = require('./localstorage');
var preferences_1 = require('../preferences');
describe('LocalStorage Storage Device', function () {
    var localStorage;
    beforeEach(function () {
        localStorage = new localstorage_1.LocalStorage();
    });
    it('should be able to save preferences to localstorage', function () {
        var preference = new preferences_1.Preference();
        localStorage.save(preference);
        expect(localStorage.load().ChosenMap)
            .toEqual(preference.ChosenMap);
    });
});
//# sourceMappingURL=localstorage.spec.js.map