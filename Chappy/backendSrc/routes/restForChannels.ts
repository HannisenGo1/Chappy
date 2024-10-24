import express, { Router, Response } from "express"; 
import { connect } from "../database/mongodbkanaler.js";

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


export { router };