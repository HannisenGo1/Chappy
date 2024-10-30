import { MongoClient } from "mongodb";
// kopplas med databasen
export async function connect() {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Connection string is not defined in environment variables.");
    }
    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db("chappy");
    const collection = db.collection("kanaler");
    return [collection, client];
}
export async function getChannels() {
    const [col, client] = await connect();
    const result = await col.find({}).toArray();
    await client.close();
    return result;
}
// infoga nytt meddelande i en kanal
// uppdatera dokumentet med det ämnet och lägg till meddelandet
// Returnera true om meddelandet lades till
export async function insertMessage(topic, message) {
    const [collection, client] = await connect();
    try {
        const result = await collection.updateOne({ topic }, { $push: { messages: message } });
        return result.modifiedCount > 0;
    }
    catch (error) {
        console.error('Error inserting message:', error);
        return false;
    }
    finally {
        await client.close();
    }
}
// Skapa en ny kanal
export async function createChannel(newchannel) {
    const [col, client] = await connect();
    const result = await col.insertOne(newchannel);
    await client.close();
    return result;
}
// Funktion för att spara kanaler i databasen
export async function saveChannels(channels) {
    const [collection, client] = await connect();
    try {
        await collection.deleteMany({});
        await collection.insertMany(channels);
        console.log("Kanaler har sparats!");
    }
    catch (error) {
        console.error("Fel vid sparande av kanaler:", error);
    }
    finally {
        await client.close();
    }
}
// kanaler med användare och meddelanden
