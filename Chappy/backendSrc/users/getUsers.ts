import { MongoClient, Collection } from 'mongodb';
import { user } from '../models/users.js'; 


async function connectToDatabase(): Promise<{ client: MongoClient; collection: Collection<user> }> {
    const connectionString: string | undefined = process.env.CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Connection string is not defined.");
    }

    const client = new MongoClient(connectionString);

    try {
        await client.connect(); 
        console.log("Successfully connected to MongoDB!");

        const database = client.db("Chappy"); 
        const collection = database.collection<user>("user"); 

        return { client, collection }; 

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error; 
    }
}

export { connectToDatabase };
