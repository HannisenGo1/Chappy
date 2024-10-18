import express, { Express, NextFunction, Request} from 'express';
import {router as userRouter} from './routes/restForUsers.js'
import { saveChatMessages, chatMessages } from './database/mongodbChat.js';
import {saveChannels, channels, connect} from './database/mongodbkanaler.js'

const port: number = Number(process.env.PORT || 3000);
const app: Express = express();

app.use(express.json());


app.use('/', (req: Request, _, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});


app.use(express.static('./public'));


app.get('/', (_, res) => {
    res.send('Welcome to the server!');
});

app.get('/', async () => {
    await saveChatMessages(chatMessages);
});

app.get('/', async (_, res) => {
    try {
        await saveChannels(channels); 
        res.status(200).send("Kanaler har sparats!"); 
    } catch (error) {
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
    } catch (error) {
        console.error("Fel vid hämtning av kanaler:", error);
        res.status(500).send("Något gick fel vid hämtning av kanaler.");
    }
});

app.use('/api/users', userRouter);
// http://localhost:5000/api/user


// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
