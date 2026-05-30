"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addproductTOorderValidator = exports.deleteorderValidator = exports.updateorderstatusValidator = exports.checkforuseridValidator = exports.createorderValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const order_1 = require("../../model/order");
const user_1 = require("../../model/user");
const product_1 = require("../../model/product");
const orderobject = new order_1.Order();
const productobject = new product_1.Product();
const userobject = new user_1.User();
exports.createorderValidator = [
    (0, express_validator_1.check)('userid')
        .notEmpty()
        .withMessage('User id is required field (userid)')
        .isNumeric()
        .withMessage('User id must be a number')
        .custom(async (value) => {
        const user = await userobject.show(value);
        if (!user) {
            throw new Error('User not found');
        }
    }),
    (0, express_validator_1.check)('items')
        .isArray({ min: 1 })
        .withMessage('Items are required and must be an array with at least one item')
        .custom(async (items) => {
        for (const productId of items) {
            if (isNaN(productId)) {
                throw new Error(`Product id ${productId} must be a number`);
            }
            const productExists = await productobject.show(productId);
            if (!productExists) {
                throw new Error('Product not found with id ' + productId);
            }
        }
        return true;
    }),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('Price is required field (price)')
        .isNumeric()
        .withMessage('Price must be a number'),
    (0, express_validator_1.check)('address')
        .notEmpty()
        .withMessage('Address is required field (address)')
        .isArray({ min: 1 })
        .withMessage('Address must be an array with at least one item')
        .custom(value => {
        if (!value.every((item) => {
            // must be object
            if (typeof item !== 'object' || item === null) {
                return false;
            }
            // object must contain values
            return (Object.keys(item).length > 0 &&
                Object.values(item).every(val => val !== '' && val !== null && val !== undefined));
        })) {
            throw new Error('Each address item must be a valid object with non-empty values');
        }
        return true;
    }),
    (0, express_validator_1.check)('userinfo')
        .notEmpty()
        .withMessage('User info is required field (userinfo)')
        .isArray({ min: 1 })
        .withMessage('User info must be an array with at least one item')
        .custom(value => {
        if (!value.every((item) => {
            // must be object
            if (typeof item !== 'object' || item === null) {
                return false;
            }
            // object must contain values
            return (Object.keys(item).length > 0 &&
                Object.values(item).every(val => val !== '' && val !== null && val !== undefined));
        })) {
            throw new Error('Each userinfo item must be a valid object with non-empty values');
        }
        return true;
    }),
    (0, express_validator_1.check)('status')
        .notEmpty()
        .withMessage('Order status is required field (status)')
        .isIn(['complete', 'waiting', 'cancle'])
        .withMessage('Order status must be one of the following: complete, waiting, cancle'),
    validatormiddelware_1.validatorMiddleware
];
exports.checkforuseridValidator = [
    (0, express_validator_1.check)('userid')
        .notEmpty()
        .withMessage('User id is required field (userid)')
        .isNumeric()
        .withMessage('User id must be a number')
        .custom(async (value) => {
        const user = await userobject.show(value);
        if (!user) {
            throw new Error('User not found');
        }
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateorderstatusValidator = [
    (0, express_validator_1.check)('orderId')
        .notEmpty()
        .withMessage('Order id is required field (orderId)')
        .isNumeric()
        .withMessage('Order id must be a number')
        .custom(async (value) => {
        const orderExists = await orderobject.checkorderexist(value);
        if (!orderExists) {
            throw new Error('Order not found');
        }
    }),
    (0, express_validator_1.check)('status')
        .notEmpty()
        .withMessage('Order status is required field (status)')
        .isIn(['complete', 'waiting', 'cancle'])
        .withMessage('Order status must be one of the following: complete, waiting, cancle'),
    validatormiddelware_1.validatorMiddleware
];
exports.deleteorderValidator = [
    (0, express_validator_1.check)('orderId')
        .notEmpty()
        .withMessage('Order id is required field (orderId)')
        .isNumeric()
        .withMessage('Order id must be a number')
        .custom(async (value) => {
        const orderExists = await orderobject.checkorderexist(value);
        if (!orderExists) {
            throw new Error('Order not found');
        }
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.addproductTOorderValidator = [
    (0, express_validator_1.check)('orderId')
        .notEmpty()
        .withMessage('Order id is required field (orderId)')
        .isNumeric()
        .withMessage('Order id must be a number')
        .custom(async (value) => {
        const orderExists = await orderobject.checkorderexist(value);
        if (!orderExists) {
            throw new Error('Order not found');
        }
    }),
    (0, express_validator_1.check)('productId')
        .notEmpty()
        .withMessage('Product id is required field (productId)')
        .isNumeric()
        .withMessage('Product id must be a number')
        .custom(async (value) => {
        const productExists = await productobject.show(value);
        if (!productExists) {
            throw new Error('Product not found');
        }
    }),
    (0, express_validator_1.check)('quantity')
        .notEmpty()
        .withMessage('Quantity is required field (quantity)')
        .isNumeric()
        .withMessage('Quantity must be a number'),
    validatormiddelware_1.validatorMiddleware
];
