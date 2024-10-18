import { MongoClient } from 'mongodb';
// koppla till MongoDB
async function connect() {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("Connection string is not defined in environment variables.");
    }
    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db("chappy");
    const collection = database.collection("chats");
    return [collection, client];
}
// Spara chat meddelanden i databasen
export async function saveChatMessages(messages) {
    const [collection, client] = await connect();
    try {
        await collection.insertMany(messages);
        console.log("Chat messages saved successfully!");
    }
    catch (error) {
        console.error("Error saving chat messages:", error);
    }
    finally {
        await client.close();
    }
}
export const chatMessages = [
    {
        sender: "Robin",
        receiver: "Lars",
        message: "Hej Lars! Hur mår du?",
    },
    {
        sender: "Lars",
        receiver: "Robin",
        message: "Tja Robin! Jag mår bra, tack! Själv?",
    },
    {
        sender: "Fredrik",
        receiver: "Anna",
        message: "Hej Anna! Har du sett senaste avsnittet av serien?",
    },
    {
        sender: "Anna",
        receiver: "Fredrik",
        message: "Ja, det var så spännande! Vad tyckte du?",
    },
    {
        sender: "Erik",
        receiver: "Robin",
        message: "Robin, vi borde ses snart!",
    },
    {
        sender: "Robin",
        receiver: "Erik",
        message: "Absolut! Vad sägs om på fredag?",
    },
    {
        sender: "Lars",
        receiver: "Fredrik",
        message: "Ska vi gå och ta en öl senare?",
    },
    {
        sender: "Fredrik",
        receiver: "Lars",
        message: "Låter bra! Vi ses då.",
    }
];
saveChatMessages(chatMessages);
