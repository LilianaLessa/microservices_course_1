import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@liliana-lessa-microservices-1/common';
import express, {Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { natsWrappper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const {title, price} = req.body;

        ticket.set({
            title, 
            price
        });

        await ticket.save();

        await new TicketUpdatedPublisher(natsWrappper.stan).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId:  ticket.userId
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter }
