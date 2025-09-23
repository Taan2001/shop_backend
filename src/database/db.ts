// database
import { createDatabaseConnection } from "./connection";

// utils
import logger from "../utils/logger";

const databaseConnectionHandler = async () => {
    // create request id
    const connectionId = Date.now().toString();
    const connectionRoute = "/database-connection-test";

    try {
        logger.request(connectionId, connectionRoute, "Connecting to database...");

        const databaseConnection = await createDatabaseConnection();

        databaseConnection.connect((error) => {
            if (error) {
                logger.newError(connectionId, connectionRoute, error);
                throw error;
            }
            logger.response(connectionId, connectionRoute, "Database connected successfully!!!");
            databaseConnection.destroy();
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.newError(connectionId, connectionRoute, error);
    }
};

export default databaseConnectionHandler;
