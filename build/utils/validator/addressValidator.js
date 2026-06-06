"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressValidator = exports.deleteAddressValidator = exports.getUserAddressValidator = exports.addAddressValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const user_1 = require("../../model/user");
const address_1 = require("../../model/address");
const userobject = new user_1.User();
const addressobject = new address_1.Address();
exports.addAddressValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('email required field')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`user with this email does not exist`);
        }
        return true;
    }),
    (0, express_validator_1.check)('addrtitle')
        .notEmpty()
        .withMessage('address title is required field (addrtitle)'),
    (0, express_validator_1.check)('addrdetails')
        .notEmpty()
        .withMessage('address details is required field (addrdetails)'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('phone is required field (phone)')
        .isMobilePhone('ar-EG')
        .withMessage('invalid phone format (phone)'),
    validatormiddelware_1.validatorMiddleware
];
exports.getUserAddressValidator = [
    (0, express_validator_1.param)('email')
        .notEmpty()
        .withMessage('email required field')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`user with this email does not exist`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.deleteAddressValidator = [
    (0, express_validator_1.param)('email')
        .notEmpty()
        .withMessage('email required field')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`user with this email does not exist`);
        }
        return true;
    }),
    (0, express_validator_1.check)('addressId')
        .notEmpty()
        .withMessage('address ID is required field (addressId)')
        .isInt()
        .withMessage('address ID must be an integer (addressId)')
        .custom(async (val, { req }) => {
        const addressOwner = await addressobject.checkaddressowner(val, req.params.email);
        if (!addressOwner) {
            throw new Error(`address with this ID does not exist or you are not the owner`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateAddressValidator = [
    (0, express_validator_1.param)('email')
        .notEmpty()
        .withMessage('email required field')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`user with this email does not exist`);
        }
        return true;
    }),
    (0, express_validator_1.check)('addressId')
        .notEmpty()
        .withMessage('address ID is required field (addressId)')
        .isInt()
        .withMessage('address ID must be an integer (addressId)')
        .custom(async (val, { req }) => {
        const addressOwner = await addressobject.checkaddressowner(val, req.params.email);
        if (!addressOwner) {
            throw new Error(`address with this ID does not exist or you are not the owner`);
        }
        return true;
    }),
    (0, express_validator_1.check)('addrtitle')
        .notEmpty()
        .withMessage('address title is required field (addrtitle)'),
    (0, express_validator_1.check)('addrdetails')
        .notEmpty()
        .withMessage('address details is required field (addrdetails)'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('phone is required field (phone)')
        .isMobilePhone('ar-EG')
        .withMessage('invalid phone format (phone)'),
    validatormiddelware_1.validatorMiddleware
];
