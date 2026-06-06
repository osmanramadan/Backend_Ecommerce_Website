import { Request, Response } from 'express';
import { Address } from '../model/address';
import { address } from '../types/address';

const addressobject = new Address();

export default class Addresscontroller {
  addaddress = async (req: Request, res: Response) => {
    try {
      const result: boolean = await addressobject.adduseraddress(
        req.body.email,
        req.body.addrtitle,
        req.body.addrdetails,
        req.body.phone
      );
      if (result) {
        res.json({
          status: 'success',
          msg: 'Address added successfully'
        });
        return;
      } else {
        res.status(400);
        res.json({ status: 'fail', msg: 'Failed to add address' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Error occurred while adding address' });
    }
  };

  viewuseraddress = async (req: Request, res: Response) => {
    try {
      const result: address[] | boolean = await addressobject.viewuseraddress(
        req.params.email
      );

      if (result && Array.isArray(result)) {
        res.json({
          status: 'success',
          addressCount: result.length,
          data: result
        });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'No address',
          msg: 'No address found for this user'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to retrieve addresses' });
      return;
    }
  };

  deleteuseraddress = async (req: Request, res: Response) => {
    try {
      const result = await addressobject.deleteuseraddress(req.body.addressId);

      if (result) {
        res.json({ status: 'success', msg: 'Address deleted successfully' });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'No address',
          msg: 'No address found with the provided ID'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to delete address' });
      return;
    }
  };

  updateuseraddress = async (req: Request, res: Response) => {
    try {
      const result = await addressobject.updateuseraddress(
        req.body.addrtitle,
        req.body.addrdetails,
        req.body.phone,
        req.body.addressId
      );

      if (result) {
        res.json({ status: 'success', msg: 'Address updated successfully' });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'fail',
          msg: 'No address found with the provided ID'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to update address' });
      return;
    }
  };
}
