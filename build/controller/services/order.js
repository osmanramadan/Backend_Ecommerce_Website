"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../model/services/order");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const product_1 = require("../../model/product");
const ordersservices = new order_1.Orderservices();
const productobject = new product_1.Product();
class OrderServicesController {
    constructor() {
        this.useractiveorders = async (req, res) => {
            try {
                const orders = await ordersservices.checkstatus(parseInt(req.params.userid), 'waiting');
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
                            const imagePath = path_1.default.join(__dirname, '../../uploads/products', productsData.coverimage);
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
                res.json({
                    status: 'success',
                    msg: 'No Orders Found',
                    ordersCount: 0,
                    data: []
                });
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
        this.usercompleteorders = async (req, res) => {
            try {
                const data = [];
                const orders = await ordersservices.checkstatus(parseInt(req.params.userid), 'complete');
                if (orders.length > 0) {
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
                            const imagePath = path_1.default.join(__dirname, '../../uploads/products', productsData.coverimage);
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
                }
                res.json({ status: 'success', ordersCount: data.length, data: data });
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
    }
}
exports.default = OrderServicesController;
