"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../../controller/user"));
const jwtmiddelware_1 = __importStar(require("../../authorization/middelware/jwtmiddelware"));
const user_2 = __importDefault(require("../../controller/services/user"));
const authValidator_1 = require("../../utils/validator/authValidator");
const usercontroller = new user_1.default();
const usercontrollerservices = new user_2.default();
const users = express_1.default.Router();
users.get('/', jwtmiddelware_1.verifyAdmin, usercontroller.index);
users.post('/signup', authValidator_1.signupValidator, usercontroller.create);
users.post('/login', authValidator_1.loginValidator, usercontroller.getuserbycredentials);
users.post('/forgotPassword', authValidator_1.forgetPasswordValidator, usercontroller.forgetpassword);
users.post('/verifyResetCode', authValidator_1.verifyPasswordValidator, usercontroller.verifyresetcode);
users.post('/resetPassword', authValidator_1.resetPasswordValidator, usercontroller.resetpassword);
users.put('/updateuserprofile', jwtmiddelware_1.default, authValidator_1.updateUserProfileValidator, usercontroller.updateuserprofile);
users.put('/updateuserpassword', jwtmiddelware_1.default, authValidator_1.updateUserPasswordValidator, usercontroller.updateuserpassword);
users.get('/:userid', authValidator_1.useridValidator, jwtmiddelware_1.default, usercontroller.show);
// This option is to allow users to delete their accounts but not others accounts
users.delete('/:userid', authValidator_1.useridValidator, jwtmiddelware_1.default, usercontroller.delete);
users.get('/purchases/:userid', authValidator_1.useridValidator, jwtmiddelware_1.default, usercontrollerservices.userpurchases);
exports.default = users;
