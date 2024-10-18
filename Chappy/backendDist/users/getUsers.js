import { MongoClient } from 'mongodb';
async function connectToDatabase() {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Connection string is not defined.");
    }
    const client = new MongoClient(connectionString);
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
        const database = client.db("Chappy");
        const collection = database.collection("user");
        return { client, collection };
    }
    catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
}
export { connectToDatabase };
