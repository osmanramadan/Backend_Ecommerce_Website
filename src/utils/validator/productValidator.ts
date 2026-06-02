import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Product } from '../../model/product';
import { Category } from '../../model/category';
import { Mark } from '../../model/brand';

const productObject = new Product();
const categoryObject = new Category();
const brandObject = new Mark();

export const createProductValidator = [
  check('ptitle')
    .notEmpty()
    .withMessage('Product title is required  (ptitle) '),

  check('pdesc')
    .notEmpty()
    .withMessage('Product description is required (pdesc) '),

  check('price')
    .notEmpty()
    .withMessage('Price is required (price) ')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  check('discount')
    .optional()
    // for now , i dont determine discount will be (by value,percentage)
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('priceafterdiscount')
    .notEmpty()
    .withMessage('Price after discount is required (priceafterdiscount) ')
    .isFloat({ gt: 0 })
    .withMessage('Price after discount must be greater than 0'),

  check('category').notEmpty().withMessage('Category is required (category) '),

  check('subcategory').optional(),

  check('brand').notEmpty().withMessage('Brand is required (brand) '),

  check('colors').notEmpty().withMessage('Colors are required (colors) '),

  check('ptitle').custom(async val => {
    const productExist = await productObject.checkproductexist(val);

    if (productExist) {
      throw new Error('Product already exists');
    }

    return true;
  }),

  check('category').custom(async val => {
    const categoryExist = await categoryObject.checkcategoryexist(val);

    if (!categoryExist) {
      throw new Error('Category does not exist , you should create it first');
    }

    return true;
  }),

  check('brand').custom(async val => {
    const brandExist = await brandObject.checkbrandexist(val);
    if (!brandExist) {
      throw new Error('Brand does not exist , you should create it first');
    }

    return true;
  }),

  check('images').custom((value, { req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files.images || files.images.length === 0) {
      throw new Error('Images are required ( images )');
    }

    for (const file of files.images) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('All files must be images');
      }
    }

    return true;
  }),

  check('coverimage').custom((value, { req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files.coverimage || files.coverimage.length === 0) {
      throw new Error('Cover image is required (coverimage)');
    }

    if (!files.coverimage[0].mimetype.startsWith('image/')) {
      throw new Error('Cover image must be an image');
    }

    return true;
  }),

  validatorMiddleware
];

export const showProductValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product id is required (id) ')
    .isInt()
    .withMessage('Product id must be an integer'),

  validatorMiddleware
];

export const deleteProductValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product id is required (id) ')
    .isInt()
    .withMessage('Product id must be an integer')
    .custom(async val => {
      const productExist = await productObject.show(val);
      if (!productExist) {
        throw new Error('Product does not exist');
      }

      return true;
    }),

  validatorMiddleware
];

export const getProductsByCateValidator = [
  check('cate')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string'),

  validatorMiddleware
];

export const updateProductValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product id is required (id) ')
    .isInt()
    .withMessage('Product id must be an integer'),

  check('ptitle')
    .notEmpty()
    .withMessage('Product title cannot be empty if provided (ptitle) '),

  check('pdesc')
    .notEmpty()
    .withMessage('Product description cannot be empty if provided (pdesc) '),

  check('price')
    .notEmpty()
    .withMessage('Price cannot be empty if provided (price) ')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),

  check('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  check('priceafterdiscount')
    .notEmpty()
    .withMessage(
      'Price after discount cannot be empty if provided (priceafterdiscount) '
    )
    .isFloat({ gt: 0 })
    .withMessage('Price after discount must be greater than 0'),

  check('category')
    .notEmpty()
    .withMessage('Category cannot be empty if provided (category) '),

  check('subcategory').optional(),

  check('brand')
    .notEmpty()
    .withMessage('Brand cannot be empty if provided (brand) '),

  check('colors')
    .notEmpty()
    .withMessage('Colors cannot be empty if provided (colors) '),

  check('category').custom(async val => {
    const categoryExist = await categoryObject.checkcategoryexist(val);

    if (!categoryExist) {
      throw new Error('Category does not exist , you should create it first');
    }

    return true;
  }),

  check('brand').custom(async val => {
    const brandExist = await brandObject.checkbrandexist(val);
    if (!brandExist) {
      throw new Error('Brand does not exist , you should create it first');
    }

    return true;
  }),

  check('images').custom((value, { req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files.images || files.images.length === 0) {
      throw new Error('Images are required');
    }

    for (const file of files.images) {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('All files must be images');
      }
    }

    return true;
  }),

  check('coverimage').custom((value, { req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files.coverimage || files.coverimage.length === 0) {
      throw new Error('Cover image is required');
    }

    if (!files.coverimage[0].mimetype.startsWith('image/')) {
      throw new Error('Cover image must be an image');
    }

    return true;
  }),

  validatorMiddleware
];

export const createCommentValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .custom(async val => {
      const productExist = await productObject.show(val);
      if (!productExist) {
        throw new Error('Product does not exist');
      }
      return true;
    }),

  check('username').notEmpty().withMessage('Username is required'),

  check('text')
    .notEmpty()
    .withMessage('Comment text is required')
    .isString()
    .withMessage('Comment text must be a string'),

  check('stars')
    .notEmpty()
    .withMessage('Stars rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars rating must be an integer between 1 and 5'),

  validatorMiddleware
];

export const getProductCommentsValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be an integer')
    .custom(async val => {
      const productExist = await productObject.show(val);
      if (!productExist) {
        throw new Error('Product does not exist');
      }
      return true;
    }),

  validatorMiddleware
];

export const getProductStarsValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be an integer')
    .custom(async val => {
      const productExist = await productObject.show(val);
      if (!productExist) {
        throw new Error('Product does not exist');
      }
      return true;
    }),

  validatorMiddleware
];
