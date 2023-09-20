import { Publisher, Subjects, TicketUpdatedEvent } from "@liliana-lessa-microservices-1/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
