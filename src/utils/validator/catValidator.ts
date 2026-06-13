import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Category } from '../../model/category';

const categoryobject = new Category();

export const addCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of category is required field  (name)')
    .custom(async val => {
      const catexist = await categoryobject.checkcategoryexist(val);
      if (catexist) {
        throw new Error(`category already exists`);
      }
      return true;
    }),

  check('image').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('image is required (image)'); // this handled in uploadimage middleware , but it is her for more safety .
    }

    if (!req.file.mimetype.startsWith('image/')) {
      throw new Error('file must be an image'); // this handled in uploadimage middleware , but it is her for more safety .
    }

    return true;
  }),

  validatorMiddleware
];

export const deleteCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of category is required field  (name)')
    .custom(async val => {
      const categoryexist = await categoryobject.checkcategoryexist(val);
      if (!categoryexist) {
        throw new Error(`category does not exist`);
      }
      return true;
    }),

  validatorMiddleware
];
