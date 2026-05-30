import pool from '../database_connection/db';
import { address } from '../types/address';

export class Address {
  async adduseraddress(
    email: string,
    addrtitle: string,
    addrdetails: string,
    phone: string
  ): Promise<boolean> {
    try {
      const sql =
        'insert into user_address (addremail,addrtitle,addrdetails,phone) values($1,$2,$3,$4)';

      const conn = await pool.connect();
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
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async viewuseraddress(email: string): Promise<address[] | boolean> {
    try {
      const sql = 'SELECT * from user_address where addremail=$1';

      const conn = await pool.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rowCount) {
        return result.rows;
      }
      return false;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async deleteuseraddress(addressId: string): Promise<boolean> {
    try {
      const sql = 'delete  from user_address where id=$1';
      const conn = await pool.connect();
      const result = await conn.query(sql, [addressId]);
      conn.release();
      if (result.rowCount) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }

  async updateuseraddress(
    addrtitle: string,
    addrdetails: string,
    phone: string,
    addressId: string
  ): Promise<boolean> {
    try {
      const sql =
        'update user_address set addrtitle =($1), addrdetails=($2), phone=($3)  where id=($4)';
      const conn = await pool.connect();
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
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
