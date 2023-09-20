import { NotFoundError, requireAuth } from '@liliana-lessa-microservices-1/common';
import express, {Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id)  {
            throw new NotFoundError(); //better to not authorized, because it's not passing the information that the ticket exists.
        }
        
        order.status = OrderStatus.Cancelled;

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.stan).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter }
