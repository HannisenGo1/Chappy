import express, { Express, NextFunction, Request, Response } from 'express';
import { router as userRouter } from './routes/restForUsers.js';
import { router as chatRouter } from './routes/restForChats.js';
import { connect } from './database/mongodbkanaler.js';
import jwt from 'jsonwebtoken';
import { validateLogin } from './users/validateLogin.js';
const { sign , verify} = jwt;
import cors from 'cors';
import { getUserByname } from './database/mongodb.js';

export type UserId = string

const port: number = Number(process.env.PORT || 3000);
const app: Express = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));
interface Payload {
    userId: string;
    iat: number;
}


app.use(express.json());
app.use('/', express.json()) 

app.use('/', (req: Request, _, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

app.use('/', express.static('./src')); 

// Hämta kanaler
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

// Routes! 
app.use('/api/chats', chatRouter);
app.use('/api/users', userRouter);

// Inloggning
app.post('/login', async (req: Request, res: Response) => {
    if (!process.env.SECRET) {
        res.sendStatus(500);
        return;
    }
    
    console.log('Body är: ', req.body);
    const userId = await validateLogin(req.body.name, req.body.password);
    console.log('user id i login: ', userId);
    
    if (!userId) {
        res.status(401).send({
            "error": "Unauthorized",
            "message": "You are not authorized to access"
        });
        return;
    }
    
    const payload = { userId };
    const token: string = sign(payload, process.env.SECRET);
    res.send({ jwt: token });
});

app.get('/protected', (req: Request, res: Response) => {
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
    let payload: Payload
    try {
        // const paycode som Payload
        payload = verify(token, process.env.SECRET) as Payload;
        console.log('Payload', payload)
    } catch (error) {
        res.sendStatus(400);
        return
    }
    let userId: UserId = payload.userId
    const user = getUserByname(userId)
    if (!user) {
        res.sendStatus(404)
        return
    }
});


// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
