"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Order {
    async index() {
        try {
            const sql = 'SELECT * FROM  orders';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql);
            const orders = result.rows;
            conn.release();
            return orders;
        }
        catch (err) {
            throw new Error(`Could not find orders Error: ${err}`);
        }
    }
    async show(userid) {
        try {
            const sql = 'SELECT * FROM  orders WHERE user_id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [userid]);
            const orders = result.rows;
            conn.release();
            return orders;
        }
        catch (err) {
            throw new Error(`Could not find order with ${userid}. Error: ${err}`);
        }
    }
    async checkorderexist(orderId) {
        try {
            const sql = 'SELECT * FROM  orders WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [orderId]);
            const orders = result.rows;
            conn.release();
            if (orders.length) {
                return true;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not check order existence for order ${orderId}. Error: ${err}`);
        }
    }
    async create(o) {
        try {
            const sql = 'INSERT INTO orders (userinfo, address, items, user_id, order_status,price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                o.userinfo,
                o.address,
                o.items,
                o.user_id,
                o.order_status,
                o.price
            ]);
            const orders = result.rows;
            conn.release();
            if (result.rowCount) {
                return orders[0];
            }
            return false;
        }
        catch (err) {
            throw new Error(`can't add new order`);
        }
    }
    async deleteorder(id) {
        try {
            const sql = 'delete FROM orders WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            throw new Error(`Could not delete order with ${id}. Error: ${err}`);
        }
    }
    async updateorderstatus(id, newstatus) {
        try {
            const sql = 'UPDATE orders SET order_status=($1) WHERE id=($2) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [newstatus, id]);
            conn.release();
            if (result.rowCount) {
                return true;
            }
            return false;
        }
        catch (err) {
            throw new Error(`${err}`);
        }
    }
    async addproductTOorder(orderProduct) {
        try {
            const sql = 'INSERT INTO order_product (order_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                orderProduct.order_id,
                orderProduct.product_id,
                orderProduct.quantity
            ]);
            conn.release();
            if (result.rowCount) {
                return result.rows[0];
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not add product to order. Error: ${err}`);
        }
    }
}
exports.Order = Order;
