"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Coupon {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM  discountcoupon';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get coupons. Error: ${err}`);
        }
    }
    async show(name) {
        try {
            const sql = 'SELECT * FROM discountcoupon  WHERE name=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [name]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async deletecoupon(id) {
        try {
            const sql = 'delete FROM  discountcoupon WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            throw new Error(`Could not delete coupon with ${id}. Error: ${err}`);
        }
    }
    async create(c) {
        try {
            const sql = 'INSERT INTO  discountcoupon (name,discount,expire) VALUES ($1,$2,$3) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [c.name, c.discount, c.expire]);
            const coupon = result.rows[0];
            conn.release();
            return coupon;
        }
        catch (err) {
            throw new Error(`Could not add new coupon`);
        }
    }
    async checkcouponexistbyname(name) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM  discountcoupon WHERE name = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [name]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async checkcouponexistbyid(id) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM  discountcoupon WHERE id = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async updatecoupon(c) {
        try {
            const sql = 'update discountcoupon set name=($1), discount=($2), expire=($3)  where id=($4)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                c.name,
                c.discount,
                c.expire,
                c.id
            ]);
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
}
exports.Coupon = Coupon;
