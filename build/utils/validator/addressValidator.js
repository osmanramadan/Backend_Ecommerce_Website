"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressValidator = exports.deleteAddressValidator = exports.getUserAddressValidator = exports.addAddressValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const user_1 = require("../../model/user");
const userobject = new user_1.User();
exports.addAddressValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`User with this email does not exist`);
        }
        return true;
    }),
    (0, express_validator_1.check)('addrtitle')
        .notEmpty()
        .withMessage('Address title is required field (addrtitle)'),
    (0, express_validator_1.check)('addrdetails')
        .notEmpty()
        .withMessage('Address details is required field (addrdetails)'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('Phone is required field (phone)')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone format (phone)'),
    validatormiddelware_1.validatorMiddleware
];
exports.getUserAddressValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (val) => {
        const existemail = await userobject.emailExists(val);
        if (!existemail) {
            throw new Error(`User with this email does not exist`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.deleteAddressValidator = [
    (0, express_validator_1.check)('addressId')
        .notEmpty()
        .withMessage('Address ID is required field (addressId)')
        .isInt()
        .withMessage('Address ID must be an integer (addressId)'),
    validatormiddelware_1.validatorMiddleware
];
exports.updateAddressValidator = [
    (0, express_validator_1.check)('addressId')
        .notEmpty()
        .withMessage('Address ID is required field (addressId)')
        .isInt()
        .withMessage('Address ID must be an integer (addressId)'),
    (0, express_validator_1.check)('addrtitle')
        .notEmpty()
        .withMessage('Address title is required field (addrtitle)'),
    (0, express_validator_1.check)('addrdetails')
        .notEmpty()
        .withMessage('Address details is required field (addrdetails)'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('Phone is required field (phone)')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone format (phone)'),
    validatormiddelware_1.validatorMiddleware
];
