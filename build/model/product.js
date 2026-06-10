"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Product {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            if (result.rowCount) {
                return result.rows;
            }
            return [];
        }
        catch (err) {
            throw new Error(`Could not get products  Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) {
                return result.rows[0];
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not find product with ${id}. Error: ${err}`);
        }
    }
    async deleteproduct(id) {
        try {
            const sql = 'delete FROM products WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            throw new Error(`Could not delete product with ${id}. Error: ${err}`);
        }
    }
    async updateproduct(p) {
        try {
            const sql = `UPDATE products SET ptitle=($2),pdesc=($3),price=($4),discount=($5),priceafterdiscount=($6),category=($7),subcategory=($8),brand=($9),colors=($10),images=($11),coverimage=($12) WHERE id=($1)`;
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                p.id,
                p.ptitle,
                p.pdesc,
                p.price,
                p.discount,
                p.priceafterdiscount,
                p.category,
                p.subcategory,
                p.brand,
                p.colors,
                p.images,
                p.coverimage
            ]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            throw new Error(`Could not update product with ${p.id}. Error: ${err}`);
        }
    }
    async create(p) {
        try {
            const sql = 'INSERT INTO products (ptitle,pdesc,price,discount,priceafterdiscount,category,subcategory,brand,colors,images,coverimage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                p.ptitle,
                p.pdesc,
                p.price,
                p.discount,
                p.priceafterdiscount,
                p.category,
                p.subcategory,
                p.brand,
                p.colors,
                p.images,
                p.coverimage
            ]);
            const users = result.rows[0];
            conn.release();
            return users;
        }
        catch (err) {
            throw new Error(`Could not add new product: ${err}`);
        }
    }
    async addComment(c) {
        try {
            const sql = 'INSERT INTO productcomment (text,username,stars,prodid) VALUES ($1, $2,$3,$4) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                c.text,
                c.username,
                c.stars,
                c.prodid
            ]);
            const comment = result.rows[0];
            conn.release();
            return comment;
        }
        catch (err) {
            throw new Error(`Could not add new mark`);
        }
    }
    async showcomments(id) {
        try {
            const sql = 'SELECT * FROM productcomment WHERE prodid =$1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) {
                return result.rows;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not find product with ${id}. Error: ${err}`);
        }
    }
    async newclothes(cat) {
        try {
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [cat]);
            conn.release();
            if (result.rowCount) {
                return result.rows;
            }
            return [];
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async getproductstars(id) {
        try {
            const sql = 'select sum(stars) as sumstar,count(stars) as numstar from productcomment where prodid=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) {
                return result.rows[0];
            }
            return { sumstar: 0, numstar: 0 };
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async checkproductexist(ptitle) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM products WHERE ptitle = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [ptitle]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.Product = Product;
