import { Request, Response } from 'express';
import { Userservices } from '../../model/services/user';
import { product } from '../../types/product';
import path from 'path';
import fs from 'fs';

const userservices = new Userservices();
export default class UserServicesController {
  userpurchases = async (req: Request, res: Response) => {
    try {
      const purchases: product[] = await userservices.userpurchases(
        req.params.userid
      );

      if (purchases.length > 0) {
        const data: product[] = [];

        for (const value of purchases) {
          const imagePath = path.join(
            __dirname,
            '../../uploads/products',
            value.coverimage
          );

          try {
            const imageData = await fs.promises.readFile(imagePath);

            const imgCover = imageData.toString('base64');

            value.imageCoverData = imgCover;
          } catch (err) {
            res.json({
              status: 'fail',
              msg: 'Failed to read product image',
              error: err
            });
            return;
          }
          data.push(value);
        }
        res.json({
          status: 'success',
          purchasesCount: data.length,
          data: data
        });
        return;
      }
      res.json({
        status: 'success',
        msg: 'No purchases found',
        purchasesCount: 0,
        data: []
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        error: `Failed to retrieve user purchases: ${err}`
      });
      return;
    }
  };
}
