"use strict";
var MaterialTemplate = (function () {
    function MaterialTemplate() {
    }
    MaterialTemplate.prototype.ngAfterViewInit = function () {
        componentHandler.upgradeAllRegistered();
    };
    return MaterialTemplate;
}());
exports.MaterialTemplate = MaterialTemplate;
//# sourceMappingURL=material.js.map