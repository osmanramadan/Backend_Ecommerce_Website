"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponValidator = exports.deleteCouponValidator = exports.addCouponValidator = exports.showCouponValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const coupon_1 = require("../../model/coupon");
const couponobject = new coupon_1.Coupon();
exports.showCouponValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of coupon is required field  (name)')
        .custom(async (val) => {
        const coupon = await couponobject.checkcouponexistbyname(val);
        if (!coupon) {
            throw new Error('Coupon with this name does not exist');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.addCouponValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of coupon is required field  (name)')
        .custom(async (val) => {
        const coupon = await couponobject.checkcouponexistbyname(val);
        if (coupon) {
            throw new Error('Coupon with this name already exists');
        }
        return true;
    }),
    (0, express_validator_1.check)('discount')
        .notEmpty()
        .withMessage('Discount value is required field  (discount)')
        .isNumeric()
        .withMessage('Discount value must be a number (discount)'),
    (0, express_validator_1.check)('expire')
        .notEmpty()
        .withMessage('Expiry date is required field  (expire)')
        .isDate()
        .withMessage('Expiry date must be a valid date (expire)'),
    validatormiddelware_1.validatorMiddleware
];
exports.deleteCouponValidator = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('Coupon ID is required')
        .isInt()
        .withMessage('Coupon ID must be an integer')
        .custom(async (val) => {
        const coupon = await couponobject.checkcouponexistbyid(val);
        if (!coupon) {
            throw new Error('Coupon with this ID does Not exist');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateCouponValidator = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('Coupon ID is required')
        .isInt()
        .withMessage('Coupon ID must be an integer')
        .custom(async (val) => {
        const coupon = await couponobject.checkcouponexistbyid(val);
        if (!coupon) {
            throw new Error('Coupon with this ID does Not exist');
        }
        return true;
    }),
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of coupon is required field  (name)')
        .custom(async (val, { req }) => {
        const coupon = await couponobject.show(val);
        if (coupon && Number(coupon.id) !== Number(req.body.id)) {
            throw new Error('Coupon with this name already exists');
        }
        return true;
    }),
    (0, express_validator_1.check)('discount')
        .notEmpty()
        .withMessage('Discount value is required field  (discount)')
        .isNumeric()
        .withMessage('Discount value must be a number (discount)'),
    (0, express_validator_1.check)('expire')
        .notEmpty()
        .withMessage('Expiry date is required field  (expire)')
        .isDate()
        .withMessage('Expiry date must be a valid date (expire)'),
    validatormiddelware_1.validatorMiddleware
];
