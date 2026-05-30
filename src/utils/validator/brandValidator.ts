import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Mark } from '../../model/brand';

const brandobject = new Mark();

export const addBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name of brand is required field  (name)')
    .custom(async val => {
      const brandexist = await brandobject.checkbrandexist(val);
      if (brandexist) {
        throw new Error(`Brand already exists`);
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
