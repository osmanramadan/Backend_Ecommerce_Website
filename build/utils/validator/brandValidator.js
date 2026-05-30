"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBrandValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const brand_1 = require("../../model/brand");
const brandobject = new brand_1.Mark();
exports.addBrandValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of brand is required field  (name)')
        .custom(async (val) => {
        const brandexist = await brandobject.checkbrandexist(val);
        if (brandexist) {
            throw new Error(`Brand already exists`);
        }
        return true;
    }),
    (0, express_validator_1.check)('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image is required (image)');
        }
        if (!req.file.mimetype.startsWith('image/')) {
            throw new Error('File must be an image');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
