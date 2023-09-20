import { Listener, Subjects, TicketUpdatedEvent } from "@liliana-lessa-microservices-1/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price } = data;
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error ('Ticket not found');
        }

        ticket.title = title;
        ticket.price = price;

        await ticket.save();

        msg.ack();
    }

}