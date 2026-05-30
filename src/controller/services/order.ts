import { Request, Response } from 'express';
import { Orderservices } from '../../model/services/order';
import { order } from '../../types/order';
import { product } from '../../types/product';
import fs from 'fs';
import path from 'path';
import { Product } from '../../model/product';

const ordersservices = new Orderservices();
const productobject = new Product();

export default class OrderServicesController {
  useractiveorders = async (req: Request, res: Response) => {
    try {
      const orders: order[] | [] = await ordersservices.checkstatus(
        parseInt(req.params.userid),
        'waiting'
      );

      if (orders.length > 0) {
        const data: order[] = [];
        for (const value of orders) {
          const items: product[] = [];

          for (const productId of value.items) {
            const productsData: product | boolean = await productobject.show(
              productId as string
            );

            if (!productsData || typeof productsData === 'boolean') {
              res.status(404);
              res.json({
                status: 'fail',
                msg: `Product with id ${productId} not found`
              });
              return;
            }

            const imagePath = path.join(
              __dirname,
              '../../uploads/products',
              productsData.coverimage
            );

            try {
              const imageData = await fs.promises.readFile(imagePath);

              const imgCover = imageData.toString('base64');

              productsData.imageCoverData = imgCover;
            } catch (err) {
              res.json({
                status: 'fail',
                msg: 'Failed to read product image',
                error: err
              });
              return;
            }

            items.push(productsData);
          }
          value.items = items;
          data.push(value);
        }
        res.json({ status: 'success', ordersCount: data.length, data: data });
        return;
      }
      res.status(404);
      res.json({
        status: 'success',
        msg: 'No Orders Found',
        ordersCount: 0,
        data: []
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Failed to retrieve orders',
        error: err
      });
      return;
    }
  };

  usercompleteorders = async (req: Request, res: Response) => {
    try {
      const data = [];

      const orders: order[] | [] = await ordersservices.checkstatus(
        parseInt(req.params.userid),
        'complete'
      );

      if (orders.length > 0) {
        for (const value of orders) {
          const items: product[] = [];

          for (const productId of value.items) {
            const productsData: product | boolean = await productobject.show(
              productId as string
            );

            if (!productsData || typeof productsData === 'boolean') {
              res.status(404);
              res.json({
                status: 'fail',
                msg: `Product with id ${productId} not found`
              });
              return;
            }

            const imagePath = path.join(
              __dirname,
              '../../uploads/products',
              productsData.coverimage
            );

            try {
              const imageData = await fs.promises.readFile(imagePath);

              const imgCover = imageData.toString('base64');

              productsData.imageCoverData = imgCover;
            } catch (err) {
              res.json({
                status: 'fail',
                msg: 'Failed to read product image',
                error: err
              });
              return;
            }

            items.push(productsData);
          }
          value.items = items;
          data.push(value);
        }
      }

      res.json({ status: 'success', ordersCount: data.length, data: data });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Failed to retrieve orders',
        error: err
      });
      return;
    }
  };
}
