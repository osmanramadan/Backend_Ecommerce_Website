"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productservices = void 0;
const db_1 = __importDefault(require("../../database_connection/db"));
class Productservices {
    async productCate(cate) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const result = await conn.query(sql, [cate]);
            const products = result.rows;
            conn.release();
            return products;
        }
        catch (err) {
            throw new Error(`can't get products. Error: ${err}`);
        }
    }
    async mostpopular() {
        try {
            const conn = await db_1.default.connect();
            const sql = `SELECT products.id,count(order_product.product_id) as ordered_num,products.ptitle, products.pdesc , products.price ,products.discount,products.priceafterdiscount , products.brand,
        products.category,products.subcategory,products.coverimage,products.colors
        FROM order_product INNER JOIN products on order_product.product_id=products.id group by products.id,products.ptitle,products.priceafterdiscount,products.price,products.discount, products.pdesc,products.brand,products.category,products.subcategory,products.coverimage,products.colors order by count(order_product.product_id)  desc limit 5`;
            const result = await conn.query(sql);
            const products = result.rows;
            conn.release();
            return products;
        }
        catch (err) {
            console.error(err);
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.Productservices = Productservices;
