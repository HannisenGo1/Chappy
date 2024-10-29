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
const channels = [
    {
        name: "#Frontend",
        description: "Diskussioner om frontend-teknologier som HTML, CSS och JavaScript.",
        topic: "Frontend-utveckling",
        users: [
            { username: "Robin" },
            { username: "Anna" },
        ],
        isOpen: true,
        messages: [
            { user: { username: "Robin" }, content: "Vad tycker ni om React?" },
            { user: { username: "Anna" }, content: "Jag älskar det! Det är så flexibelt." },
        ],
    },
    {
        name: "#Backend",
        description: "Fokuserar på backend-teknologier som Node.js, Express och databaser.",
        topic: "Backend-utveckling",
        users: [
            { username: "Fredrik" },
            { username: "Lars" },
        ],
        isOpen: false,
        messages: [
            { user: { username: "Fredrik" }, content: "Hur implementerar man JWT?" },
            { user: { username: "Lars" }, content: "Det finns många exempel på nätet." },
        ],
    },
    {
        name: "#Allmänt",
        description: "En plats för allmänna diskussioner och social interaktion.",
        topic: "Allmän diskussion",
        users: [
            { username: "Erik" },
            { username: "Anna" },
        ],
        isOpen: true,
        messages: [
            { user: { username: "Erik" }, content: "Vad ska vi göra i helgen?" },
            { user: { username: "Anna" }, content: "Vi borde ha en filmkväll!" },
        ],
    },
    {
        name: "#Nyheter",
        description: "Dela och diskutera de senaste nyheterna inom teknik och utveckling.",
        topic: "Nyhetsdiskussioner",
        users: [
            { username: "Robin" },
            { username: "Fredrik" },
        ],
        isOpen: false,
        messages: [
            { user: { username: "Robin" }, content: "Har ni sett de senaste uppdateringarna i JavaScript?" },
            { user: { username: "Fredrik" }, content: "Ja, det ser riktigt lovande ut!" },
        ],
    },
];
saveChannels(channels);
