import { Publisher, Subjects, TicketCreatedEvent } from "@liliana-lessa-microservices-1/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
