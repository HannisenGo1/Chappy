import { MongoClient, Collection } from "mongodb";
import { Channel, Message } from "../models/kanaler"; 

// kopplas med databasen
export async function connect(): Promise<[Collection<Channel>, MongoClient]> {
    const connectionString: string | undefined = process.env.CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("Connection string is not defined in environment variables.");
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db("chappy");
    const collection = database.collection<Channel>("kanaler");

    return [collection, client];
}

// infoga nytt meddelande i en kanal
export async function insertMessage(topic: string, message: Message): Promise<boolean> {
    const [collection, client] = await connect(); 

    try {
 // uppdatera dokumentet med det ämnet och lägg till meddelandet
        const result = await collection.updateOne(
            { topic }, 
            { $push: { messages: message } }
        );
// Returnera true om meddelandet lades till
        return result.modifiedCount > 0; 
    } catch (error) {
        console.error('Error inserting message:', error);
        return false; 
    } finally {
        await client.close(); 
    }
}

// Funktion för att spara kanaler i databasen
export async function saveChannels(channels: Channel[]): Promise<void> {
    const [collection, client] = await connect();

    try {
        await collection.deleteMany({}); 
        await collection.insertMany(channels);
        console.log("Kanaler har sparats!");
    } catch (error) {
        console.error("Fel vid sparande av kanaler:", error);
    } finally {
        await client.close();
    }
}


// kanaler med användare och meddelanden
const channels: Channel[] = [
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
            { user: { username: "Robin"}, content: "Vad tycker ni om React?" },
            { user: { username: "Anna"}, content: "Jag älskar det! Det är så flexibelt." },
        ],
    },
    {
        name: "#Backend",
        description: "Fokuserar på backend-teknologier som Node.js, Express och databaser.",
        topic: "Backend-utveckling",
        users: [
            { username: "Fredrik"},
            { username: "Lars"},
        ],
        isOpen: false, 
        messages: [
            { user: { username: "Fredrik"}, content: "Hur implementerar man JWT?" },
            { user: { username: "Lars"}, content: "Det finns många exempel på nätet." },
        ],
    },
    {
        name: "#Allmänt",
        description: "En plats för allmänna diskussioner och social interaktion.",
        topic: "Allmän diskussion",
        users: [
            { username: "Erik"},
            { username: "Anna"},
        ],
        isOpen: true, 
        messages: [
            { user: { username: "Erik"}, content: "Vad ska vi göra i helgen?" },
            { user: { username: "Anna"}, content: "Vi borde ha en filmkväll!" },
        ],
    },
    {
        name: "#Nyheter",
        description: "Dela och diskutera de senaste nyheterna inom teknik och utveckling.",
        topic: "Nyhetsdiskussioner",
        users: [
            { username: "Robin"},
            { username: "Fredrik"},
        ],
        isOpen: false,
        messages: [
            { user: { username: "Robin"}, content: "Har ni sett de senaste uppdateringarna i JavaScript?" },
            { user: { username: "Fredrik"}, content: "Ja, det ser riktigt lovande ut!" },
        ],
    },
];

saveChannels(channels)
