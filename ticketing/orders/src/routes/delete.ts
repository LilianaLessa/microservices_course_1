import { NotFoundError, requireAuth } from '@liliana-lessa-microservices-1/common';
import express, {Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id)  {
            throw new NotFoundError(); //better to not authorized, because it's not passing the information that the ticket exists.
        }

        order.status = OrderStatus.Canceled;

        await order.save();

        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter }
