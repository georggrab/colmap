"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.defined = function (o, keys) {
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (o[key] === undefined)
                return false;
        }
        return true;
    };
    return Utils;
}());
exports.Utils = Utils;
