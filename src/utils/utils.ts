import http from "http";
import {disconnectDataBase} from "../db/connection.db";
/******************************************************************************
 * @description Cleans up and gracefully exits the application.
******************************************************************************/
function cleanUp()
{
    console.log("Closing server.");
    process.exit(0);
}
/******************************************************************************
 * @description Handles signals to gracefully shut down the server and disconnect from the database.
 * @param {http.Server} server - The HTTP server instance to close.
******************************************************************************/
export async function signalHandler(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>)
{
    console.log("\nClosing server and disconnecting Database...");
    disconnectDataBase();
    server.close(cleanUp);
}