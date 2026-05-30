import { check } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';

import { User } from '../../model/user';

const userobject = new User();

export const addAddressValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`User with this email does not exist`);
      }
      return true;
    }),

  check('addrtitle')
    .notEmpty()
    .withMessage('Address title is required field (addrtitle)'),

  check('addrdetails')
    .notEmpty()
    .withMessage('Address details is required field (addrdetails)'),

  check('phone')
    .notEmpty()
    .withMessage('Phone is required field (phone)')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone format (phone)'),

  validatorMiddleware
];

export const getUserAddressValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async val => {
      const existemail = await userobject.emailExists(val);
      if (!existemail) {
        throw new Error(`User with this email does not exist`);
      }
      return true;
    }),
  validatorMiddleware
];

export const deleteAddressValidator = [
  check('addressId')
    .notEmpty()
    .withMessage('Address ID is required field (addressId)')
    .isInt()
    .withMessage('Address ID must be an integer (addressId)'),
  validatorMiddleware
];

export const updateAddressValidator = [
  check('addressId')
    .notEmpty()
    .withMessage('Address ID is required field (addressId)')
    .isInt()
    .withMessage('Address ID must be an integer (addressId)'),

  check('addrtitle')
    .notEmpty()
    .withMessage('Address title is required field (addrtitle)'),

  check('addrdetails')
    .notEmpty()
    .withMessage('Address details is required field (addrdetails)'),

  check('phone')
    .notEmpty()
    .withMessage('Phone is required field (phone)')
    .isMobilePhone('ar-EG')
    .withMessage('Invalid phone format (phone)'),
  validatorMiddleware
];
