import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DbConfig } from '../Models/Database';

dotenv.config();

const dbConfig: DbConfig = {
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

let pool: mysql.Pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ MySQL connection pool created successfully');
} catch (error) {
  console.error('❌ Error creating MySQL connection pool:', error);
  throw error;
}


export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection test successful');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    throw new Error('Failed to connect to database. Please check your database configuration.');
  }
};

export const executeQuery = async <T = any>(
  query: string,
  params?: any[]
): Promise<T> => {
  try {
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error: any) {
    console.error('❌ Query execution error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw new Error(`Database query failed: ${error.message}`);
  }
};

export const getConnection = async (): Promise<mysql.PoolConnection> => {
  try {
    return await pool.getConnection();
  } catch (error: any) {
    console.error('❌ Failed to get database connection:', error.message);
    throw new Error('Failed to get database connection');
  }
};

export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error: any) {
    console.error('❌ Error closing connection pool:', error.message);
    throw error;
  }
};

export default pool;
