// libs
import express, { Application } from "express";
import http from "http";
import bodyParser from "body-parser";

// routes
import { authRouter } from "./routes";

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", authRouter);

// create a server from app
const server = http.createServer(app);

// start server
server.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});
