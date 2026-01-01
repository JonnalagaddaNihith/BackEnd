"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.getConnection = exports.executeQuery = exports.testConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rental_system_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
    },
};
let pool;
try {
    pool = promise_1.default.createPool(dbConfig);
    console.log('✅ MySQL connection pool created successfully');
}
catch (error) {
    console.error('❌ Error creating MySQL connection pool:', error);
    throw error;
}
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connection test successful');
        connection.release();
    }
    catch (error) {
        console.error('❌ Database connection test failed:', error);
        throw new Error('Failed to connect to database. Please check your database configuration.');
    }
};
exports.testConnection = testConnection;
const executeQuery = async (query, params) => {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    }
    catch (error) {
        console.error('❌ Query execution error:', error.message);
        console.error('Query:', query);
        console.error('Params:', params);
        throw new Error(`Database query failed: ${error.message}`);
    }
};
exports.executeQuery = executeQuery;
const getConnection = async () => {
    try {
        return await pool.getConnection();
    }
    catch (error) {
        console.error('❌ Failed to get database connection:', error.message);
        throw new Error('Failed to get database connection');
    }
};
exports.getConnection = getConnection;
const closePool = async () => {
    try {
        await pool.end();
        console.log('✅ Database connection pool closed');
    }
    catch (error) {
        console.error('❌ Error closing connection pool:', error.message);
        throw error;
    }
};
exports.closePool = closePool;
exports.default = pool;
