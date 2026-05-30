import pool from '../../database_connection/db';
import { product } from '../../types/product';

export class Userservices {
  async userpurchases(userid: string): Promise<product[]> {
    try {
      const conn = await pool.connect();
      const sql =
        'SELECT ptitle , pdesc , price , discount , priceafterdiscount , category , brand , coverimage FROM products WHERE id IN ( SELECT product_id FROM "orders" INNER JOIN order_product   ON "orders".id = order_product.order_id WHERE "orders".user_id = $1 AND "orders".order_status = \'complete\')';
      const result = await conn.query(sql, [userid]);
      const purchases = result.rows;
      conn.release();

      return purchases;
    } catch (err) {
      throw new Error(` Error: ${err}`);
    }
  }
}
