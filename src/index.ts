// libs
import express, { Application } from "express";
import http from "http";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// middlewares
import ErrorHandleMiddleware from "./middlewares/error-handle.middlerware";

// routes
import { authRouter } from "./routes";
import databaseConnectionHandler from "./database/db";

// create express app
const app: Application = express();

// load environment variables from .env file
dotenv.config();

// set port, default is 3000
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", authRouter);

// error handling middleware
app.use(ErrorHandleMiddleware);

// create a server from app
const server = http.createServer(app);

// start server
server.listen(port, async () => {
    // test database connection
    await databaseConnectionHandler();

    console.log(`Server is running on http://localhost:${port}`);
});
