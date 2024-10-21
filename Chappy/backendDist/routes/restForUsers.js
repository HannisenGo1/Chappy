import express from "express";
import { getUser, createUser, deleteUser } from "../database/mongodb.js";
import { validateLogin } from '../users/validateLogin.js';
const router = express.Router();
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
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userId = await validateLogin(username, password);
        if (userId) {
            res.status(200).json({ userId, message: "Login successful" });
        }
        else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});
//skapa användaren genom api/users/create
router.post('/create', async (req, res) => {
    const newUser = req.body;
    try {
        const result = await createUser(newUser);
        res.status(201).json({ createdUser: result, message: "User created " });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});
// Ta bort en användare
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await deleteUser(userId);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "User deleted" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});
export { router };
