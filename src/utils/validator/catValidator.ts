import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Category } from '../../model/category';

const categoryobject = new Category();

export const addCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name of category is required field  (name)')
    .custom(async val => {
      const catexist = await categoryobject.checkcategoryexist(val);
      if (catexist) {
        throw new Error(`Category already exists`);
      }
      return true;
    }),

  check('image').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Image is required (image)');
    }

    if (!req.file.mimetype.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    return true;
  }),

  validatorMiddleware
];
