"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../model/order");
const product_1 = require("../model/product");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const orderobject = new order_1.Order();
const productobject = new product_1.Product();
class Ordercontroller {
    constructor() {
        this.index = async (_req, res) => {
            try {
                const orders = await orderobject.index();
                if (orders.length > 0) {
                    const data = [];
                    for (const value of orders) {
                        const items = [];
                        for (const productId of value.items) {
                            const productsData = await productobject.show(productId);
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
                            const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', productsData.coverimage);
                            console.log(imagePath, '-----===========**&&&&&&&&&&&=========---------------');
                            try {
                                const imageData = await fs_1.default.promises.readFile(imagePath);
                                const imgCover = imageData.toString('base64');
                                productsData.imageCoverData = imgCover;
                            }
                            catch (err) {
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
                res.json({ status: 'success', data: [], msg: 'No orders found' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'fail',
                    msg: 'Failed to retrieve orders',
                    error: err
                });
                return;
            }
        };
        this.show = async (req, res) => {
            try {
                const orderbyuser = await orderobject.show(req.body.userid);
                if (orderbyuser.length > 0) {
                    const data = [];
                    for (const order of orderbyuser) {
                        const items = [];
                        for (const productId of order.items) {
                            const productINOrder = await productobject.show(productId);
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
                            const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', productINOrder.coverimage);
                            try {
                                const imageData = await fs_1.default.promises.readFile(imagePath);
                                const imgCover = imageData.toString('base64');
                                productINOrder.imageCoverData = imgCover;
                            }
                            catch (err) {
                                res.json({
                                    status: 'fail',
                                    msg: 'Failed to read product image',
                                    error: err
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
                res.status(404);
                res.json({
                    status: 'success',
                    data: [],
                    msg: 'No orders found for this user'
                });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'fail',
                    msg: 'Failed to retrieve orders for the user',
                    error: err
                });
                return;
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await orderobject.deleteorder(parseInt(req.params.orderId));
                if (deleted) {
                    res.json({ status: 'success', msg: 'Order deleted successfully' });
                    return;
                }
                res.status(400);
                res.json({ status: 'fail', msg: 'Failed to delete order' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'fail', msg: 'Failed to delete order', error: err });
                return;
            }
        };
        this.updateorderstatus = async (req, res) => {
            try {
                const updated = await orderobject.updateorderstatus(parseInt(req.body.orderId), req.body.status);
                if (updated) {
                    res.json({
                        status: 'success',
                        msg: 'Order status updated successfully'
                    });
                    return;
                }
                res.status(400);
                res.json({ status: 'fail', msg: 'Failed to update order status' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'fail',
                    msg: 'Failed to update order status',
                    error: err
                });
                return;
            }
        };
        this.create = async (req, res) => {
            try {
                const orderquery = {
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
                res.json({ status: 'fail', msg: 'Order not created' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'fail', msg: 'Order not created', error: err });
                return;
            }
        };
        this.addproductTOorder = async (req, res) => {
            try {
                const orderId = parseInt(req.body.orderId);
                const productId = parseInt(req.body.productId);
                const quantity = parseInt(req.body.quantity);
                const orderProduct = {
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
                res.json({ status: 'fail', msg: 'Failed to add product to order' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'fail',
                    msg: 'Failed to add product to order',
                    error: err
                });
                return;
            }
        };
    }
}
exports.default = Ordercontroller;
