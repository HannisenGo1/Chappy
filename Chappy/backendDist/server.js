import express from 'express';
import { router as userRouter } from './routes/restForUsers.js';
import { saveChatMessages, chatMessages } from './database/mongodbChat.js';
import { saveChannels, channels, connect } from './database/mongodbkanaler.js';
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
app.get('/', async () => {
    await saveChatMessages(chatMessages);
});
app.get('/', async (_, res) => {
    try {
        await saveChannels(channels); // Spara kanaler i databasen
        res.status(200).send("Kanaler har sparats!"); // Skicka svar tillbaka till klienten
    }
    catch (error) {
        console.error("Fel vid sparande av kanaler:", error);
        res.status(500).send("Något gick fel vid sparande av kanaler.");
    }
});
// Ny endpoint för att hämta kanaler
app.get('/kanaler', async (_, res) => {
    try {
        const [collection, client] = await connect(); // Koppla till databasen
        const kanaler = await collection.find({}).toArray(); // Hämta alla kanaler
        res.status(200).json(kanaler); // Skicka tillbaka kanaler som JSON
        await client.close(); // Stäng klienten
    }
    catch (error) {
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
