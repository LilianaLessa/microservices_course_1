import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';


const startNats = async () => {
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );
    natsWrapper.stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    process.on('SIGINT', () => natsWrapper.stan.close());
    process.on('SIGTERM', () => natsWrapper.stan.close());

    //event listeners
    new TicketCreatedListener(natsWrapper.stan).listen();
    new TicketUpdatedListener(natsWrapper.stan).listen();
    new ExpirationCompleteListener(natsWrapper.stan).listen();
    new PaymentCreatedListener(natsWrapper.stan).listen();
}

const start = async() => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {      
        await startNats();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    });
}

start();
