import express, { Router, Response } from "express"; 
import { getAllUsers } from "../database/mongodb.js";
import { user } from "../models/users.js";
import { WithId } from "mongodb"; 

export const router: Router = express.Router();

// GET x2, POST, PUT, DELETE
router.get('/user', async (_, res: Response<WithId<user>[]>) => {
    try {
        const allUsers: WithId<user>[] = await getAllUsers();
        res.json(allUsers); 
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json;
    }
});
