"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class SubCategory {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM productsubcat';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get category. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM productsubcat WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find category with ${id}. Error: ${err}`);
        }
    }
    async deletesubcategory(name) {
        try {
            const sql = 'delete FROM productsubcat WHERE name=($1)';
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
    async create(sc) {
        try {
            const sql = 'INSERT INTO productsubcat(name,productcat) VALUES ($1, $2) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [sc.name, sc.maincat]);
            conn.release();
            if (result.rowCount) {
                return result.rows[0];
            }
            return false;
        }
        catch (err) {
            throw new Error(`Could not add new subcategory`);
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
    async checksubcategoryexist(subcat) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM productsubcat WHERE name= $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [subcat]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.SubCategory = SubCategory;
