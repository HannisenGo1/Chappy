import express from 'express';
import { router as userRouter } from './routes/restForUsers.js';
const port = Number(process.env.PORT || 3000);
const app = express();
app.use(express.json());
app.use('/', express.static('../src'));
// Middleware för att logga förfrågningar
app.use('/users', (req, _, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});
//app.use('/api', userRouter);
app.post('/login', (_, res) => {
    if (process.env.SECRET) {
        res.sendStatus(500);
        return;
    }
});
// Root-rutt
app.get('/', (_, res) => {
    res.send("user API!");
});
app.use('/api', userRouter);
// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på port ${port}`);
});
