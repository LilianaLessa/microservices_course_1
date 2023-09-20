import mongoose from 'mongoose';

import { app } from './app';
import { natsWrappper } from './nats-wrapper';


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
    
    await natsWrappper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );
    natsWrappper.stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    process.on('SIGINT', () => natsWrappper.stan.close());
    process.on('SIGTERM', () => natsWrappper.stan.close());
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
