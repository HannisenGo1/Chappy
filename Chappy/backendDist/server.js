import express from 'express';
import { router as userRouter } from './routes/restForUsers.js';
import { router as chatRouter } from './routes/restForChats.js';
import { saveChannels, channels, connect } from './database/mongodbkanaler.js';
import jwt from 'jsonwebtoken';
import { validateLogin } from './users/validateLogin.js';
const { sign } = jwt;
const port = Number(process.env.PORT || 3000);
const app = express();
app.use(express.json());
app.use('/', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
app.use(express.static('./public'));
app.get('/', (_, res) => {
    res.send('Welcome to the server!');
});
app.get('/', async (_, res) => {
    try {
        await saveChannels(channels);
        res.status(200).send("Kanaler har sparats!");
    }
    catch (error) {
        console.error("Fel vid sparande av kanaler:", error);
        res.status(500).send("Något gick fel vid sparande av kanaler.");
    }
});
//http://localhost:5000/kanaler
app.get('/kanaler', async (req, res) => {
    try {
        const [collection, client] = await connect();
        const category = req.query.category;
        const kanaler = await collection.find(category ? { topic: category } : {}).toArray();
        res.status(200).json(kanaler);
        await client.close();
    }
    catch (error) {
        console.error("Fel vid hämtning av kanaler:", error);
        res.status(500).send("Något gick fel vid hämtning av kanaler.");
    }
});
app.use('/api/chats', chatRouter);
app.use('/api/users', userRouter);
// http://localhost:5000/api/user
app.post('/login', (req, res) => {
    if (!process.env.SECRET) {
        res.sendStatus(500);
        return;
    }
    console.log('Body är: ', req.body);
    const userId = validateLogin(req.body.username, req.body.password);
    console.log('user id: ', userId);
    if (!userId) {
        res.status(401).send({
            "error": "Unauthorized",
            "message": "You are not authorized to access"
        });
        return;
    }
    const payload = {
        userId
    };
    const token = sign(payload, process.env.SECRET);
    res.send({ jwt: token });
});
// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
