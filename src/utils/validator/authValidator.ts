import { check } from 'express-validator';
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
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        throw new Error(`Email already exists`);
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars'),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required field')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error(`Password confirmation does not match`);
      }
      return true;
    }),

  check('phone')
    .notEmpty()
    .withMessage('Phone required field')
    .isMobilePhone('ar-EG')
    .withMessage('accept only Egypt phone numbers')
    .custom(async (_val, { req }) => {
      const existphone = await userobject.phoneExists(req.body.phone);
      if (existphone) {
        throw new Error('Phone already exists');
      }
      return true;
    }),

  validatorMiddleware
];

export const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format'),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 chars'),
  validatorMiddleware
];

export const forgetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`Email not found`);
      }
      return true;
    }),

  validatorMiddleware
];
export const verifyPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`Email not found`);
      }
      return true;
    }),
  check('resetCode')
    .notEmpty()
    .withMessage('Reset code required')
    .isInt()
    .withMessage('Reset code must be a number')
    .isLength({ min: 6 })
    .withMessage('Reset code must be at least 6 characters'),

  validatorMiddleware
];

export const resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`Email not found`);
      }
      return true;
    }),

  check('newpassword')
    .notEmpty()
    .withMessage('new password required (newpassword)')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('passwordConfirm is required field (confirmPassword)')
    .custom((val, { req }) => {
      if (val !== req.body.newpassword) {
        throw new Error(`Password confirmation does not match`);
      }
      return true;
    }),

  validatorMiddleware
];

export const updateUserProfileValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        return true;
      }
      throw new Error(`Email not found`);
    }),

  // at least username or phone must exist
  check().custom((_, { req }) => {
    if (!req.body.username && !req.body.phone) {
      throw new Error('username or phone is required');
    }

    // if phone exists => id must exist
    // userid come from jwt middleware and put in req.body
    if (req.body.phone && !req.body.userid) {
      throw new Error('id is required when phone is provided');
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
      throw new Error('Phone already exists for another user');
    }),

  validatorMiddleware
];

export const updateUserPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required field')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (_val, { req }) => {
      const existemail = await userobject.emailExists(req.body.email);
      if (!existemail) {
        throw new Error(`Email not found`);
      }
      return true;
    }),

  check('newpassword')
    .notEmpty()
    .withMessage('new password required (newpassword)')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom((val, { req }) => {
      if (val === req.body.oldpassword) {
        throw new Error(`New password must be different from current password`);
      }
      return true;
    }),

  check('oldpassword')
    .notEmpty()
    .withMessage('old password required (oldpassword)')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  validatorMiddleware
];

export const useridValidator = [
  check('userid')
    .notEmpty()
    .withMessage('Userid should be set')
    .isNumeric()
    .withMessage('userid should be number')
    .custom(async val => {
      const user = await userobject.show(val);
      if (!user) {
        throw new Error(`User not found`);
      }
      return true;
    }),
  validatorMiddleware
];
