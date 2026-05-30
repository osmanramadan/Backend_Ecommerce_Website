import pool from '../database_connection/db';
import { category } from '../types/category';

export class Category {
  async index(): Promise<category[]> {
    try {
      const conn = await pool.connect();

      const sql = 'SELECT * FROM productcat';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get category. Error: ${(err as Error).message}`
      );
    }
  }

  async show(id: string): Promise<category> {
    try {
      const sql = 'SELECT * FROM productcat WHERE id=($1)';

      const conn = await pool.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find category with ${id}. Error: ${err}`);
    }
  }

  async deletecategory(name: string): Promise<boolean> {
    try {
      const sql = 'delete FROM productcat WHERE catname=($1)';

      const conn = await pool.connect();

      const result = await conn.query(sql, [name]);
      conn.release();
      if (result.rowCount) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(`Could not delete category with ${name}. Error: ${err}`);
    }
  }

  async create(c: category): Promise<category | boolean> {
    try {
      const sql =
        'INSERT INTO productcat(catname,image) VALUES ($1, $2) RETURNING *';

      const conn = await pool.connect();
      const result = await conn.query(sql, [c.name, c.image]);
      conn.release();
      if (result.rowCount) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      throw new Error(`Could not add new category`);
    }
  }

  async checkcategoryexist(cat: string): Promise<boolean> {
    try {
      const sql = 'SELECT EXISTS(SELECT 1 FROM productcat WHERE catname = $1)';
      const conn = await pool.connect();

      const result = await conn.query(sql, [cat]);
      conn.release();

      return result.rows[0].exists;
    } catch (err) {
      throw new Error(` Error: ${err}`);
    }
  }
}
