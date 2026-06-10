import { Request, Response } from 'express';
import { coupon } from '../types/coupon';
import { Coupon } from '../model/coupon';

const couponobject = new Coupon();

export default class Couponcontroller {
  addcoupon = async (req: Request, res: Response) => {
    try {
      const coupon: coupon = {
        name: req.body.name,
        discount: req.body.discount,
        expire: req.body.expire
      };

      const result : coupon = await couponobject.create(coupon);
      if (result && typeof result === 'object') {
        res.json({
          status: 'success',
          msg: 'Coupon created successfully',
          data: result
        });
        return;
      } else {
        res.status(400);
        res.json({ status: 'error', msg: 'Error creating coupon' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error creating coupon' });
      return;
    }
  };

  show = async (req: Request, res: Response) => {

    try {

      const coupon : coupon | boolean = await couponobject.show(req.params.name);

      if (coupon) {
        res.json({ status: 'success', msg: 'Coupon retrieved successfully', data: coupon });
        return;
      }

      res.status(404);
      res.json({ status: 'fail', msg: 'Coupon not found' , data: []});
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error retrieving coupon' });
      return;
    }
  };

  index = async (_req: Request, res: Response) => {
    try {
      const coupons: coupon[] | [] = await couponobject.index();

      if (coupons.length > 0) {
        res.json({ status: 'success', msg: 'Coupons retrieved successfully', couponsCount: coupons.length, data: coupons });
        return;
      }
      res.status(404);
      res.json({ status: 'success',  msg: 'No coupons found',couponsCount:0 , data: [] });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error retrieving coupons' });
      return;
    }
  };

  deletecoupon = async (req: Request, res: Response) => {
    try {
      const result = await couponobject.deletecoupon(req.params.id);

      if (result) {
        res.json({ status: 'success', msg: 'Coupon deleted successfully' });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'fail',
          msg: 'Error deleting coupon , Or coupon not found'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error deleting coupon' });
      return;
    }
  };

  updatecoupon = async (req: Request, res: Response) => {
    try {
      const coupon: coupon = {
        id: req.body.id,
        name: req.body.name,
        discount: req.body.discount,
        expire: req.body.expire
      };
      const result : boolean = await couponobject.updatecoupon(coupon);

      if (result) {
        res.json({ status: 'success', msg: 'Coupon updated successfully' });
        return;
      } else {
        res.status(400);
        res.json({ status: 'error', msg: 'Error updating coupon' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error updating coupon' });
      return;
    }
  };
}
