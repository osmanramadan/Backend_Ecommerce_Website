"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Userservices = void 0;
const db_1 = __importDefault(require("../../database_connection/db"));
class Userservices {
    async userpurchases(userid) {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT ptitle , pdesc , price , discount , priceafterdiscount , category , brand , coverimage FROM products WHERE id IN ( SELECT product_id FROM "orders" INNER JOIN order_product   ON "orders".id = order_product.order_id WHERE "orders".user_id = $1 AND "orders".order_status = \'complete\')';
            const result = await conn.query(sql, [userid]);
            const purchases = result.rows;
            conn.release();
            return purchases;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.Userservices = Userservices;
