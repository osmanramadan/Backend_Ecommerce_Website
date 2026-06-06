import { check, param } from 'express-validator';
import { validatorMiddleware } from '../../authorization/middelware/validatormiddelware';
import slugify from 'slugify';
import { User } from '../../model/user';
import { user } from '../../types/user';

const userobject = new User();

export const signupValidator = [
  check('username')
    .notEmpty()
    .withMessage('username required field')
    .isLength({ min: 5 })
    .withMessage('username must be at least 5 chars')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        throw new Error(`email already exists`);
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required field')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error(`password confirmation does not match`);
      }
      return true;
    }),

  check('phone')
    .notEmpty()
    .withMessage('phone required field')
    .isMobilePhone('ar-EG')
    .withMessage('accept only Egypt phone numbers')
    .custom(async (_val, { req }) => {
      const existphone = await userobject.phoneExists(req.body.phone);
      if (existphone) {
        throw new Error('phone already exists');
      }
      return true;
    }),

  validatorMiddleware
];

export const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`email not found`);
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('password required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars'),
  validatorMiddleware
];

export const forgetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`email not found`);
      }
      return true;
    }),

  validatorMiddleware
];
export const verifyPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`email not found`);
      }
      return true;
    }),
  check('resetCode')
    .notEmpty()
    .withMessage('reset code required')
    .isInt()
    .withMessage('reset code must be a number')
    .isLength({ min: 6 })
    .withMessage('reset code must be at least 6 characters'),

  validatorMiddleware
];

export const resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`email not found`);
      }
      return true;
    }),

  check('newPassword')
    .notEmpty()
    .withMessage('new password required (newPassword)')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('passwordConfirm is required field (confirmPassword)')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error(`password confirmation does not match`);
      }
      return true;
    }),

  validatorMiddleware
];

export const updateUserProfileValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        return true;
      }
      throw new Error(`email not found`);
    }),

  // at least username or phone must exist
  check().custom((_, { req }) => {
    if (!req.body.username && !req.body.phone) {
      throw new Error('username or phone is required');
    }

    return true;
  }),

  check('username')
    .optional()
    .isLength({ min: 5 })
    .withMessage('username must be at least 5 chars')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('phone')
    .optional()
    .isMobilePhone('ar-EG')
    .withMessage('accept only Egypt phone numbers')
    .custom(async (val, { req }) => {
      // search for user by phone
      const user: user | boolean = await userobject.getuserbyphone(val);

      // if phone does not exist => valid
      if (!user) {
        return true;
      }

      // if phone belongs to requested user => valid
      if (user && typeof user === 'object') {
        if (user.id == req.body.userid) {
          return true;
        }
      }

      // otherwise another user owns this phone
      throw new Error('phone already exists for another user');
    }),

  validatorMiddleware
];

export const updateUserPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required field')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`email not found`);
      }
      return true;
    }),

  check('newpassword')
    .notEmpty()
    .withMessage('new password required (newpassword)')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters')
    .custom((val, { req }) => {
      if (val === req.body.oldpassword) {
        throw new Error(`new password must be different from current password`);
      }
      return true;
    }),

  check('oldpassword')
    .notEmpty()
    .withMessage('old password required (oldpassword)')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),

  validatorMiddleware
];

export const useridValidator = [
  param('userid')
    .notEmpty()
    .withMessage('userid should be set')
    .isNumeric()
    .withMessage('userid should be number')
    .custom(async val => {
      const user = await userobject.show(val);
      if (!user) {
        throw new Error(`user not found`);
      }
      return true;
    }),
  validatorMiddleware
];
