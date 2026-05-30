import { Request, Response } from 'express';
import { Productservices } from '../../model/services/product';
import { product } from '../../types/product';
import path from 'path';
import fs from 'fs';

const productservices = new Productservices();

export default class ProductServicesController {
  getproductsbycate = async (req: Request, res: Response) => {
    try {
      const products: product[] | [] = await productservices.productCate(
        req.params.cate
      );

      if (products.length > 0) {
        const data: product[] = [];

        for (const value of products) {
          const imagePath = path.join(
            __dirname,
            '../../uploads/products',
            value.coverimage
          );

          try {
            const imageData = await fs.promises.readFile(imagePath);

            value.imageCoverData = imageData.toString('base64');
          } catch (err) {
            res.status(500).json({
              status: 'fail',
              msg: 'Failed to read product image',
              error: err
            });
            return;
          }

          data.push(value);
        }

        res.status(200).json({
          status: 'success',
          productsCount: data.length,
          data
        });
        return;
      }

      res.status(404).json({
        status: 'fail',
        msg: 'No products found in this category',
        data: []
      });
    } catch (e) {
      res.status(400).json({
        status: 'fail',
        error: e
      });
    }
  };

  mostpopular = async (_req: Request, res: Response) => {
    try {
      const products: product[] | [] = await productservices.mostpopular();

      if (products.length > 0) {
        const data: product[] = [];

        for (const value of products) {
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
            res.status(500);
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
          productsCount: data.length,
          data: data
        });
        return;
      }
      res.status(404);
      res.json({
        status: 'fail',
        msg: 'No products in orders found yet',
        data: []
      });
      return;
    } catch (e) {
      res.status(400);
      res.json({ status: 'fail' });
      return;
    }
  };
}
