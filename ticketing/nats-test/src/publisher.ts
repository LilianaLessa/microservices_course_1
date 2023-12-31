import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect(
    'ticketing',
    randomBytes(4).toString('hex'),
    {
        // run a temporary port forwarding on k8s, by
        // kubectl port-forward <pod name> <host port>:<pod port>
        url: 'http://localhost:4222'
    }
);

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        });
    } catch (err) {
        console.error(err);
    }
});