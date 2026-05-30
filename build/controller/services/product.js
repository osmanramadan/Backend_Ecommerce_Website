"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../model/services/product");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const productservices = new product_1.Productservices();
class ProductServicesController {
    constructor() {
        this.getproductsbycate = async (req, res) => {
            try {
                const products = await productservices.productCate(req.params.cate);
                if (products.length > 0) {
                    const data = [];
                    for (const value of products) {
                        const imagePath = path_1.default.join(__dirname, '../../uploads/products', value.coverimage);
                        try {
                            const imageData = await fs_1.default.promises.readFile(imagePath);
                            value.imageCoverData = imageData.toString('base64');
                        }
                        catch (err) {
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
            }
            catch (e) {
                res.status(400).json({
                    status: 'fail',
                    error: e
                });
            }
        };
        this.mostpopular = async (_req, res) => {
            try {
                const products = await productservices.mostpopular();
                if (products.length > 0) {
                    const data = [];
                    for (const value of products) {
                        const imagePath = path_1.default.join(__dirname, '../../uploads/products', value.coverimage);
                        try {
                            const imageData = await fs_1.default.promises.readFile(imagePath);
                            const imgCover = imageData.toString('base64');
                            value.imageCoverData = imgCover;
                        }
                        catch (err) {
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
            }
            catch (e) {
                res.status(400);
                res.json({ status: 'fail' });
                return;
            }
        };
    }
}
exports.default = ProductServicesController;
