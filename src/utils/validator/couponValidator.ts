import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Coupon } from '../../model/coupon';

const couponobject = new Coupon();

export const showCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name of coupon is required field  (name)')
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

  check('discount')
    .notEmpty()
    .withMessage('Discount value is required field  (discount)')
    .isNumeric()
    .withMessage('Discount value must be a number (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('Expiry date is required field  (expire)')
    .isDate()
    .withMessage('Expiry date must be a valid date (expire)'),

  validatorMiddleware
];

export const deleteCouponValidator = [
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
    .isNumeric()
    .withMessage('Discount value must be a number (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('Expiry date is required field  (expire)')
    .isDate()
    .withMessage('Expiry date must be a valid date (expire)'),

  validatorMiddleware
];
