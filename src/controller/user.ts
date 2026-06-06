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
      res.json({ status: 'error' });
      return;
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const userbyid = await userobject.show(req.params.userid);
      delete userbyid.password;
      if (userbyid) {
        res.json({ status: 'success', data: userbyid });
        return;
      }
      res.status(404);
      res.json({ status: 'fail', msg: 'User Not Found' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error in getting user' });
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
      res.json({ status: 'fail', msg: 'User Not Found' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error in deleting user' });
      return;
    }
  };

  getuserbycredentials = async (req: Request, res: Response) => {
    try {
      const userbyemail = await userobject.getuserbycredentials(
        req.body.email,
        req.body.password
      );

      if (userbyemail) {
        const token = await generatetoken(userbyemail);
        delete userbyemail.password;
        res.json({ status: 'success', data: userbyemail, token: token });
        return;
      } else {
        res.status(401);
        res.json({ status: 'Wrong Password' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error' });
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

      const newuser = await userobject.create(userquery);
      const token = await generatetoken(newuser);
      res.json({ status: 'success', token: token });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error' });
      return;
    }
  };

  forgetpassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
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
        res.json({
          status: 'fail',
          msg: 'Error in updating reset code of user in database'
        });
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
      await userobject.updateUserFields({
        email: email,
        passwordResetCode: undefined,
        passwordResetExpires: undefined,
        resetCodeVerified: undefined
      });
      res.status(400);
      res.json({ status: 'error', msg: 'Error in sending reset code to user' });
      return;
    }
  };

  verifyresetcode = async (req: Request, res: Response) => {
    try {
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
        res.json({ status: 'invalid code', msg: 'Invalid reset code' });
        return;
      }

      const check = await userobject.checkVerifyCode(req.body.email);
      if (check) {
        res.status(400);
        res.json({
          status: 'already verified',
          msg: 'Reset code already verified'
        });
        return;
      }

      if (result === 'expired code') {
        res.status(400);
        res.json({ status: 'expired code', msg: 'Reset code has expired' });
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
      res.json({ status: 'error', msg: 'Error in verifying reset code' });
      return;
    }
  };

  resetpassword = async (req: Request, res: Response) => {
    try {
      const check: boolean = await userobject.checkVerifyCode(req.body.email);
      if (!check) {
        res.status(400);
        res.json({
          status: 'fail',
          msg: 'Reset code not verified yet Or you have changed your password once you verified the code'
        });
        return;
      }
      const hash = await cipher.encrypt(req.body.newPassword);
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
          res.json({
            status: 'success',
            msg: 'Password reset successfully',
            token: token
          });
          return;
        }
      }

      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Error in updating new password in database'
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error in reset password' });
      return;
    }
  };

  updateuserprofile = async (req: Request, res: Response) => {
    try {
      const data: user = {
        email: req.body.email
      };

      if (req.body.slug) {
        data.username = req.body.slug;
      }

      if (req.body.phone) {
        data.phone = req.body.phone;
      }

      const updated = await userobject.updateUserFields(data);

      if (updated) {
        const userbyemail: user | boolean = await userobject.getuserbyemail(
          req.body.email
        );
        if (userbyemail && typeof userbyemail === 'object') {
          delete userbyemail.password;
          res.json({ status: 'success', data: userbyemail });
          return;
        }
      }

      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Error in updating user profile in database'
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error in updating user profile' });
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
        res.json({ status: 'success', msg: 'Password updated successfully' });
        return;
      } else {
        res.status(400);
        res.json({ status: 'fail', msg: 'wrong old password' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'An error occurred while updating the password'
      });
      return;
    }
  };
}
