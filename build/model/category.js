"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Category {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM productcat';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get category. Error: ${err.message}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM productcat WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find category with ${id}. Error: ${err}`);
        }
    }
    async deletecategory(name) {
        try {
            const sql = 'delete FROM productcat WHERE catname=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [name]);
            conn.release();
            if (result.rowCount) {
                return true;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not delete category with ${name}. Error: ${err}`);
        }
    }
    async create(c) {
        try {
            const sql = 'INSERT INTO productcat(catname,image) VALUES ($1, $2) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [c.name, c.image]);
            conn.release();
            if (result.rowCount) {
                return result.rows[0];
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not add new category`);
        }
    }
    async checkcategoryexist(cat) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM productcat WHERE catname = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [cat]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.Category = Category;
