// libs
import dotenv from "dotenv";
dotenv.config();
import { createPool, PoolConnection } from "mysql2";

/**
 * Create a MySQL connection pool
 */
export const pool = createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10, // maximum number of connections in the pool
    queueLimit: 0, // 0 = unlimited
});

/**
 * Execute a database query using the connection pool
 * @param query The SQL query to execute
 * @param values The values to pass to the query
 * @returns A promise that resolves with the results of the query
 */
export const queryPromise = async <R, V>(query: string, values?: V): Promise<R[]> =>
    new Promise<R[]>((resolve, reject) => {
        pool.query(query, values, (err, results) => {
            if (err) return reject(err);
            resolve(results as R[]);
        });
    });

/**
 * Create transaction connection from pool
 * @returns PoolConnection trong transaction
 */
export const createTransactionConnection = async (): Promise<PoolConnection> =>
    new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err);

            connection.beginTransaction((txErr) => {
                if (txErr) {
                    connection.release();
                    return reject(txErr);
                }
                resolve(connection);
            });
        });
    });

/**
 * Execute a database query within a transaction and return a promise with the results
 * @param transaction The MySQL database connection pool with an active transaction
 * @param query The SQL query to execute
 * @param values The values to pass to the query
 * @returns A promise that resolves with the results of the query
 */
export const transactionQueryPromise = async <R, V>(transaction: PoolConnection, query: string, values?: V): Promise<R[]> =>
    new Promise<R[]>((resolve, reject) => {
        transaction.query(query, values, (err, results) => {
            if (err) return reject(err);
            resolve(results as R[]);
        });
    });

/**
 * Commit a MySQL database transaction and release the connection back to the pool
 * @param transaction The MySQL database connection pool with an active transaction
 * @returns A promise that resolves when the transaction is committed
 */
export const commitTransaction = async (transaction: PoolConnection): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        transaction.commit((err) => {
            if (err) {
                return transaction.rollback(() => {
                    transaction.release();
                    reject(err);
                });
            }
            transaction.release();
            resolve();
        });
    });

/**
 * Rollback a MySQL database transaction and release the connection back to the pool
 * @param transaction The MySQL database connection pool with an active transaction
 * @returns A promise that resolves when the transaction is rolled back
 */
export const rollbackTransaction = async (transaction: PoolConnection): Promise<void> =>
    new Promise<void>((resolve) => {
        transaction.rollback(() => {
            transaction.release();
            resolve();
        });
    });

/**
 * Release a MySQL database transaction by releasing the connection back to the pool
 * @param transaction The MySQL database connection pool with an active transaction
 * @returns A promise that resolves when the transaction is released
 */
export const releaseTransaction = async (transaction: PoolConnection): Promise<void> =>
    new Promise<void>((resolve) => {
        transaction.release();
        resolve();
    });
