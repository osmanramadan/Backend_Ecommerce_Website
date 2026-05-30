import express from 'express';
import Couponcontroller from '../../controller/coupon';
import {
  addCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  showCouponValidator
} from '../../utils/validator/couponValidator';
import { verifyAdmin } from '../../authorization/middelware/jwtmiddelware';

const CouponController = new Couponcontroller();
const coupon: express.Router = express.Router();

coupon.get('/', CouponController.index);
coupon.get('/:name', showCouponValidator, CouponController.show);
coupon.post('/', verifyAdmin, addCouponValidator, CouponController.addcoupon);
coupon.delete(
  '/:id',
  verifyAdmin,
  deleteCouponValidator,
  CouponController.deletecoupon
);
coupon.put(
  '/',
  verifyAdmin,
  updateCouponValidator,
  CouponController.updatecoupon
);

export default coupon;
