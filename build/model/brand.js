"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mark = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Mark {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM productmark';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get marks. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM productmark WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find mark with ${id}. Error: ${err}`);
        }
    }
    async deletemark(name) {
        try {
            const sql = 'delete FROM productmark WHERE name=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [name]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }
    async create(m) {
        try {
            const sql = 'INSERT INTO productmark (name,image) VALUES ($1, $2) RETURNING *';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [m.name, m.image]);
            const marks = result.rows[0];
            conn.release();
            return marks;
        }
        catch (err) {
            throw new Error(`Could not add new mark`);
        }
    }
    async checkbrandexist(brand) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM productmark WHERE name = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [brand]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
}
exports.Mark = Mark;
