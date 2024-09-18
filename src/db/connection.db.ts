import mongoose from "mongoose";
/******************************************************************************
 * @description: Establishes a connection to the MongoDB database using the provided URI.
 * @param dbUri: The URI of the MongoDB database to connect to (found in .env).
******************************************************************************/
export function connectDataBase(dbUri: string)
{
    const db = mongoose.connection;
    mongoose.Promise = global.Promise;

    try
    {
        mongoose.connect(dbUri);
        console.log("Connecting to Database...");
    }
    catch(error)
    {
        console.error('Failed to connect MongoDB', error);
        process.exit(1);
    }

    db.on("error", (error: Error) => console.error("MongoDB connection error:", error));
    db.once("open", () => console.log("Connected to MongoDB"));
}
/******************************************************************************
 * @description: Gracefully disconnects from the MongoDB database.
******************************************************************************/
export async function disconnectDataBase()
{
    try
    {
        await mongoose.connection.close(true);
        console.log("MongoDB connection closed.");
    }
    catch(error)
    {
        console.error("Error while closing Database connection:", error);
    }
}