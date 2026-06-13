import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Mark } from '../../model/brand';

const brandobject = new Mark();

export const addBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of brand is required field  (name)')
    .custom(async val => {
      const brandexist = await brandobject.checkbrandexist(val);
      if (brandexist) {
        throw new Error(`brand already exists`);
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

export const deleteBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of brand is required field  (name)')
    .custom(async val => {
      const brandexist = await brandobject.checkbrandexist(val);
      if (!brandexist) {
        throw new Error(`brand does not exist`);
      }
      return true;
    }),

  validatorMiddleware
];
