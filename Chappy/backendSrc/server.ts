import express, { Express, NextFunction, Request} from 'express';
import {router as userRouter} from './routes/restForUsers.js'


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


app.use('/api/users', userRouter);
// http://localhost:5000/api/user

// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
