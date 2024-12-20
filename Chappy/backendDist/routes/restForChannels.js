import express from "express";
import { connect, insertMessage, createChannel, getChannels } from "../database/mongodbkanaler.js";
import { ObjectId } from "mongodb";
const router = express.Router();
// Hämta alla kanaler   /kanaler
router.get('/', async (_, res) => {
    try {
        const channels = await getChannels();
        res.status(200).json(channels);
    }
    catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).json({ message: "Failed to fetch channels." });
    }
});
// användaren kan skriva in ett meddelande i kanalen!
router.post('/', async (req, res) => {
    const { topic, message } = req.body;
    try {
        const messageAdded = await insertMessage(topic, message);
        if (messageAdded) {
            res.status(201).json({ message: "Message added to channel." });
        }
        else {
            res.status(404).json({ message: "Channel with specified topic not found." });
        }
    }
    catch (error) {
        console.error('Error creating kanal message', error);
        res.status(500).json({ message: "Failed to create channel message." });
    }
});
//skapa kanal genom /kanaler/create
router.post('/create', async (req, res) => {
    const newChannel = req.body;
    try {
        const result = await createChannel(newChannel);
        console.log('Kanal skapad:', result);
        res.status(201).json({ createdChannel: result, message: "Channel created " });
    }
    catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Failed to create channel' });
    }
});
router.get('/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const [collection, client] = await connect();
        const message = await collection.findOne({ _id: new ObjectId(messageId) });
        if (message) {
            res.status(200).json(message);
        }
        else {
            res.status(404).json({ message: "kanal medd not found" });
        }
        await client.close();
    }
    catch (error) {
        console.error('Error fetching kanal medd.', error);
        res.status(500).json({ message: 'Failed to fetch kanal medd.' });
    }
});
router.delete('/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const [collection, client] = await connect();
        const resultat = await collection.deleteOne({ _id: new ObjectId(messageId) });
        if (resultat.deletedCount > 0) {
            res.status(200).json({ message: " kanal medd. deleted " });
        }
        else {
            res.status(404).json({ message: "kanal medd not found" });
        }
        await client.close();
    }
    catch (error) {
        console.error('Error with deleting kanal medd.', error);
        res.status(500).json({ message: 'FFailed to delete kanal medd.' });
    }
});
export { router };
