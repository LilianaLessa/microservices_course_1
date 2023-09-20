import { Listener, OrderCreatedEvent, Subjects,  } from "@liliana-lessa-microservices-1/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`Waiting ${delay} to trigger expiration for orderId ${data.id}`);

        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay
            }
        );

        msg.ack();
    }
}