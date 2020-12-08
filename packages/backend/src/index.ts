import {createDatabaseConnection} from "./util/createDatabaseConnection";
import * as bodyParser from 'body-parser'
import express from 'express';
import {globalRouter} from "./router/global.router";

require('dotenv-safe').config();
// get Port number
const PORT: number = Number(process.env.PORT);
// call a express api
const app = express();
/**
 * start the Server and build a connect to DB, listen to the defined PORT and handle transactions
 */
export const startServer = async () => {
    try {
        const server = app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
        const dbConnection = await createDatabaseConnection();
        app.use(bodyParser.json());
        app.use('/api', globalRouter);
        return {server, dbConnection};
    } catch (e) {
        console.log(e);
        throw e;
    }
}

startServer();