import { MongoClient, Collection,FindCursor, WithId } from 'mongodb';
import { user } from '../models/users'; 


export async function connectToDatabase(): Promise<{ client: MongoClient; collection: Collection<user> }> {
    const connectionString: string | undefined = process.env.CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("Connection string is not defined. Please set CONNECTION_STRING in .env file.");
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


export async function getAllUsers(): Promise<WithId<user>[]> {
    let x: { client: MongoClient; collection: Collection<user> } | undefined;

    try {
        x = await connectToDatabase(); 
        const cursor: FindCursor<WithId<user>> = x.collection.find({});
        const found: WithId<user>[] = await cursor.toArray(); 

        console.log("Found users:", found); 

        if (found.length < 1) {
            console.log("No users available today :/");
        }
        return found; 

    } catch (error) {
        console.error('Error fetching users', error);
        throw error; 
    } finally {
        if (x) {
            await x.client.close();
        }
    }
}