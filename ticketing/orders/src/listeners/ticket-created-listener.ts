import { Listener, Subjects, TicketCreatedEvent } from "@liliana-lessa-microservices-1/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price, id } = data;
        const ticket = Ticket.build({ title, price, id });

        ticket.save();

        msg.ack();
    }
}
