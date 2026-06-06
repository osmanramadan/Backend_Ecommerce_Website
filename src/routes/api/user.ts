import express from 'express';
import Usercontroller from '../../controller/user';
import verify, {
  verifyAdmin
} from '../../authorization/middelware/jwtmiddelware';
import UserServicesController from '../../controller/services/user';
import {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  verifyPasswordValidator,
  resetPasswordValidator,
  updateUserProfileValidator,
  updateUserPasswordValidator,
  useridValidator
} from '../../utils/validator/authValidator';

const usercontroller = new Usercontroller();
const usercontrollerservices = new UserServicesController();
const users: express.Router = express.Router();

users.get('/', verifyAdmin, usercontroller.index);
users.post('/signup', signupValidator, usercontroller.create);
users.post('/login', loginValidator, usercontroller.getuserbycredentials);
//----
users.post(
  '/forgotPassword',
  forgetPasswordValidator,
  usercontroller.forgetpassword
);
users.post(
  '/verifyResetCode',
  verifyPasswordValidator,
  usercontroller.verifyresetcode
);
users.post(
  '/resetPassword',
  resetPasswordValidator,
  usercontroller.resetpassword
);
//----
users.put(
  '/updateuserprofile',
  verify,
  updateUserProfileValidator,
  usercontroller.updateuserprofile
);
users.put(
  '/updateuserpassword',
  verify,
  updateUserPasswordValidator,
  usercontroller.updateuserpassword
);
users.get('/:userid',verify,useridValidator, usercontroller.show);

// This option is to allow users to delete their accounts but not others accounts
users.delete('/:userid',verify,useridValidator, usercontroller.delete);

users.get(
  '/purchases/:userid',
  verify,
  useridValidator,
  usercontrollerservices.userpurchases
);
export default users;
