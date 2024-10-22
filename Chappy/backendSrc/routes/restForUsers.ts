import express, { Router, Response, Request } from "express"; 
import { getUser , createUser, deleteUser, connect} from "../database/mongodb.js";
//import {validateLogin} from '../users/validateLogin.js'
import { ObjectId } from "mongodb";
//import  jwt  from "jsonwebtoken";
// const { sign } = jwt;


const router: Router = express.Router()

router.get('/', async (_, res: Response) => {
    try {
        const users = await getUser();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});



//skapa användaren genom api/users/create
router.post('/create', async (req: Request, res: Response) => {
    const newUser = req.body;

    try {
        const result = await createUser(newUser);
        res.status(201).json({ createdUser: result, message: "User created " });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});


// Ta bort en användare
router.delete('/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const result = await deleteUser(userId);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "User deleted" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

// I din userRouter eller en ny router
router.get('/api/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const [collection, client] = await connect();
        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            await client.close();
            return;
        }

        await client.close();
        res.status(200).json({ name: user.name, id: user._id }); 
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});


export  {router}
