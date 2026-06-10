"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategoryValidator = exports.addSubCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const category_1 = require("../../model/category");
const subcategory_1 = require("../../model/subcategory");
const categoryobject = new category_1.Category();
const subcategoryobject = new subcategory_1.SubCategory();
exports.addSubCategoryValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('name of subcategory is required field  (name)')
        .custom(async (val) => {
        const subcatexist = await subcategoryobject.checksubcategoryexist(val);
        if (subcatexist) {
            throw new Error(`subcategory already exists`);
        }
        return true;
    }),
    (0, express_validator_1.check)('maincat')
        .notEmpty()
        .withMessage('main category should be provided (maincat)')
        .custom(async (val) => {
        const categoryexist = await categoryobject.checkcategoryexist(val);
        if (!categoryexist) {
            throw new Error(`main category does not exist`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.deleteSubCategoryValidator = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('name of subcategory is required field  (name)')
        .custom(async (val) => {
        const subcategoryexist = await subcategoryobject.checksubcategoryexist(val);
        if (!subcategoryexist) {
            throw new Error(`subcategory does not exist`);
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
