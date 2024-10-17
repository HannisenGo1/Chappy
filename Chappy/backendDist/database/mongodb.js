import { MongoClient } from 'mongodb';
export async function connectToDatabase() {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Connection string is not defined. Please set CONNECTION_STRING in .env file.");
    }
    const client = new MongoClient(connectionString);
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
        const database = client.db("Chappy");
        const collection = database.collection("chappy");
        return { client, collection };
    }
    catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
}
//hämta alla användare från databasen
export async function getAllUsers() {
    let x;
    try {
        x = await connectToDatabase(); // Anslut till databasen
        // Hämta alla dokument från samlingen
        const cursor = x.collection.find({});
        const found = await cursor.toArray();
        console.log("Found users:", found); // Logga vad som hittades
        if (found.length < 1) {
            console.log("No users available today :/");
        }
        return found;
    }
    catch (error) {
        console.error('Error fetching users', error);
        throw error;
    }
    finally {
        if (x) {
            await x.client.close();
        }
    }
}
