import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Coupon } from '../../model/coupon';

const couponobject = new Coupon();

export const showCouponValidator = [
  param('name')
    .notEmpty()
    .withMessage('Name of coupon is required field as a URL parameter')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyname(val);
      if (!coupon) {
        throw new Error('Coupon with this name does not exist');
      }
      return true;
    }),
  validatorMiddleware
];

export const addCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name of coupon is required field  (name)')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyname(val);
      if (coupon) {
        throw new Error('Coupon with this name already exists');
      }
      return true;
    }),
  // Note ✨ : we can add more validation for discount value like it must be between 0 and 100
  check('discount')
    .notEmpty()
    .withMessage('Discount value is required field  (discount)')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount value must be a float between 0 and 100 (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('Expiry date is required field  (expire)')
    .isDate()
    .withMessage('Expiry date must be a valid date (expire)'),

  validatorMiddleware
];

export const deleteCouponValidator = [
  param('id')
    .notEmpty()
    .withMessage('Coupon ID is required as a URL parameter')
    .isInt()
    .withMessage('Coupon ID must be an integer')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyid(val);
      if (!coupon) {
        throw new Error('Coupon with this ID does Not exist');
      }
      return true;
    }),
  validatorMiddleware
];

export const updateCouponValidator = [
  check('id')
    .notEmpty()
    .withMessage('Coupon ID is required')
    .isInt()
    .withMessage('Coupon ID must be an integer')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyid(val);
      if (!coupon) {
        throw new Error('Coupon with this ID does Not exist');
      }
      return true;
    }),

  check('name')
    .notEmpty()
    .withMessage('Name of coupon is required field  (name)')
    .custom(async (val, { req }) => {
      const coupon = await couponobject.show(val);
      if (coupon && Number(coupon.id) !== Number(req.body.id)) {
        throw new Error('Coupon with this name already exists');
      }
      return true;
    }),

  check('discount')
    .notEmpty()
    .withMessage('Discount value is required field  (discount)')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount value must be a float between 0 and 100 (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('Expiry date is required field  (expire)')
    .isDate()
    .withMessage('Expiry date must be a valid date (expire)'),

  validatorMiddleware
];
