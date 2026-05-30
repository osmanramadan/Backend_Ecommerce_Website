"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_1 = __importDefault(require("../../controller/coupon"));
const couponValidator_1 = require("../../utils/validator/couponValidator");
const jwtmiddelware_1 = require("../../authorization/middelware/jwtmiddelware");
const CouponController = new coupon_1.default();
const coupon = express_1.default.Router();
coupon.get('/', CouponController.index);
coupon.get('/:name', couponValidator_1.showCouponValidator, CouponController.show);
coupon.post('/', jwtmiddelware_1.verifyAdmin, couponValidator_1.addCouponValidator, CouponController.addcoupon);
coupon.delete('/:id', jwtmiddelware_1.verifyAdmin, couponValidator_1.deleteCouponValidator, CouponController.deletecoupon);
coupon.put('/', jwtmiddelware_1.verifyAdmin, couponValidator_1.updateCouponValidator, CouponController.updatecoupon);
exports.default = coupon;
