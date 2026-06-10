"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../model/product");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const productobject = new product_1.Product();
class Productcontroller {
    constructor() {
        this.index = async (_req, res) => {
            try {
                const allproducts = await productobject.index();
                if (allproducts.length > 0) {
                    const data = [];
                    for (const value of allproducts) {
                        // const imagePath = path.join(
                        // __dirname,
                        //'../uploads/products',
                        //value.coverimage
                        //);
                        // i update this code , to get path correctly on server such as (render) , if you work local above line will work , but uploads folder shouldnt be in the root of project but in src folder
                        const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', value.coverimage);
                        try {
                            const imageData = await fs_1.default.promises.readFile(imagePath);
                            const imgCover = { imageCoverData: imageData.toString('base64') };
                            const imagesData = [];
                            let rate = 0;
                            if (value.images && value.images.length > 0) {
                                for (const img of value.images) {
                                    // const imagePath = path.join(
                                    // __dirname,
                                    //'../uploads/products',
                                    //img
                                    //);
                                    const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', img);
                                    const imageData = await fs_1.default.promises.readFile(imagePath);
                                    imagesData.push(imageData.toString('base64'));
                                }
                            }
                            const imgsData = { imagesData: imagesData };
                            const stars = await productobject.getproductstars(value.id);
                            if (stars.sumstar && stars.numstar) {
                                rate = stars.sumstar / stars.numstar;
                            }
                            const rateProduct = { rate: rate };
                            data.push(Object.assign(Object.assign(Object.assign(Object.assign({}, value), rateProduct), imgsData), imgCover));
                        }
                        catch (err) {
                            const error = err;
                            res.status(400);
                            res.json({
                                status: 'fail',
                                msg: 'Failed to load image of product with id ' +
                                    value.id +
                                    ' or its rate',
                                error: error.message
                            });
                            return;
                        }
                    }
                    res.json({
                        status: 'success',
                        productsCount: data.length,
                        msg: 'Products loaded successfully',
                        data: data
                    });
                    return;
                }
                res.status(404);
                res.json({ status: 'success', data: [], msg: 'No products found' });
                return;
            }
            catch (e) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to load products' });
            }
        };
        this.show = async (req, res) => {
            try {
                const productbyid = await productobject.show(req.params.id);
                if (productbyid && typeof productbyid === 'object') {
                    const data = [];
                    // const imagePath = path.join(
                    // __dirname,
                    //'../uploads/products',
                    //productbyid.coverimage as string
                    //);
                    const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', productbyid.coverimage);
                    try {
                        const imageData = await fs_1.default.promises.readFile(imagePath);
                        const imgCover = { imageCoverData: imageData.toString('base64') };
                        const imagesData = [];
                        let rate = 0;
                        if (productbyid.images && productbyid.images.length > 0) {
                            for (const img of productbyid.images) {
                                // const imagePath = path.join(
                                // __dirname,
                                //'../uploads/products',
                                //img
                                //);
                                const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', img);
                                const imageData = await fs_1.default.promises.readFile(imagePath);
                                imagesData.push(imageData.toString('base64'));
                            }
                        }
                        const imgsData = { imagesData: imagesData };
                        const stars = await productobject.getproductstars(productbyid.id);
                        if (stars.sumstar && stars.numstar) {
                            rate = stars.sumstar / stars.numstar;
                        }
                        const rateProduct = { rate: rate };
                        data.push(Object.assign(Object.assign(Object.assign(Object.assign({}, productbyid), rateProduct), imgCover), imgsData));
                    }
                    catch (err) {
                        res.json({
                            status: 'fail',
                            msg: 'Failed to load image or stars for product ' + productbyid.ptitle
                        });
                        return;
                    }
                    res.json({ status: 'success', data: data[0] });
                    return;
                }
                res.status(404);
                res.json({
                    status: 'fail',
                    msg: 'No product found with id ' + req.params.id
                });
                return;
            }
            catch (e) {
                res.status(400);
                return res.json({
                    status: 'error',
                    msg: 'Failed to load product with id ' + req.params.id
                });
            }
        };
        this.newclothes = async (_req, res) => {
            try {
                const items = await productobject.newclothes('ملابس');
                if (items.length > 0) {
                    const data = [];
                    for (const value of items) {
                        //const imagePath = path.join(
                        //__dirname,
                        //'../uploads/products',
                        //value.coverimage
                        //);
                        const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', value.coverimage);
                        try {
                            const imageData = await fs_1.default.promises.readFile(imagePath);
                            const imgCover = { imageCoverData: imageData.toString('base64') };
                            const imagesData = [];
                            let rate = 0;
                            if (value.images && value.images.length > 0) {
                                for (const img of value.images) {
                                    // const imagePath = path.join(
                                    // __dirname,
                                    //'../uploads/products',
                                    //img
                                    //);
                                    const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', img);
                                    const imageData = await fs_1.default.promises.readFile(imagePath);
                                    imagesData.push(imageData.toString('base64'));
                                }
                            }
                            const imgsData = { imagesData: imagesData };
                            const stars = await productobject.getproductstars(value.id);
                            if (stars.sumstar && stars.numstar) {
                                rate = stars.sumstar / stars.numstar;
                            }
                            const rateProduct = { rate: rate };
                            data.push(Object.assign(Object.assign(Object.assign(Object.assign({}, value), rateProduct), imgCover), imgsData));
                        }
                        catch (err) {
                            res.status(400);
                            res.json({
                                status: 'fail',
                                msg: 'Failed to load image for product with id ' + value.id + 'or its rate'
                            });
                            return;
                        }
                    }
                    res.json({ status: 'success', productCount: data.length, data: data });
                    return;
                }
                res.status(404);
                res.json({ status: 'success', msg: 'No products found', data: [] });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to load products' });
                return;
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await productobject.deleteproduct(req.params.id);
                if (deleted) {
                    res.json({ status: 'success', msg: 'Product deleted successfully' });
                    return;
                }
                else {
                    res.status(404);
                    res.json({ status: 'fail', msg: 'product not found' });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to delete product' });
                return;
            }
        };
        this.update = async (req, res) => {
            try {
                let subcategory = [];
                if (req.body.subcategory) {
                    subcategory = req.body.subcategory.split(',');
                }
                const colors = req.body.colors.split(',');
                //🍳 There is a problem here if  user want to update field , he should provide all other fields .
                const data = {
                    id: req.body.productId,
                    ptitle: req.body.ptitle,
                    pdesc: req.body.pdesc,
                    price: req.body.price,
                    discount: req.body.discount,
                    priceafterdiscount: req.body.priceafterdiscount,
                    category: req.body.category,
                    subcategory: subcategory,
                    brand: req.body.brand,
                    colors: colors,
                    images: req.body.images,
                    coverimage: req.body.coverimage
                };
                const updated = await productobject.updateproduct(data);
                if (updated) {
                    res.json({ status: 'success', msg: 'Product updated successfully' });
                    return;
                }
                else {
                    res.status(400);
                    res.json({ status: 'fail', msg: 'Failed to update product fields in database' });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    msg: 'Error in updating product',
                    error: err instanceof Error ? err.message : 'unknown error'
                });
                return;
            }
        };
        this.create = async (req, res) => {
            try {
                let subcategory = [];
                if (req.body.subcategory) {
                    subcategory = req.body.subcategory.split(',');
                }
                const colors = req.body.colors.split(',');
                const data = {
                    ptitle: req.body.ptitle,
                    pdesc: req.body.pdesc,
                    price: req.body.price,
                    discount: req.body.discount,
                    priceafterdiscount: req.body.priceafterdiscount,
                    category: req.body.category,
                    subcategory: subcategory,
                    brand: req.body.brand,
                    colors: colors,
                    images: req.body.images,
                    coverimage: req.body.coverimage
                };
                const newproduct = await productobject.create(data);
                if (newproduct) {
                    res.json({
                        status: 'success',
                        message: 'Product created successfully',
                        data: newproduct
                    });
                    return;
                }
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to create product', error: 'unknown error' });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    msg: 'Failed to create product',
                    error: err instanceof Error ? err.message : 'unknown error'
                });
                return;
            }
        };
        this.createcomment = async (req, res) => {
            try {
                const comment = {
                    prodid: req.body.productId,
                    username: req.body.username,
                    text: req.body.text,
                    stars: req.body.stars
                };
                const newcomment = await productobject.addComment(comment);
                if (newcomment) {
                    res.json({
                        status: 'success',
                        msg: 'Comment added successfully',
                        data: newcomment
                    });
                    return;
                }
                else {
                    res.status(400);
                    res.json({ status: 'error', msg: 'Failed to add comment' });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to add comment' });
                return;
            }
        };
        this.getproductcomments = async (req, res) => {
            try {
                const comments = await productobject.showcomments(req.params.prodId);
                if (comments && Array.isArray(comments) && comments.length > 0) {
                    res.json({
                        status: 'success',
                        productCommentsCount: comments.length,
                        msg: 'Comments retrieved successfully',
                        data: comments
                    });
                    return;
                }
                else {
                    res.status(404);
                    res.json({
                        status: 'fail',
                        productCommentsCount: 0,
                        msg: 'Comments not found for the product',
                        data: []
                    });
                    return;
                }
            }
            catch (e) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to get comments of product' });
                return;
            }
        };
        this.getproductstars = async (req, res) => {
            try {
                const proStars = await productobject.getproductstars(req.params.prodId);
                if (proStars.numstar && proStars.sumstar) {
                    res.json({
                        status: 'success',
                        msg: 'Stars retrieved successfully',
                        data: proStars,
                        rate: proStars.sumstar / proStars.numstar
                    });
                    return;
                }
                else {
                    res.status(404);
                    res.json({ status: 'No stars', msg: 'No stars found for the product' });
                    return;
                }
            }
            catch (e) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to get stars of product' });
                return;
            }
        };
    }
}
exports.default = Productcontroller;
