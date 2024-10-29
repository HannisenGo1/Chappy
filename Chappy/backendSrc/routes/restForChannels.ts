import express, { Router, Response, Request } from "express"; 
import { connect, insertMessage} from "../database/mongodbkanaler.js";
import { ObjectId } from "mongodb";
import { SendMessage } from "../models/kanaler.js";

const router: Router = express.Router();


// Hämta alla kanaler
router.get('/', async (_, res: Response) => {
    try {
        const [collection, client] = await connect();
        const channels = await collection.find({}).toArray(); 
        res.status(200).json(channels);
        await client.close();
    } catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).send("Failed to fetch channels.");
    }
});

router.get('/kanaler', async (req, res) => {
    try {
        const [collection, client] = await connect();
        const category = req.query.category; 
        const kanaler = await collection.find(category ? { topic: category } : {}).toArray();
        res.status(200).json(kanaler);
        await client.close();
    } catch (error) {
        console.error("Fel vid hämtning av kanaler:", error);
        res.status(500).send("Något gick fel vid hämtning av kanaler.");
    }
});

// användaren kan skriva in ett meddelande i kanalen!

router.post('/', async (req: Request<{}, {}, SendMessage>, res: Response) => {
    const {topic, message } = req.body;
    
    try {
        const messageAdded = await insertMessage(topic, message);
        if (messageAdded) {
            res.status(201).json({ message: "Message added to channel." });
        } else {
            res.status(404).json({ message: "Channel with specified topic not found." });
        }
    } catch (error) {
        console.error('Error creating kanal message', error);
        res.status(500).json({ message: "Failed to create channel message." });
    }
})



router.delete('/kanaler/:id', async (req:Request, res:Response) =>{
    const messageId = req.params.id;
    
    try {
        const [collection, client] = await connect ();
        const resultat = await collection.deleteOne({ _id: new ObjectId(messageId)})
        if (resultat.deletedCount > 0){
            res.status(200).json({ message: " kanal medd. deleted "})
        } else {
            res.status(404).json ({ message: "kanal medd not found"})
        }
        await client.close()
    } catch (error) {
        console.error('Error with deleting kanal medd.', error)
        res.status(500).json({message: 'FFailed to delete kanal medd.'})
    }
})




export { router };

