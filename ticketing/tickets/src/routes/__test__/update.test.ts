import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsWrappper } from '../../nats-wrapper';

it(
    'returns 404 if provided id does not exist',
    async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        return await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test',
            price: 10
        })
        .expect(404);
    }
);

it(
    'returns 401 if the user is not authenticated',
    async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        return await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test',
            price: 10
        })
        .expect(401);
    }
);

it(
    'returns 401 if the user does not own the ticket',
    async () => {
        const title = 'test';
        const price = 10;

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title,
            price
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test1',
            price: 11
        })
        .expect(401);

        const tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);

        const ticket = tickets.pop();
        expect(ticket?.title).toEqual(title);
        expect(ticket?.price).toEqual(price);
    }
);


it(
    'returns 400 if the user provides an invalid title or price',
    async () => {
        const title = 'test';
        const price = 10;
        const cookie =  global.signin();

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 10
        })
        .expect(400);

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test1',
            price: -10
        })
        .expect(400);

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test1',
        })
        .expect(400);
    }
);

it(
    'it updates the ticket provided valid inputs',
    async () => {
        const title = 'test';
        const price = 10;
        const cookie =  global.signin();

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test1',
            price: 123
        })
        .expect(200);

        const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

        expect(ticketResponse.body.title).toEqual('test1');
        expect(ticketResponse.body.price).toEqual(123);
    }
);

it(
    'publishes an event',
    async () => {
        const title = 'test';
        const price = 10;
        const cookie =  global.signin();

        const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test1',
            price: 123
        })
        .expect(200);

        expect(natsWrappper.stan.publish).toHaveBeenCalledTimes(2);
    }
);
