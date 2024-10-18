import express from "express";
import { getUser } from "../database/mongodb.js";
const router = express.Router();
// GET x2, POST, PUT, DELETE
router.get('/', async (_, res) => {
    try {
        const users = await getUser();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
export { router };
