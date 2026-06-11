import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Category } from '../../model/category';
import { SubCategory } from '../../model/subcategory';

const categoryobject = new Category();
const subcategoryobject = new SubCategory();

export const addSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of subcategory is required field  (name)')
    .custom(async val => {
      const subcatexist = await subcategoryobject.checksubcategoryexist(val);
      if (subcatexist) {
        throw new Error(`subcategory already exists`);
      }
      return true;
    }),

  check('maincat')
    .notEmpty()
    .withMessage('main category should be provided (maincat)')
    .custom(async val => {
      const categoryexist = await categoryobject.checkcategoryexist(val);
      if (!categoryexist) {
        throw new Error(`main category does not exist`);
      }
      return true;
    }),

  validatorMiddleware
];

export const deleteSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of subcategory is required field  (name)')
    .custom(async val => {
      const subcategoryexist = await subcategoryobject.checksubcategoryexist(
        val
      );
      if (!subcategoryexist) {
        throw new Error(`subcategory does not exist`);
      }
      return true;
    }),

  validatorMiddleware
];
