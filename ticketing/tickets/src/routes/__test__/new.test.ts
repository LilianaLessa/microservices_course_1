import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrappper } from '../../nats-wrapper';

it(
    'has a route handler listening to /api/tickets for post requests',
    async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({});

        expect(response.status).not.toEqual(404);    
    }
);

it(
    'can be only accessed if the user is signed in',
    async () => {
        return await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401);
    }
);

it(
    'returns a status other than 401 if the user is signed in',
    async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({});

        expect(response.status).not.toEqual(401);   
    }
);

it(
    'returns an error if an invalid title is provided',
    async () => {
         await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: '',
                price: 10
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                price: 10
            })
            .expect(400);
    }
);


it(
    'returns an error if an invalid price is provided',
    async () => {
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test',
        })
        .expect(400);
    }
);


it(
    'creates a ticket with valid parameters',
    async () => {
        let tickets = await Ticket.find({});
        expect(tickets.length).toEqual(0);

        const title = 'test';
        const price = 20;
        
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);

        const ticket = tickets.pop();
        expect(ticket?.title).toEqual(title);
        expect(ticket?.price).toEqual(price);
    }
);

it(
    'publishes an event',
    async () => {
        const title = 'test';
        const price = 20;
        
        await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);

        expect(natsWrappper.stan.publish).toHaveBeenCalled();
    }
);

