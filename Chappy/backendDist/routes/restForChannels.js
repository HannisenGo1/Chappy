import express from "express";
import { connect } from "../database/mongodb.js";
const router = express.Router();
// Hämta alla kanaler
router.get('/', async (_, res) => {
    try {
        const [collection, client] = await connect();
        const channels = await collection.find({}).toArray();
        res.status(200).json(channels);
        await client.close();
    }
    catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).send("Failed to fetch channels.");
    }
});
export { router };
