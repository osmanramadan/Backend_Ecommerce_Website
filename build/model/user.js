"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
const bcrypt_1 = __importDefault(require("../authentication/bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cipher = new bcrypt_1.default();
class User {
    async index() {
        try {
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find user with ${id}. Error: ${err}`);
        }
    }
    async deleteuser(id) {
        try {
            const sql = 'DELETE FROM users WHERE id = $1 RETURNING id';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            // if no rows deleted
            if (result.rows.length === 0) {
                return false;
            }
            return true;
        }
        catch (err) {
            throw new Error(`Could not delete user with ${id}. Error: ${err}`);
        }
    }
    async getuserbycredentials(email, password) {
        try {
            const sql = 'SELECT * FROM users WHERE email=($1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            if (result.rows.length) {
                const userdata = result.rows[0];
                if (await cipher.decrypt(userdata.password, password)) {
                    return userdata;
                }
            }
            return null;
        }
        catch (err) {
            throw new Error(` Error: ${err}`);
        }
    }
    async getuserbyemail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = $1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            if (result.rows.length) {
                const userdata = result.rows[0];
                return userdata;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }
    async getuserbyphone(phone) {
        try {
            const sql = 'SELECT * FROM users WHERE phone = $1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [phone]);
            conn.release();
            if (result.rows.length) {
                const userdata = result.rows[0];
                return userdata;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Error: ${err}`);
        }
    }
    async create(u) {
        try {
            const sql = 'INSERT INTO users (email,username,password,phone) VALUES ($1, $2, $3,$4) RETURNING *';
            const conn = await db_1.default.connect();
            const hash = await cipher.encrypt(u.password);
            const result = await conn.query(sql, [
                u.email,
                u.username,
                hash,
                u.phone
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new User`);
        }
    }
    async emailExists(email) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            console.log(err);
            throw new Error(`Error while checking if email exists. Error: ${err}`);
        }
    }
    async phoneExists(phone) {
        try {
            const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE phone = $1)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [phone]);
            conn.release();
            return result.rows[0].exists;
        }
        catch (err) {
            throw new Error(`Error while checking if phone exists. Error: ${err}`);
        }
    }
    async updateUserFields(data) {
        const { email } = data, fieldsToUpdate = __rest(data, ["email"]);
        const updateColumns = Object.keys(fieldsToUpdate);
        const updateValues = Object.values(fieldsToUpdate);
        if (updateColumns.length === 0) {
            throw new Error('No fields to update provided.');
        }
        try {
            const updateSetClauses = updateColumns
                .map((column, index) => `${column} = $${index + 2}`)
                .join(', ');
            const sql = `UPDATE users SET ${updateSetClauses} WHERE email = $1`;
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email, ...updateValues]);
            conn.release();
            return result.rowCount === 1;
        }
        catch (err) {
            throw new Error(`Error while updating user fields. Error: ${err}`);
        }
    }
    async checkResetCode(email, resetCode) {
        try {
            const sql_valid = 'SELECT from users where email=$1 and passwordResetCode=$2';
            const sql_expire = 'SELECT from users where email=$1 and passwordResetCode=$2 and passwordResetExpires > Now()';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql_valid, [email, resetCode]);
            conn.release();
            if (result.rowCount === 1) {
                const result_time = await conn.query(sql_expire, [email, resetCode]);
                if (result_time.rowCount === 1) {
                    return 'valid code';
                }
                else {
                    return 'expired code';
                }
            }
            else {
                return 'invalid code';
            }
        }
        catch (err) {
            throw new Error(`Error : ${err}`);
        }
    }
    async checkVerifyCode(email) {
        try {
            const sql = 'SELECT resetCodeVerified from users where email=$1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            return result.rows[0].resetcodeverified === 'true';
        }
        catch (err) {
            throw new Error(`Error : ${err}`);
        }
    }
    async updateuserpassword(email, oldpassword, newpassword) {
        try {
            const sql = 'SELECT password from users where email=$1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            if (result.rowCount) {
                if (await cipher.decrypt(result.rows[0]['password'], oldpassword)) {
                    const hash = await cipher.encrypt(newpassword);
                    if (await this.updateUserFields({ email: email, password: hash })) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        }
        catch (err) {
            throw new Error(`Error : ${err}`);
        }
    }
}
exports.User = User;
