"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useridValidator = exports.updateUserPasswordValidator = exports.updateUserProfileValidator = exports.resetPasswordValidator = exports.verifyPasswordValidator = exports.forgetPasswordValidator = exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const slugify_1 = __importDefault(require("slugify"));
const user_1 = require("../../model/user");
const userobject = new user_1.User();
exports.signupValidator = [
    (0, express_validator_1.check)('username')
        .notEmpty()
        .withMessage('username required field')
        .isLength({ min: 5 })
        .withMessage('username must be at least 5 chars')
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (existemail) {
            throw new Error(`Email already exists`);
        }
        return true;
    }),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars'),
    (0, express_validator_1.check)('passwordConfirm')
        .notEmpty()
        .withMessage('passwordConfirm is required field')
        .custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error(`Password confirmation does not match`);
        }
        return true;
    }),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('Phone required field')
        .isMobilePhone('ar-EG')
        .withMessage('accept only Egypt phone numbers')
        .custom(async (_val, { req }) => {
        const existphone = await userobject.phoneExists(req.body.phone);
        if (existphone) {
            throw new Error('Phone already exists');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.loginValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.check)('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 chars'),
    validatormiddelware_1.validatorMiddleware
];
exports.forgetPasswordValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (!existemail) {
            throw new Error(`Email not found`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.verifyPasswordValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (!existemail) {
            throw new Error(`Email not found`);
        }
        return true;
    }),
    (0, express_validator_1.check)('resetCode')
        .notEmpty()
        .withMessage('Reset code required')
        .isInt()
        .withMessage('Reset code must be a number')
        .isLength({ min: 6 })
        .withMessage('Reset code must be at least 6 characters'),
    validatormiddelware_1.validatorMiddleware
];
exports.resetPasswordValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (!existemail) {
            throw new Error(`Email not found`);
        }
        return true;
    }),
    (0, express_validator_1.check)('newpassword')
        .notEmpty()
        .withMessage('new password required (newpassword)')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.check)('confirmPassword')
        .notEmpty()
        .withMessage('passwordConfirm is required field (confirmPassword)')
        .custom((val, { req }) => {
        if (val !== req.body.newpassword) {
            throw new Error(`Password confirmation does not match`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateUserProfileValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (existemail) {
            return true;
        }
        throw new Error(`Email not found`);
    }),
    // at least username or phone must exist
    (0, express_validator_1.check)().custom((_, { req }) => {
        if (!req.body.username && !req.body.phone) {
            throw new Error('username or phone is required');
        }
        // if phone exists => id must exist
        // userid come from jwt middleware and put in req.body
        if (req.body.phone && !req.body.userid) {
            throw new Error('id is required when phone is provided');
        }
        return true;
    }),
    (0, express_validator_1.check)('username')
        .optional()
        .isLength({ min: 5 })
        .withMessage('username must be at least 5 chars')
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)('phone')
        .optional()
        .isMobilePhone('ar-EG')
        .withMessage('accept only Egypt phone numbers')
        .custom(async (val, { req }) => {
        // search for user by phone
        const user = await userobject.getuserbyphone(val);
        // if phone does not exist => valid
        if (!user) {
            return true;
        }
        // if phone belongs to requested user => valid
        if (user && typeof user === 'object') {
            if (user.id == req.body.userid) {
                return true;
            }
        }
        // otherwise another user owns this phone
        throw new Error('Phone already exists for another user');
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateUserPasswordValidator = [
    (0, express_validator_1.check)('email')
        .notEmpty()
        .withMessage('Email required field')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (_val, { req }) => {
        const existemail = await userobject.emailExists(req.body.email);
        if (!existemail) {
            throw new Error(`Email not found`);
        }
        return true;
    }),
    (0, express_validator_1.check)('newpassword')
        .notEmpty()
        .withMessage('new password required (newpassword)')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .custom((val, { req }) => {
        if (val === req.body.oldpassword) {
            throw new Error(`New password must be different from current password`);
        }
        return true;
    }),
    (0, express_validator_1.check)('oldpassword')
        .notEmpty()
        .withMessage('old password required (oldpassword)')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validatormiddelware_1.validatorMiddleware
];
exports.useridValidator = [
    (0, express_validator_1.check)('userid')
        .notEmpty()
        .withMessage('Userid should be set')
        .isNumeric()
        .withMessage('userid should be number')
        .custom(async (val) => {
        const user = await userobject.show(val);
        if (!user) {
            throw new Error(`User not found`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
