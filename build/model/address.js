"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const db_1 = __importDefault(require("../database_connection/db"));
class Address {
    async adduseraddress(email, addrtitle, addrdetails, phone) {
        try {
            const sql = 'insert into user_address (addremail,addrtitle,addrdetails,phone) values($1,$2,$3,$4)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                email,
                addrtitle,
                addrdetails,
                phone
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
    async viewuseraddress(email) {
        try {
            const sql = 'SELECT * from user_address where addremail=$1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [email]);
            conn.release();
            if (result.rowCount) {
                return result.rows;
            }
            return false;
        }
        catch (err) {
            throw new Error(`${err}`);
        }
    }
    async deleteuseraddress(addressId) {
        try {
            const sql = 'delete  from user_address where id=$1';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [addressId]);
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
    async updateuseraddress(addrtitle, addrdetails, phone, addressId) {
        try {
            const sql = 'update user_address set addrtitle =($1), addrdetails=($2), phone=($3)  where id=($4)';
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [
                addrtitle,
                addrdetails,
                phone,
                addressId
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
exports.Address = Address;
