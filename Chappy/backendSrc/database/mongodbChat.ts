import { MongoClient, Collection } from 'mongodb';

export interface ChatMessage {
    sender: string;
    receiver: string;
    message: string;
}

// Funktion för att koppla till MongoDB
export async function connect(): Promise<[Collection<ChatMessage>, MongoClient]> {
    const connectionString: string | undefined = process.env.CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("Connection string is not defined in environment variables.");
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db("chappy");
    const collection = database.collection<ChatMessage>("chats");

    return [collection, client];
}


// Funktion för att spara nya chattmeddelanden
export async function saveChatMessages(messages: ChatMessage[]): Promise<void> {
    const [collection, client] = await connect();

    try {
        await collection.insertMany(messages); 
        console.log("Chat messages saved successfully!");
    } catch (error) {
        console.error("Error saving chat messages:", error);
    } finally {
        await client.close();
    }
}

// Kontrollera om meddelandet redan finns
async function chatMessageExists(message: ChatMessage): Promise<boolean> {
    const [collection, client] = await connect();
    try {
        const existingMessage = await collection.findOne({
            sender: message.sender,
            receiver: message.receiver,
            message: message.message
        });
        return existingMessage !== null;
    } finally {
        await client.close();
    }
}




    const messages: ChatMessage[] = [
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

    // Kontrollera varje meddelande innan vi lägger till det
    for (const message of messages) {
        const exists = await chatMessageExists(message);
        if (!exists) {
            await saveChatMessages([message]);
        }
    }


