import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { User } from '../../model/user';
import { Address } from '../../model/address';

const userobject = new User();
const addressobject = new Address();

export const addAddressValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`user with this email does not exist`);
      }
      return true;
    }),

  check('addrtitle')
    .notEmpty()
    .withMessage('address title is required field (addrtitle)'),

  check('addrdetails')
    .notEmpty()
    .withMessage('address details is required field (addrdetails)'),

  check('phone')
    .notEmpty()
    .withMessage('phone is required field (phone)')
    .isMobilePhone('ar-EG')
    .withMessage('invalid phone format (phone)'),

  validatorMiddleware
];

export const getUserAddressValidator = [
  param('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`user with this email does not exist`);
      }
      return true;
    }),

  validatorMiddleware
];

export const deleteAddressValidator = [
  param('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`user with this email does not exist`);
      }
      return true;
    }),

  check('addressId')
    .notEmpty()
    .withMessage('address ID is required field (addressId)')
    .isInt()
    .withMessage('address ID must be an integer (addressId)')
    .custom(async (val, { req }) => {
      const addressOwner = await addressobject.checkaddressowner(
        val,
        req.params!.email
      );
      if (!addressOwner) {
        throw new Error(
          `address with this ID does not exist or you are not the owner`
        );
      }
      return true;
    }),
  validatorMiddleware
];

export const updateAddressValidator = [
  
  param('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`user with this email does not exist`);
      }
      return true;
    }),

    check('addressId')
    .notEmpty()
    .withMessage('address ID is required field (addressId)')
    .isInt()
    .withMessage('address ID must be an integer (addressId)')
    .custom(async (val, { req }) => {
      const addressOwner = await addressobject.checkaddressowner(
        val,
        req.params!.email
      );
      if (!addressOwner) {
        throw new Error(
          `address with this ID does not exist or you are not the owner`
        );
      }
      return true;
    }),

  check('addrtitle')
    .notEmpty()
    .withMessage('address title is required field (addrtitle)'),

  check('addrdetails')
    .notEmpty()
    .withMessage('address details is required field (addrdetails)'),

  check('phone')
    .notEmpty()
    .withMessage('phone is required field (phone)')
    .isMobilePhone('ar-EG')
    .withMessage('invalid phone format (phone)'),
  validatorMiddleware
];
