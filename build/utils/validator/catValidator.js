"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const category_1 = require("../../model/category");
const categoryobject = new category_1.Category();
exports.addCategoryValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of category is required field  (name)')
        .custom(async (val) => {
        const catexist = await categoryobject.checkcategoryexist(val);
        if (catexist) {
            throw new Error(`Category already exists`);
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
