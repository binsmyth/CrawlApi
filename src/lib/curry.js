"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.curry = void 0;
function curry(f) {
    function curried(args) {
        if (args.length >= f.length)
            return f.apply(void 0, args);
        return accumulator;
        function accumulator(a) {
            return curried(__spreadArray(__spreadArray([], args, true), [a], false));
        }
        ;
    }
    ;
    //
    return curried([]);
}
exports.curry = curry;
;
