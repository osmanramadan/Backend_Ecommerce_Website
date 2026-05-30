"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_1 = __importDefault(require("../../controller/address"));
const addressValidator_1 = require("../../utils/validator/addressValidator");
const jwtmiddelware_1 = __importDefault(require("../../authorization/middelware/jwtmiddelware"));
const AddressController = new address_1.default();
const addresses = express_1.default.Router();
addresses.get('/user/:email', jwtmiddelware_1.default, addressValidator_1.getUserAddressValidator, AddressController.viewuseraddress);
addresses.post('/', jwtmiddelware_1.default, addressValidator_1.addAddressValidator, AddressController.addaddress);
addresses.delete('/', jwtmiddelware_1.default, addressValidator_1.deleteAddressValidator, AddressController.deleteuseraddress);
addresses.put('/', jwtmiddelware_1.default, addressValidator_1.updateAddressValidator, AddressController.updateuseraddress);
exports.default = addresses;
