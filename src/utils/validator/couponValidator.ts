import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Coupon } from '../../model/coupon';
import { coupon } from '../../types/coupon';
const couponobject = new Coupon();

export const showCouponValidator = [
  param('name')
    .notEmpty()
    .withMessage('name of coupon is required field as a URL parameter')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyname(val);
      if (!coupon) {
        throw new Error('coupon with this name does not exist');
      }
      return true;
    }),
  validatorMiddleware
];

export const addCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('name of coupon is required field  (name)')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyname(val);
      if (coupon) {
        throw new Error('coupon with this name already exists');
      }
      return true;
    }),

    check('discount')
    .notEmpty()
    .withMessage('discount value is required field  (discount)')
    .isFloat({ min: 0, max: 100 })
    .withMessage('discount value must be a float between 0 and 100 (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('expiry date is required field  (expire)')
    .isDate()
    .withMessage('expiry date must be a valid date (expire)'),

  validatorMiddleware
];

export const deleteCouponValidator = [
  param('id')
    .notEmpty()
    .withMessage('coupon ID is required as a URL parameter')
    .isInt()
    .withMessage('coupon ID must be an integer')
    .custom(async val => {
      const coupon = await couponobject.checkcouponexistbyid(val);
      if (!coupon) {
        throw new Error('coupon with this ID does Not exist');
      }
      return true;
    }),
  validatorMiddleware
];

export const updateCouponValidator = [
  check('id')
    .notEmpty()
    .withMessage('coupon ID is required')
    .isInt()
    .withMessage('coupon ID must be an integer')
    .custom(async val => {
      const coupon : boolean = await couponobject.checkcouponexistbyid(val);
      if (!coupon) {
        throw new Error('coupon with this ID does Not exist');
      }
      return true;
    }),

  check('name')
    .notEmpty()
    .withMessage('name of coupon is required field  (name)')
    .custom(async (val, { req }) => {
      const coupon : coupon | boolean = await couponobject.show(val);
      if (coupon && typeof coupon === 'object' && Number(coupon.id) !== Number(req.body.id)) {
        throw new Error('coupon with this name already exists');
      }
      return true;
    }),

  check('discount')
    .notEmpty()
    .withMessage('discount value is required field  (discount)')
    .isFloat({ min: 0, max: 100 })
    .withMessage('discount value must be a float between 0 and 100 (discount)'),

  check('expire')
    .notEmpty()
    .withMessage('expiry date is required field  (expire)')
    .isDate()
    .withMessage('expiry date must be a valid date (expire)'),

  validatorMiddleware
];
