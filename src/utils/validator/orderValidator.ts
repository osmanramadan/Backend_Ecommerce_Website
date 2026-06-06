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
    .withMessage('User id is required field (userid)')
    .isNumeric()
    .withMessage('User id must be a number')
    .custom(async value => {
      const user = await userobject.show(value);
      if (!user) {
        throw new Error('User not found');
      }
    }),

  check('items')
    .isArray({ min: 1 })
    .withMessage(
      'Items are required and must be an array with at least one item'
    )
    .custom(async items => {
      for (const productId of items) {
        if (isNaN(productId)) {
          throw new Error(`Product id ${productId} must be a number`);
        }

        const productExists = await productobject.show(productId);
        if (!productExists) {
          throw new Error('Product not found with id ' + productId);
        }
      }

      return true;
    }),

  check('price')
    .notEmpty()
    .withMessage('Price is required field (price)')
    .isNumeric()
    .withMessage('Price must be a number'),

  check('address')
    .notEmpty()
    .withMessage('Address is required field (address)')
    .isArray({ min: 1 })
    .withMessage('Address must be an array with at least one item')
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
          'Each address item must be a valid object with non-empty values'
        );
      }

      return true;
    }),

  check('userinfo')
    .notEmpty()
    .withMessage('User info is required field (userinfo)')
    .isArray({ min: 1 })
    .withMessage('User info must be an array with at least one item')
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
          'Each userinfo item must be a valid object with non-empty values'
        );
      }

      return true;
    }),

  check('status')
    .notEmpty()
    .withMessage('Order status is required field (status)')
    .isIn(['complete', 'waiting', 'cancle'])
    .withMessage(
      'Order status must be one of the following: complete, waiting, cancle'
    ),

  validatorMiddleware
];

export const checkforuseridValidator = [
  param('userid')
    .notEmpty()
    .withMessage('User id is required field (userid)')
    .isNumeric()
    .withMessage('User id must be a number')
    .custom(async value => {
      const user = await userobject.show(value);
      if (!user) {
        throw new Error('User not found');
      }
    }),

  validatorMiddleware
];

export const updateorderstatusValidator = [
  check('orderId')
    .notEmpty()
    .withMessage('Order id is required field (orderId)')
    .isNumeric()
    .withMessage('Order id must be a number')
    .custom(async value => {
      const orderExists = await orderobject.checkorderexist(value);
      if (!orderExists) {
        throw new Error('Order not found');
      }
    }),

  check('status')
    .notEmpty()
    .withMessage('Order status is required field (status)')
    .isIn(['complete', 'waiting', 'cancle'])
    .withMessage(
      'Order status must be one of the following: complete, waiting, cancle'
    ),

  validatorMiddleware
];

export const deleteorderValidator = [
  param('orderId')
    .notEmpty()
    .withMessage('Order id is required field (orderId)')
    .isNumeric()
    .withMessage('Order id must be a number')
    .custom(async value => {
      const orderExists = await orderobject.checkorderexist(value);
      if (!orderExists) {
        throw new Error('Order not found');
      }
    }),

  validatorMiddleware
];

export const addproductTOorderValidator = [
  check('orderId')
    .notEmpty()
    .withMessage('Order id is required field (orderId)')
    .isNumeric()
    .withMessage('Order id must be a number')
    .custom(async value => {
      const orderExists = await orderobject.checkorderexist(value);
      if (!orderExists) {
        throw new Error('Order not found');
      }
    }),

  check('productId')
    .notEmpty()
    .withMessage('Product id is required field (productId)')
    .isNumeric()
    .withMessage('Product id must be a number')
    .custom(async value => {
      const productExists = await productobject.show(value);
      if (!productExists) {
        throw new Error('Product not found');
      }
    }),

  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required field (quantity)')
    .isNumeric()
    .withMessage('Quantity must be a number'),

  validatorMiddleware
];
