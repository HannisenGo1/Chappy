import express, { Router, Response, Request } from "express"; 
import { connect } from "../database/mongodbChat.js"; 
import { ObjectId } from "mongodb";
const router: Router = express.Router();

// Hämta alla chattmeddelanden
router.get('/', async (_, res: Response) => {
    try {
        const [collection, client] = await connect();
        const chats = await collection.find({}).toArray(); 
        res.json(chats);
        await client.close(); 
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
});

// Skapa en ny chattmeddelande
// Spara det nya meddelandet
router.post('/', async (req: Request, res: Response) => {
    const newMessage = req.body;
    
    try {
        const [collection, client] = await connect();
        
        await collection.insertOne(newMessage); 
        res.status(201).json({ message: "Chat message created" });
        await client.close(); 
    } catch (error) {
        console.error('Error creating chat message:', error);
        res.status(500).json({ message: 'Failed to create chat message' });
    }
});


router.delete('/:id', async (req: Request, res: Response) => {
    const messageId = req.params.id;
    
    try {
        const [collection, client] = await connect();
        const result = await collection.deleteOne({ _id: new ObjectId(messageId) }); 
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Chat message deleted" });
        } else {
            res.status(404).json({ message: "Chat message not found" });
        }
        await client.close(); 
    } catch (error) {
        console.error('Error deleting chat message:', error);
        res.status(500).json({ message: 'Failed to delete chat message' });
    }
});

export { router };
