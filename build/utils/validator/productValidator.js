"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdValidator = exports.createCommentValidator = exports.updateProductValidator = exports.getProductsByCateValidator = exports.showOrDelProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
const validatormiddelware_1 = require("../../authorization/middelware/validatormiddelware");
const product_1 = require("../../model/product");
const category_1 = require("../../model/category");
const brand_1 = require("../../model/brand");
const productObject = new product_1.Product();
const categoryObject = new category_1.Category();
const brandObject = new brand_1.Mark();
exports.createProductValidator = [
    (0, express_validator_1.check)('ptitle')
        .notEmpty()
        .withMessage('product title is required  (ptitle) ')
        .custom(async (val) => {
        const productExist = await productObject.checkproductexist(val);
        if (productExist) {
            throw new Error('product already exists');
        }
        return true;
    }),
    (0, express_validator_1.check)('pdesc')
        .notEmpty()
        .withMessage('product description is required (pdesc) '),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('price is required (price) ')
        .isFloat({ gt: 0 })
        .withMessage('price must be greater than 0'),
    (0, express_validator_1.check)('discount')
        .optional()
        // Discount will be (by percentage) 10 means 10% discount on the original price
        .isFloat({ min: 0, max: 100 })
        .withMessage('discount must be between 0 and 100'),
    (0, express_validator_1.check)('priceafterdiscount')
        .notEmpty()
        .withMessage('price after discount is required (priceafterdiscount) ')
        .isFloat({ gt: 0 })
        .withMessage('price after discount must be greater than 0'),
    (0, express_validator_1.check)('category').notEmpty().withMessage('category is required (category) '),
    (0, express_validator_1.check)('subcategory').optional(),
    (0, express_validator_1.check)('brand').notEmpty().withMessage('brand is required (brand) '),
    (0, express_validator_1.check)('colors').notEmpty().withMessage('colors are required (colors) '),
    (0, express_validator_1.check)('category').custom(async (val) => {
        const categoryExist = await categoryObject.checkcategoryexist(val);
        if (!categoryExist) {
            throw new Error('category does not exist , you should create it first');
        }
        return true;
    }),
    (0, express_validator_1.check)('brand').custom(async (val) => {
        const brandExist = await brandObject.checkbrandexist(val);
        if (!brandExist) {
            throw new Error('brand does not exist , you should create it first');
        }
        return true;
    }),
    (0, express_validator_1.check)('images').custom((value, { req }) => {
        const files = req.files;
        if (!files.images || files.images.length === 0) {
            throw new Error('images are required ( images )');
        }
        for (const file of files.images) {
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('all files must be images');
            }
        }
        return true;
    }),
    (0, express_validator_1.check)('coverimage').custom((value, { req }) => {
        const files = req.files;
        if (!files.coverimage || files.coverimage.length === 0) {
            throw new Error('cover image is required (coverimage)');
        }
        if (!files.coverimage[0].mimetype.startsWith('image/')) {
            throw new Error('cover image must be an image');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.showOrDelProductValidator = [
    (0, express_validator_1.param)('id')
        .notEmpty()
        .withMessage('product id is required as a URL parameter')
        .isInt()
        .withMessage('product id must be an integer')
        .custom(async (val) => {
        const productExist = await productObject.show(val);
        if (!productExist) {
            throw new Error('Product Not Found');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.getProductsByCateValidator = [
    (0, express_validator_1.param)('cate')
        .notEmpty()
        .withMessage('category is required')
        .isString()
        .withMessage('category must be a string')
        .custom(async (val) => {
        const categoryExist = await categoryObject.checkcategoryexist(val);
        if (!categoryExist) {
            throw new Error('category does not exist');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.updateProductValidator = [
    (0, express_validator_1.check)('productId')
        .notEmpty()
        .withMessage('product id is required (productId) ')
        .isInt()
        .withMessage('product id must be an integer')
        .custom(async (val) => {
        const productExist = await productObject.show(val);
        if (!productExist) {
            throw new Error('product does not exist');
        }
        return true;
    }),
    (0, express_validator_1.check)('ptitle')
        .notEmpty()
        .withMessage('product title cannot be empty if provided (ptitle) ')
        .custom(async (val, { req }) => {
        const productExist = await productObject.checkproductexist(val);
        if (productExist) {
            const product = await productObject.show(req.body.productId);
            if (typeof product !== 'boolean' && product.ptitle === val) {
                return true; // Allow if the title belongs to the same product being updated
            }
            throw new Error('product title already exists choose another title');
        }
        return true;
    }),
    (0, express_validator_1.check)('pdesc')
        .notEmpty()
        .withMessage('product description cannot be empty if provided (pdesc) '),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('price cannot be empty if provided (price) ')
        .isFloat({ gt: 0 })
        .withMessage('price must be greater than 0'),
    (0, express_validator_1.check)('discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('discount must be between 0 and 100'),
    (0, express_validator_1.check)('priceafterdiscount')
        .notEmpty()
        .withMessage('price after discount cannot be empty if provided (priceafterdiscount) ')
        .isFloat({ gt: 0 })
        .withMessage('price after discount must be greater than 0'),
    (0, express_validator_1.check)('category')
        .notEmpty()
        .withMessage('category cannot be empty if provided (category) '),
    (0, express_validator_1.check)('subcategory').optional(),
    (0, express_validator_1.check)('brand')
        .notEmpty()
        .withMessage('brand cannot be empty if provided (brand) '),
    (0, express_validator_1.check)('colors')
        .notEmpty()
        .withMessage('colors cannot be empty if provided (colors) '),
    (0, express_validator_1.check)('category').custom(async (val) => {
        const categoryExist = await categoryObject.checkcategoryexist(val);
        if (!categoryExist) {
            throw new Error('category does not exist , you should create it first');
        }
        return true;
    }),
    (0, express_validator_1.check)('brand').custom(async (val) => {
        const brandExist = await brandObject.checkbrandexist(val);
        if (!brandExist) {
            throw new Error('brand does not exist , you should create it first');
        }
        return true;
    }),
    (0, express_validator_1.check)('images').custom((value, { req }) => {
        const files = req.files;
        if (!files.images || files.images.length === 0) {
            throw new Error('images are required');
        }
        for (const file of files.images) {
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('All files must be images');
            }
        }
        return true;
    }),
    (0, express_validator_1.check)('coverimage').custom((value, { req }) => {
        const files = req.files;
        if (!files.coverimage || files.coverimage.length === 0) {
            throw new Error('cover image is required');
        }
        if (!files.coverimage[0].mimetype.startsWith('image/')) {
            throw new Error('cover image must be an image');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
exports.createCommentValidator = [
    (0, express_validator_1.check)('productId')
        .notEmpty()
        .withMessage('product ID is required')
        .custom(async (val) => {
        const productExist = await productObject.show(val);
        if (!productExist) {
            throw new Error('product does not exist');
        }
        return true;
    }),
    (0, express_validator_1.check)('username').notEmpty().withMessage('username is required'),
    (0, express_validator_1.check)('text')
        .notEmpty()
        .withMessage('comment text is required')
        .isString()
        .withMessage('comment text must be a string'),
    (0, express_validator_1.check)('stars')
        .notEmpty()
        .withMessage('stars rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('stars rating must be an integer between 1 and 5'),
    validatormiddelware_1.validatorMiddleware
];
exports.productIdValidator = [
    (0, express_validator_1.param)('prodId')
        .notEmpty()
        .withMessage('product ID is required as a URL parameter')
        .isInt()
        .withMessage('product ID must be an integer')
        .custom(async (val) => {
        const productExist = await productObject.show(val);
        if (!productExist) {
            throw new Error('product does not exist');
        }
        return true;
    }),
    validatormiddelware_1.validatorMiddleware
];
