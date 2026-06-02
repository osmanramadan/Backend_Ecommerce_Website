import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  DEV_POSTGRES_DB,
  TEST_POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  NODE_ENV
} = process.env;

const database = NODE_ENV === 'test' ? TEST_POSTGRES_DB : DEV_POSTGRES_DB;

const pool = new Pool({
  host: POSTGRES_HOST,
  database,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: 5432,
  ssl: {  // this for productions part deploy on render
    rejectUnauthorized: false
  }
});

export default pool;
