// libs
import dotenv from "dotenv";
// load environment variables from .env file
dotenv.config();
import express, { Application } from "express";
import http from "http";
import bodyParser from "body-parser";

// middlewares
import errorHandleMiddleware from "./middlewares/error-handler.middlerware";

// routes
import routes from "./routes";
import databaseConnectionHandler from "./database/db";
import { pool } from "./database/connection-pool";

// create express app
const app: Application = express();

// set port, default is 3000
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount all application routes under the /api/v1 prefix
app.use("/api/v1", routes);

// error handling middleware
app.use(errorHandleMiddleware);

// create a server from app
const server = http.createServer(app);

// start server
server.listen(port, async () => {
    // test database connection
    await databaseConnectionHandler();

    console.log(`Server is running on http://localhost:${port}`);
});
