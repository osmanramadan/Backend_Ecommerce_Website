"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
var status;
(function (status) {
    status[status["waiting"] = 0] = "waiting";
    status[status["cancel"] = 1] = "cancel";
    status[status["complete"] = 2] = "complete";
})(status = exports.status || (exports.status = {}));
