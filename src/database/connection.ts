import { createConnection } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

/**
 * Create and return a MySQL database connection
 * @returns A promise that resolves with a MySQL database connection
 */
export const createDatabaseConnection = async (): Promise<Connection> =>
    createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: parseInt(process.env.DATABASE_PORT || "3006"),
    });

/**
 * Execute a database query and return a promise with the results
 * @template T The type of the results returned by the query
 * @template V The type of the values passed to the query
 * @param query The SQL query to execute
 * @param values The values to pass to the query
 * @returns A promise that resolves with the results of the query
 */
export const queryPromise = async <T, V>(query: string, values?: V): Promise<T> => {
    const connection = await createDatabaseConnection();
    connection.connect();

    return new Promise<T>((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                connection.destroy();
                return reject(error);
            }

            connection.destroy();
            return resolve(results as T);
        });
    });
};

/**
 * Create and return a MySQL database connection with an active transaction
 * @returns A promise that resolves with a MySQL database connection with an active transaction
 */
export const createTransactionConnection = async (): Promise<Connection> => {
    const transaction = await createDatabaseConnection();
    transaction.connect();

    return new Promise<Connection>((resolve, reject) => {
        transaction.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }
            return resolve(transaction);
        });
    });
};

/**
 * Execute a database query within a transaction and return a promise with the results
 * @param transaction The MySQL database connection with an active transaction
 * @template T The type of the results returned by the query
 * @template V The type of the values passed to the query
 * @param query The SQL query to execute
 * @param values The values to pass to the query
 * @returns A promise that resolves with the results of the query
 */
export const transactionQueryPromise = async <T, V>(transaction: Connection, query: string, values?: V): Promise<T> =>
    new Promise<T>((resolve, reject) => {
        transaction.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }

            return resolve(results as T);
        });
    });

/**
 * Commit a MySQL database transaction and destroy the connection
 * @param transaction The MySQL database connection with an active transaction
 * @returns A promise that resolves when the transaction is committed
 */
export const commitTransaction = async (transaction: Connection): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        transaction.commit((err) => {
            if (err) {
                return transaction.rollback(() => {
                    transaction.destroy();

                    reject(err);
                });
            }
            transaction.destroy();
            return resolve();
        });
    });

/**
 * Rollback a MySQL database transaction and destroy the connection
 * @param transaction The MySQL database connection with an active transaction
 * @returns A promise that resolves when the transaction is rolled back
 */
export const rollbackTransaction = async (transaction: Connection): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        transaction.rollback((error) => {
            transaction.destroy();
            // if (error) {
            //     return reject(error);
            // }
            return resolve();
        });
    });

/**
 * End a MySQL database transaction by destroying the connection
 * @param transaction The MySQL database connection with an active transaction
 * @returns A promise that resolves when the transaction is ended
 */
export const endTransaction = async (transaction: Connection): Promise<void> =>
    new Promise<void>((resolve) => {
        transaction.destroy();
        return resolve();
    });
