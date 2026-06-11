import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { Order } from '../../model/order';
import { User } from '../../model/user';
import { Product } from '../../model/product';
import { address } from '../../types/address';
import { user } from '../../types/user';

const orderobject = new Order();
const productobject = new Product();
const userobject = new User();

export const createorderValidator = [
  check('userid')
    .notEmpty()
    .withMessage('user id is required field (userid)')
    .isNumeric()
    .withMessage('user id must be a number')
    .custom(async value => {
      const user = await userobject.show(value);
      if (!user) {
        throw new Error('user not found');
      }
    }),

  check('items')
    .isArray({ min: 1 })
    .withMessage(
      'items are required and must be an array with at least one item'
    )
    .custom(async items => {
      for (const productId of items) {
        if (isNaN(productId)) {
          throw new Error(`product id ${productId} must be a number`);
        }

        const productExists = await productobject.show(productId);
        if (!productExists) {
          throw new Error('product not found with id ' + productId);
        }
      }

      return true;
    }),

  check('price')
    .notEmpty()
    .withMessage('price is required field (price)')
    .isNumeric()
    .withMessage('price must be a number'),

  check('address')
    .notEmpty()
    .withMessage('address is required field (address)')
    .isArray({ min: 1 })
    .withMessage('address must be an array with at least one item')
    .custom(value => {
      if (
        !value.every((item: address) => {
          // must be object
          if (typeof item !== 'object' || item === null) {
            return false;
          }

          // object must contain values
          return (
            Object.keys(item).length > 0 &&
            Object.values(item).every(
              val => val !== '' && val !== null && val !== undefined
            )
          );
        })
      ) {
        throw new Error(
          'each address item must be a valid object with non-empty values'
        );
      }

      return true;
    }),

  check('userinfo')
    .notEmpty()
    .withMessage('user info is required field (userinfo)')
    .isArray({ min: 1 })
    .withMessage('user info must be an array with at least one item')
    .custom(value => {
      if (
        !value.every((item: user) => {
          // must be object
          if (typeof item !== 'object' || item === null) {
            return false;
          }

          // object must contain values
          return (
            Object.keys(item).length > 0 &&
            Object.values(item).every(
              val => val !== '' && val !== null && val !== undefined
            )
          );
        })
      ) {
        throw new Error(
          'each userinfo item must be a valid object with non-empty values'
        );
      }

      return true;
    }),

  check('status')
    .notEmpty()
    .withMessage('order status is required field (status)')
    .isIn(['complete', 'waiting', 'cancle'])
    .withMessage(
      'order status must be one of the following: complete, waiting, cancle'
    ),

  validatorMiddleware
];

export const checkforuseridValidator = [
  param('userid')
    .notEmpty()
    .withMessage('user id is required field (userid)')
    .isNumeric()
    .withMessage('user id must be a number')
    .custom(async value => {
      const user = await userobject.show(value);
      if (!user) {
        throw new Error('user not found');
      }
    }),

  validatorMiddleware
];

export const updateorderstatusValidator = [
  check('orderId')
    .notEmpty()
    .withMessage('order id is required field (orderId)')
    .isNumeric()
    .withMessage('order id must be a number')
    .custom(async value => {
      const orderExists = await orderobject.checkorderexist(value);
      if (!orderExists) {
        throw new Error('order not found');
      }
    }),

  check('status')
    .notEmpty()
    .withMessage('order status is required field (status)')
    .isIn(['complete', 'waiting', 'cancle'])
    .withMessage(
      'order status must be one of the following: complete, waiting, cancle'
    ),

  validatorMiddleware
];

export const deleteorderValidator = [
  param('orderId')
    .notEmpty()
    .withMessage('order id is required field (orderId)')
    .isNumeric()
    .withMessage('order id must be a number')
    .custom(async value => {
      const orderExists = await orderobject.checkorderexist(value);
      if (!orderExists) {
        throw new Error('order not found');
      }
    }),

  validatorMiddleware
];

export const addproductTOorderValidator = [
  check('orderId')
    .notEmpty()
    .withMessage('order id is required field (orderId)')
    .isNumeric()
    .withMessage('order id must be a number')
    .custom(async (value, { req }) => {
      const orderExists = await orderobject.checkuserorderexist(req.body.userid,value);
      if (!orderExists) {
        throw new Error('order not found Or does not belong to you');
      }
    }),

  check('productId')
    .notEmpty()
    .withMessage('product id is required field (productId)')
    .isNumeric()
    .withMessage('product id must be a number')
    .custom(async value => {
      const productExists = await productobject.show(value);
      if (!productExists) {
        throw new Error('product not found');
      }
    }),

  check('quantity')
    .notEmpty()
    .withMessage('quantity is required field (quantity)')
    .isNumeric()
    .withMessage('quantity must be a number'),

  validatorMiddleware
];
