import express, { Express, NextFunction, Request, Response } from 'express';
import { router as userRouter } from './routes/restForUsers.js';
import { router as chatRouter } from './routes/restForChats.js';
import { router as kanalRouter } from './routes/restForChannels.js';
import jwt from 'jsonwebtoken';
import { validateLogin } from './validate/validateLogin.js';
const { sign , verify} = jwt;

import { getUserByname } from './database/mongodb.js';

export type UserId = string

const port: number = Number(process.env.PORT || 3000);
const app: Express = express();


interface Payload {
    userId: string;
    iat: number;
}

app.use('/', express.json()) 

app.use('/', (req: Request, _, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

app.use('/', express.static('./src')); 


// Routes! 
app.use('/api/chats', chatRouter);
app.use('/api/users', userRouter);
app.use('/kanaler', kanalRouter);
// Inloggning
app.post('/login', async (req: Request, res: Response) => {
    if (!process.env.SECRET) {
        console.error('SECRET not defined');
        res.sendStatus(500);
        return;
    }

    const userId = await validateLogin(req.body.name, req.body.password);

    if (!userId) {
        res.status(401).send({
            "error": "Unauthorized",
            "message": "You are not authorized to access"
        });
        return;
    }

    const payload = { userId, name: req.body.name }; 
    const token: string = sign(payload, process.env.SECRET);
    res.send({ jwt: token, name: req.body.name });
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
    res.json({ message: 'Protected data accessed', userId });
});


// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
