import { Request, Response } from 'express';
import { Order } from '../model/order';
import { order, orderproduct } from '../types/order';
import { Product } from '../model/product';
import { product } from '../types/product';
import fs from 'fs';
import path from 'path';

const orderobject = new Order();
const productobject = new Product();

export default class Ordercontroller {
  index = async (_req: Request, res: Response) => {
    try {
      const orders: order[] | [] = await orderobject.index();

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
            // uncomment this if you want to work locally as you like
            //const imagePath = path.join(
            //__dirname,
            //'../uploads/products',
            //productsData.coverimage
            //);

            // this for work on server
            const imagePath = path.join(
              process.cwd(),
              'uploads',
              'products',
              productsData.coverimage
            );

            try {
              const imageData = await fs.promises.readFile(imagePath);

              const imgCover = imageData.toString('base64');

              productsData.imageCoverData = imgCover;
            } catch (err) {
              res.status(400);
              res.json({
                status: 'fail',
                msg:
                  'Failed to read product cover image for product with id ' +
                  productId,
                error: err instanceof Error ? err.message : 'unknown error'
              });
              return;
            }

            items.push(productsData);
          }
          data.push(value);
          value.items = items;
        }
        res.json({ status: 'success', ordersCount: data.length, data: data });
        return;
      }

      res.json({
        status: 'success',
        ordersCount: 0,
        msg: 'No orders found',
        data: []
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'Failed to retrieve orders',
        error: err instanceof Error ? err.message : 'unknown error'
      });
      return;
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      //Note : req.body.userid=req.params.userid
      const orderbyuser: order[] | [] = await orderobject.show(req.body.userid);

      if (orderbyuser.length > 0) {
        const data: order[] = [];
        for (const order of orderbyuser) {
          const items: product[] = [];

          for (const productId of order.items) {
            const productINOrder: product | boolean = await productobject.show(
              productId as string
            );

            if (!productINOrder || typeof productINOrder === 'boolean') {
              res.status(404);
              res.json({
                status: 'fail',
                msg: `Product with id ${productId} not found`
              });
              return;
            }

            //const imagePath = path.join(
            //  __dirname,
            //'../uploads/products',

            // productINOrder.coverimage
            // );
            const imagePath = path.join(
              process.cwd(),
              'uploads',
              'products',
              productINOrder.coverimage
            );

            try {
              const imageData = await fs.promises.readFile(imagePath);

              const imgCover = imageData.toString('base64');

              productINOrder.imageCoverData = imgCover;
            } catch (err) {
              res.status(400);
              res.json({
                status: 'fail',
                msg:
                  'Failed to read product cover image for product with id ' +
                  productId,
                error: err instanceof Error ? err.message : 'unknown error'
              });
              return;
            }

            items.push(productINOrder);
          }
          order.items = items;
          data.push(order);
        }
        res.json({ status: 'success', ordersCount: data.length, data: data });
        return;
      }
      
      res.json({
        status: 'success',
        ordersCount: 0,
        msg: 'No orders found for this user',
        data: []
      });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'Failed to retrieve orders for the user',
        error: err instanceof Error ? err.message : 'unknown error'
      });
      return;
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted: boolean = await orderobject.deleteorder(
        parseInt(req.params.orderId)
      );
      if (deleted) {
        res.json({ status: 'success', msg: 'Order deleted successfully' });
        return;
      }
      res.status(404);
      res.json({ status: 'fail', msg: 'order not found' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to delete order' });
      return;
    }
  };

  updateorderstatus = async (req: Request, res: Response) => {
    try {
      const updated = await orderobject.updateorderstatus(
        parseInt(req.body.orderId),
        req.body.status
      );
      if (updated) {
        res.json({
          status: 'success',
          msg: 'Order status updated successfully'
        });
        return;
      }
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to update order status' });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'Failed to update order status',
        error: err
      });
      return;
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const orderquery: order = {
        userinfo: req.body.userinfo,
        user_id: parseInt(req.body.userid),
        address: req.body.address,
        // here we make the order accept an array of product ids , their quantities , and their colors and sizes if exist
        items: req.body.items,
        order_status: req.body.status,
        price: req.body.price
      };

      const neworder = await orderobject.create(orderquery);
      if (neworder) {
        res.json({
          status: 'success',
          msg: 'Order created successfully',
          data: neworder
        });
        return;
      }
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to create order' });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to create order' });
      return;
    }
  };

  addproductTOorder = async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.body.orderId);
      const productId = parseInt(req.body.productId);
      const quantity = parseInt(req.body.quantity);

      const orderProduct: orderproduct = {
        order_id: orderId,
        product_id: productId,
        quantity: quantity
        //color: req.body.color
        //size: req.body.size
      };

      const updatedOrder = await orderobject.addproductTOorder(orderProduct);
      if (updatedOrder) {
        res.json({
          status: 'success',
          msg: 'Product added to order successfully',
          data: updatedOrder
        });
        return;
      }
      res.status(400);
      res.json({ status: 'error', msg: 'Failed to add product to order' });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'Failed to add product to order'
      });
      return;
    }
  };
}
