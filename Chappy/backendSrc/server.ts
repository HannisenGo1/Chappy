import express, { Express, NextFunction, Request, Response} from 'express';
import {router as userRouter} from './routes/restForUsers.js'


const port: number = Number(process.env.PORT || 3000);
const app: Express = express();

app.use(express.json());
app.use('/', express.static('../src'));

app.use('/users', (req: Request, _, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

//app.use('/api', userRouter);
app.post('/login', (_, res:Response) => {
    if (process.env.SECRET){
        res.sendStatus(500)
        return
    }
})

app.get('/', (_, res: Response) => {
    res.send("user API!");
});

app.use('/api', userRouter);


// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
