import { BadRequestError, NotFoundError , requireAuth, validateRequest } from '@liliana-lessa-microservices-1/common';
import { body } from 'express-validator';
import express, {Request, Response } from 'express';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

const EPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
        .notEmpty()
        //this custom here is coupling the id format to mongo db.
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);    
        if (!ticket) {
            throw new NotFoundError();
        }

        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })

        await order.save();

        //publish order created event

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };
