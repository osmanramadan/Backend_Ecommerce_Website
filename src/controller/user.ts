import { Request, Response } from 'express';
import { User } from '../model/user';
import { user } from '../types/user';
import crypto from 'crypto';
import generatetoken from '../authorization/signtoken';
import sendEmail from '../utils/sendmail';
import Cipher from '../authentication/bcrypt';

const userobject = new User();
const cipher = new Cipher();

export default class Usercontroller {
  index = async (_req: Request, res: Response) => {
    try {
      const allusers = await userobject.index();
      res.json(allusers);
      return;
    } catch (e) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const userbyid = await userobject.show(req.params.userid);

      if (userbyid) {
        res.json(userbyid);
        return;
      }
      res.status(404);
      res.json({ status: 'fail', msg: 'User Not Found' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await userobject.deleteuser(req.params.userid);

      if (deleted) {
        res.json({ status: 'success' });
        return;
      }
      res.status(404);
      res.json({ status: 'fail', msg: 'User not found' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  getuserbycredentials = async (req: Request, res: Response) => {
    try {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        const userbyemail = await userobject.getuserbycredentials(
          req.body.email,
          req.body.password
        );
        if (userbyemail) {
          const token = await generatetoken(userbyemail);
          delete userbyemail.password;
          res.json({ data: userbyemail, token: token });
          return;
        } else {
          res.json({ error: 'Password wrong' });
          return;
        }
      } else {
        res.status(404);
        res.json({ error: 'Email not found' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };
  getuserbyemail = async (req: Request, res: Response) => {
    try {
      const existemail = await userobject.emailExists(req.body.email);
      if (existemail) {
        const userbyemail = await userobject.getuserbyemail(req.body.email);
        if (userbyemail) {
          res.json(userbyemail);
          return;
        } else {
          res.status(404);
          res.json({ error: 'User not found' });
          return;
        }
      } else {
        res.status(404);
        res.json({ error: 'Email not found' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userquery: user = {
        email: req.body.email,
        username: req.body.slug,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phone: req.body.phone
      };

      //@ if you uncomment these lines you should comment the validation in authValidator because it will do the same work and you will get error of validation because of the custom validation in authValidator

      // const existemail = await userobject.emailExists(req.body.email);
      // if (existemail) {
      // res.json({ error: 'Email already exist' });
      // return;
      // }

      // const existphone = await userobject.phoneExists(req.body.phone);
      // if (existphone) {
      // res.json({ error: 'Phone already exist' });
      // return;
      //  }

      const newuser = await userobject.create(userquery);
      const token = await generatetoken(newuser);
      res.json({ token: token });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  forgetpassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      //@ if you uncomment these lines you should comment the validation in authValidator because it will do the same work and you will get error of validation because of the custom validation in authValidator
      //const existemail = await userobject.emailExists(email);
      //if (!existemail) {
      //res.status(404);
      //@ You can add field named msq to tell frontend that this message is for "email not found" error to handle it in frontend
      //res.json({ status: 'fail' });
      //return;
      //}

      const generateRandomSixDigitCode = () => {
        const min = 100000; // Minimum value for a six-digit number
        const max = 999999; // Maximum value for a six-digit number
        const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomCode.toString();
      };

      const resetCode = generateRandomSixDigitCode();
      const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
      // Set the reset code to expire after 10 minutes
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
      const resetCodeVerified = false;
      const updated = await userobject.updateUserFields({
        email: email,
        passwordResetCode: hashedResetCode,
        passwordResetExpires: passwordResetExpires,
        resetCodeVerified: resetCodeVerified
      });

      if (!updated) {
        res.status(400);
        res.json({ status: 'fail to update' });
        return;
      }
      const message = `Forgot your password ? Submit this reset password code:
            ${resetCode}\n If you didn't forget your password, please ignore this email!`;

      await sendEmail({
        email: email,
        subject: 'Your Password Reset Code (valid for 10 min)',
        message,
        resetCode: resetCode
      });

      res.status(200).json({
        status: 'success',
        message: 'Reset code sent to your email'
      });
      return;
    } catch (err) {
      console.error(err);
      await userobject.updateUserFields({
        email: email,
        passwordResetCode: undefined,
        passwordResetExpires: undefined,
        resetCodeVerified: undefined
      });
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  verifyresetcode = async (req: Request, res: Response) => {
    try {
      //@ if you uncomment these lines you should comment the validation in authValidator because it will do the same work and you will get error of validation because of the custom validation in authValidator
      //const existemail = await userobject.emailExists(req.body.email);
      //if (!existemail) {
      //res.status(404);
      //res.json({ status: 'email not found' });
      //return;
      // }

      const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

      const result = await userobject.checkResetCode(
        req.body.email,
        hashedResetCode
      );
      if (result === 'invalid code') {
        res.status(400);
        res.json({ status: 'invalid code' });
        return;
      }

      const check = await userobject.checkVerifyCode(req.body.email);
      if (check) {
        res.status(400);
        res.json({ status: 'already verified' });
        return;
      }

      if (result === 'expired code') {
        res.status(400);
        res.json({ status: 'expired code' });
        return;
      }

      const updated = await userobject.updateUserFields({
        email: req.body.email,
        resetCodeVerified: true
      });

      if (updated) {
        res.status(200);
        res.json({ status: 'success' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };

  resetpassword = async (req: Request, res: Response) => {
    try {
      //@ if you uncomment these lines you should comment the validation in authValidator because it will do the same work and you will get error of validation because of the custom validation in authValidator
      // const result = await userobject.emailExists(req.body.email);
      // if (!result) {
      // res.status(400);
      // res.json({ status: 'fail' });
      // return;
      // }
      const check = await userobject.checkVerifyCode(req.body.email);
      if (!check) {
        res.status(400);
        // You can add field named msq to tell frontend that this message is for "code not verified" error to handle it in frontend
        res.json({ status: 'fail' });
        return;
      }
      const hash = await cipher.encrypt(req.body.newpassword);
      const updated = await userobject.updateUserFields({
        email: req.body.email,
        password: hash,
        passwordResetCode: undefined,
        passwordResetExpires: undefined,
        resetCodeVerified: undefined
      });

      if (updated) {
        const userData: user | boolean = await userobject.getuserbyemail(
          req.body.email
        );
        if (userData && typeof userData === 'object') {
          const token = await generatetoken(userData);
          res.json({ status: 'success', token: token });
          return;
        }
      }

      res.status(400);
      res.json({ status: 'error', msg: 'Error in reset password' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail', err: err });
      return;
    }
  };

  updateuserprofile = async (req: Request, res: Response) => {
    try {
      const data: user = {
        email: req.body.email
      };

      if (req.body.username) {
        data.username = req.body.username;
      }

      if (req.body.phone) {
        data.phone = req.body.phone;
      }

      const updated = await userobject.updateUserFields(data);

      if (updated) {
        const userbyemail = await userobject.getuserbyemail(req.body.email);
        res.status(200);
        res.json({ status: 'success', data: userbyemail });
        return;
      }

      res.status(400);
      res.json({ status: 'fail' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail' });
    }
  };

  updateuserpassword = async (req: Request, res: Response) => {
    try {
      const updated = await userobject.updateuserpassword(
        req.body.email,
        req.body.oldpassword,
        req.body.newpassword
      );

      if (updated) {
        res.status(200);
        res.json({ status: 'success' });
        return;
      } else {
        res.status(400);
        res.json({ status: 'fail', msg: 'wrong old password' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'An error occurred while updating the password'
      });
      return;
    }
  };
}
