import express from 'express';
import { router as userRouter } from './routes/restForUsers.js';
import { router as chatRouter } from './routes/restForChats.js';
import { router as kanalRouter } from './routes/restForChannels.js';
import jwt from 'jsonwebtoken';
import { validateLogin } from './validate/validateLogin.js';
const { sign, verify } = jwt;
import cors from 'cors';
import { getUserByname } from './database/mongodb.js';
const port = Number(process.env.PORT || 3000);
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/', express.json());
app.use('/', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
app.use('/', express.static('./src'));
// Routes! 
app.use('/api/chats', chatRouter);
app.use('/api/users', userRouter);
app.use('/kanaler', kanalRouter);
// Inloggning
app.post('/login', async (req, res) => {
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
app.get('/protected', (req, res) => {
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
        payload = verify(token, process.env.SECRET);
        console.log('Payload', payload);
    }
    catch (error) {
        res.sendStatus(400);
        return;
    }
    let userId = payload.userId;
    const user = getUserByname(userId);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json({ message: 'Protected data accessed', userId });
});
// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
