import express from 'express'; 
import 'express-async-errors'
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, erroHandler } from '@liliana-lessa-microservices-1/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
}));
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(erroHandler);

export { app };
