import "dotenv/config";
import http from "http";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import router from "./router/user.router";
import {signalHandler} from "./utils/utils";
import {connectDataBase} from "./db/connection.db";

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(cors({credentials: true}));

const port = process.env.PORT || 80;
const server = http.createServer(app);
const dbUri = process.env.DB as string;

app.use("/", router);
connectDataBase(dbUri);
server.listen(port, () =>
{
    console.log(`Server listing at http://localhost:${port}`);
});

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);