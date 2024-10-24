import express from "express";
import { getUserByname } from "../database/mongodb.js";
import { validateLogin } from '../validate/validateLogin.js';
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
const router = express.Router();
router.post('/login', async (req, res) => {
    if (!process.env.SECRET) {
        console.error('SECRET not defined');
        res.sendStatus(500);
        return;
    }
    console.log('Body är: ', req.body);
    const userId = await validateLogin(req.body.name, req.body.password);
    console.log('User id i login: ', userId);
    if (!userId) {
        res.status(401).send({
            "error": "Unauthorized",
            "message": "You are not authorized to access"
        });
        return;
    }
    const payload = { userId };
    const token = sign(payload, process.env.SECRET);
    res.send({ jwt: token });
});
router.get('/protected', async (req, res) => {
    if (!process.env.SECRET) {
        res.sendStatus(500);
        return;
    }
    let token = req.headers.authorization;
    console.log('Header', token);
    if (!token) {
        res.sendStatus(401);
        return;
    }
    let payload;
    try {
        // Verifiera token och omvandla till Payload-typen
        payload = verify(token, process.env.SECRET);
        console.log('Payload', payload);
    }
    catch (error) {
        res.sendStatus(400);
        return;
    }
    const userId = payload.userId;
    const user = await getUserByname(userId); // Se till att detta kan hämta användaren korrekt
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json({ message: 'Protected data accessed', userId });
});
export { router };
