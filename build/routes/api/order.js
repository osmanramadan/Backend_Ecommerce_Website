"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("../../controller/order"));
const order_2 = __importDefault(require("../../controller/services/order"));
const jwtmiddelware_1 = __importStar(require("../../authorization/middelware/jwtmiddelware"));
const orderValidator_1 = require("../../utils/validator/orderValidator");
const ordercontroller = new order_1.default();
const ordercontrollerservices = new order_2.default();
const orders = express_1.default.Router();
orders.get('/:userid', jwtmiddelware_1.default, orderValidator_1.checkforuseridValidator, ordercontroller.show);
orders.get('/', jwtmiddelware_1.verifyAdmin, ordercontroller.index);
// here may exist update when connect to frontend
orders.post('/', jwtmiddelware_1.default, orderValidator_1.createorderValidator, ordercontroller.create);
orders.put('/status', jwtmiddelware_1.verifyAdmin, orderValidator_1.updateorderstatusValidator, ordercontroller.updateorderstatus);
orders.delete('/:orderId', jwtmiddelware_1.verifyAdmin, orderValidator_1.deleteorderValidator, ordercontroller.delete);
// here may exist update when connect to frontend
orders.post('/addproductTOorder', jwtmiddelware_1.default, orderValidator_1.addproductTOorderValidator, ordercontroller.addproductTOorder);
orders.get('/active/:userid', jwtmiddelware_1.default, orderValidator_1.checkforuseridValidator, ordercontrollerservices.useractiveorders);
orders.get('/complete/:userid', jwtmiddelware_1.default, orderValidator_1.checkforuseridValidator, ordercontrollerservices.usercompleteorders);
exports.default = orders;
