"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, DEV_POSTGRES_DB, TEST_POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, NODE_ENV } = process.env;
const database = NODE_ENV === 'test' ? TEST_POSTGRES_DB : DEV_POSTGRES_DB;
const pool = new pg_1.Pool({
    host: POSTGRES_HOST,
    database,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: 5432
});
exports.default = pool;
