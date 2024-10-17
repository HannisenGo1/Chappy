import express from "express";
import { getAllUsers } from "../database/mongodb.js";
export const router = express.Router();
// GET x2, POST, PUT, DELETE
router.get('/user', async (_, res) => {
    try {
        const allUsers = await getAllUsers();
        res.json(allUsers);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json;
    }
});
