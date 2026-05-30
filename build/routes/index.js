"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./api/user"));
const product_1 = __importDefault(require("./api/product"));
const order_1 = __importDefault(require("./api/order"));
const address_1 = __importDefault(require("./api/address"));
const mark_1 = __importDefault(require("./api/mark"));
const category_1 = __importDefault(require("./api/category"));
const subcategory_1 = __importDefault(require("./api/subcategory"));
const coupon_1 = __importDefault(require("./api/coupon"));
const routes = express_1.default.Router();
routes.use('/api/v1/users', user_1.default);
routes.use('/api/v1/orders', order_1.default);
routes.use('/api/v1/products', product_1.default);
routes.use('/api/v1/addresses', address_1.default);
routes.use('/api/v1/brand', mark_1.default);
routes.use('/api/v1/category', category_1.default);
routes.use('/api/v1/subcategory', subcategory_1.default);
routes.use('/api/v1/coupon', coupon_1.default);
routes.get('/', (_req, res) => {
    res.status(200);
    res.send('this main page of routes');
});
exports.default = routes;
