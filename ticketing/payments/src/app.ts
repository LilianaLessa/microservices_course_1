import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, erroHandler } from '@liliana-lessa-microservices-1/common';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));
app.use(currentUser);


app.all('*', async () => {
    throw new NotFoundError();
});

app.use(erroHandler);

export { app };
